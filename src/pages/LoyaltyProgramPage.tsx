
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Gift, Leaf, ChevronRight, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BottomNav from '@/components/BottomNav';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getUserLoyaltyProfile, 
  getLoyaltyLevels, 
  getAvailableRewards, 
  getPointEarningActions,
  redeemReward,
  LoyaltyLevel,
  UserLoyaltyProfile,
  LoyaltyReward,
  PointEarningAction
} from '@/services/loyaltyService';

const LoyaltyProgramPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserLoyaltyProfile | null>(null);
  const [loyaltyLevels, setLoyaltyLevels] = useState<LoyaltyLevel[]>([]);
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [pointEarningActions, setPointEarningActions] = useState<PointEarningAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [levels, rewards, actions] = await Promise.all([
          getLoyaltyLevels(),
          getAvailableRewards(),
          getPointEarningActions()
        ]);

        // Add icons to levels
        const levelsWithIcons = levels.map(level => {
          if (level.name === 'Eco Novice' || level.name === 'Earth Protector') {
            return { ...level, icon: <Leaf className="text-eco-500" size={24} /> };
          } else if (level.name === 'Green Guardian') {
            return { ...level, icon: <Award className="text-eco-600" size={24} /> };
          } else {
            return { ...level, icon: <Trophy className="text-eco-700" size={24} /> };
          }
        });
        
        setLoyaltyLevels(levelsWithIcons);
        setAvailableRewards(rewards);
        setPointEarningActions(actions);
      } catch (error) {
        console.error('Error fetching loyalty data:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load loyalty data',
          description: 'Please try again later.',
        });
      }
    };
    
    fetchData();
  }, [toast]);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const profile = await getUserLoyaltyProfile(user.id);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load profile',
          description: 'Could not load your loyalty information. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user, toast]);
  
  // Calculate user level and progress
  const getUserLevel = (): { 
    currentLevel: LoyaltyLevel; 
    nextLevel: LoyaltyLevel | null;
    progressPercentage: number;
    pointsToNextLevel: number;
  } => {
    const ecoPoints = userProfile?.ecoPoints || 0;
    
    if (loyaltyLevels.length === 0) {
      return {
        currentLevel: {
          name: 'Eco Novice',
          points: 0,
          icon: <Leaf className="text-eco-500" size={24} />,
          benefits: 'Starting level'
        },
        nextLevel: null,
        progressPercentage: 0,
        pointsToNextLevel: 0
      };
    }
    
    // Find current level
    const userLevelIndex = loyaltyLevels.findIndex(
      (level, index, arr) => 
        ecoPoints >= level.points && 
        (index === arr.length - 1 || ecoPoints < arr[index + 1].points)
    );
    
    const currentLevel = userLevelIndex >= 0 
      ? loyaltyLevels[userLevelIndex] 
      : loyaltyLevels[0];
      
    const nextLevel = userLevelIndex < loyaltyLevels.length - 1 
      ? loyaltyLevels[userLevelIndex + 1] 
      : null;
      
    // Calculate progress percentage
    const progressPercentage = nextLevel 
      ? ((ecoPoints - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100
      : 100;
      
    // Calculate points to next level
    const pointsToNextLevel = nextLevel 
      ? nextLevel.points - ecoPoints 
      : 0;
      
    return {
      currentLevel,
      nextLevel,
      progressPercentage,
      pointsToNextLevel
    };
  };
  
  const handleRedeemReward = async (reward: LoyaltyReward) => {
    if (!user || !userProfile) return;
    
    if (userProfile.ecoPoints < reward.points) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.points - userProfile.ecoPoints} more points to redeem this reward`,
      });
      return;
    }
    
    try {
      setRedeeming(reward.id);
      
      const result = await redeemReward(user.id, reward.id, reward.points);
      
      if (result.success) {
        // Update local state to reflect the change
        setUserProfile(prev => 
          prev ? {...prev, ecoPoints: prev.ecoPoints - reward.points} : null
        );
        
        toast({
          title: "Reward redeemed!",
          description: `You've successfully redeemed: ${reward.name}`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: "Redemption failed",
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        variant: 'destructive',
        title: "Something went wrong",
        description: "Could not redeem reward. Please try again.",
      });
    } finally {
      setRedeeming(null);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-eco-500" />
      </div>
    );
  }
  
  const { currentLevel, nextLevel, progressPercentage, pointsToNextLevel } = getUserLevel();
  
  return (
    <div className="container max-w-md mx-auto pb-20">
      <div className="bg-eco-500 text-white pt-12 pb-6 px-4 rounded-b-3xl">
        <Link to="/profile" className="flex items-center gap-2 text-white/80 mb-4">
          <ChevronRight className="rotate-180" size={20} />
          <span>Back to Profile</span>
        </Link>
        
        <h1 className="text-2xl font-bold mb-4">Eco Rewards</h1>
        
        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-white/70">Current Points</p>
              <p className="text-3xl font-bold">{userProfile?.ecoPoints || 0}</p>
            </div>
            {currentLevel && (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 flex items-center justify-center rounded-full bg-white/20 mb-1">
                  {currentLevel.icon}
                </div>
                <p className="text-sm">{currentLevel.name}</p>
              </div>
            )}
          </div>
          
          {nextLevel && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Level Progress</span>
                <span>{userProfile?.ecoPoints || 0} / {nextLevel.points}</span>
              </div>
              <Progress value={progressPercentage} className="h-2 bg-white/20" />
              <p className="text-xs text-white/70">
                {pointsToNextLevel} more points until {nextLevel.name}
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-4 py-6 space-y-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
              <Gift size={20} className="text-eco-500" />
              Available Rewards
            </h2>
            
            <div className="space-y-3">
              {availableRewards.length === 0 ? (
                <p className="text-muted-foreground text-center py-2">No rewards available</p>
              ) : (
                availableRewards.map((reward) => (
                  <div 
                    key={reward.id} 
                    className={`flex justify-between items-center p-3 border rounded-lg ${
                      (userProfile?.ecoPoints || 0) >= reward.points 
                        ? 'border-eco-200' 
                        : 'border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{reward.icon}</div>
                      <div>
                        <p className="font-medium">{reward.name}</p>
                        <p className="text-sm text-muted-foreground">{reward.description}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-eco-600">{reward.points} pts</span>
                      <Button 
                        size="sm" 
                        variant={(userProfile?.ecoPoints || 0) >= reward.points ? "default" : "outline"}
                        className={(userProfile?.ecoPoints || 0) >= reward.points ? "bg-eco-500 hover:bg-eco-600" : ""}
                        onClick={() => handleRedeemReward(reward)}
                        disabled={redeeming === reward.id}
                      >
                        {redeeming === reward.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : null}
                        Redeem
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
              <Award size={20} className="text-eco-500" />
              Levels & Benefits
            </h2>
            
            <div className="space-y-3">
              {loyaltyLevels.length === 0 ? (
                <p className="text-muted-foreground text-center py-2">No loyalty levels available</p>
              ) : (
                loyaltyLevels.map((level, index) => {
                  const isCurrentLevel = currentLevel?.name === level.name;
                  
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center gap-3 p-3 border rounded-lg ${
                        isCurrentLevel ? 'border-eco-500 bg-eco-50' : 'border-gray-100'
                      }`}
                    >
                      <div>
                        {level.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{level.name}</p>
                          <p className="text-sm font-medium">{level.points} pts</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {level.benefits}
                        </p>
                      </div>
                      {isCurrentLevel && (
                        <div className="h-6 w-6 rounded-full bg-eco-500 flex items-center justify-center">
                          <Award size={14} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <h2 className="font-bold text-lg flex items-center gap-2 mb-4">
              <Leaf size={20} className="text-eco-500" />
              How to Earn Points
            </h2>
            
            <div className="space-y-2">
              {pointEarningActions.length === 0 ? (
                <p className="text-muted-foreground text-center py-2">No earning actions available</p>
              ) : (
                pointEarningActions.map((item, index) => (
                  <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                    <span>{item.action}</span>
                    <span className="font-medium text-eco-600">{item.points}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default LoyaltyProgramPage;
