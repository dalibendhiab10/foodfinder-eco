
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Gift, Leaf, ChevronRight } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import BottomNav from '@/components/BottomNav';
import { userMockData } from '@/lib/mock-data';
import { Link } from 'react-router-dom';

const LoyaltyProgramPage = () => {
  const { toast } = useToast();
  const user = userMockData;
  
  const loyaltyLevels = [
    { name: 'Eco Novice', points: 0, icon: <Leaf className="text-eco-500" size={24} /> },
    { name: 'Earth Protector', points: 1000, icon: <Leaf className="text-eco-500" size={24} /> },
    { name: 'Green Guardian', points: 2500, icon: <Award className="text-eco-600" size={24} /> },
    { name: 'Eco Champion', points: 5000, icon: <Trophy className="text-eco-700" size={24} /> },
    { name: 'Food Waste Hero', points: 10000, icon: <Trophy className="text-amber-500" size={24} /> },
  ];
  
  const userLevel = loyaltyLevels.findIndex(level => user.ecoPoints < level.points) - 1;
  const currentLevel = userLevel >= 0 ? loyaltyLevels[userLevel] : loyaltyLevels[0];
  const nextLevel = userLevel < loyaltyLevels.length - 1 ? loyaltyLevels[userLevel + 1] : null;
  
  const pointsToNextLevel = nextLevel ? nextLevel.points - user.ecoPoints : 0;
  const progressPercentage = nextLevel 
    ? ((user.ecoPoints - currentLevel.points) / (nextLevel.points - currentLevel.points)) * 100
    : 100;
  
  const availableRewards = [
    { id: 1, name: '10% Discount', description: 'Get 10% off on your next order', points: 500, icon: '🎁' },
    { id: 2, name: 'Free Delivery', description: 'Free delivery on your next order', points: 800, icon: '🚚' },
    { id: 3, name: 'Exclusive Box', description: 'Special surprise eco box', points: 1500, icon: '📦' },
    { id: 4, name: 'Plant a Tree', description: 'We plant a tree in your name', points: 2000, icon: '🌳' },
  ];
  
  const redeemReward = (reward) => {
    if (user.ecoPoints < reward.points) {
      toast({
        title: "Not enough points",
        description: `You need ${reward.points - user.ecoPoints} more points to redeem this reward`,
      });
    } else {
      toast({
        title: "Reward redeemed!",
        description: `You've successfully redeemed: ${reward.name}`,
      });
    }
  };
  
  const pointEarningActions = [
    { action: "Save food from waste", points: "50-100 points" },
    { action: "Complete 5 orders", points: "250 points" },
    { action: "Share on social media", points: "100 points" },
    { action: "Refer a friend", points: "500 points" },
    { action: "Use reusable bags", points: "50 points" },
  ];
  
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
              <p className="text-3xl font-bold">{user.ecoPoints}</p>
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
                <span>{user.ecoPoints} / {nextLevel.points}</span>
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
              {availableRewards.map((reward) => (
                <div 
                  key={reward.id} 
                  className={`flex justify-between items-center p-3 border rounded-lg ${user.ecoPoints >= reward.points ? 'border-eco-200' : 'border-gray-200 opacity-70'}`}
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
                      variant={user.ecoPoints >= reward.points ? "default" : "outline"}
                      className={user.ecoPoints >= reward.points ? "bg-eco-500 hover:bg-eco-600" : ""}
                      onClick={() => redeemReward(reward)}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              ))}
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
              {loyaltyLevels.map((level, index) => (
                <div 
                  key={index} 
                  className={`flex items-center gap-3 p-3 border rounded-lg ${index === userLevel ? 'border-eco-500 bg-eco-50' : 'border-gray-100'}`}
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
                      {index === 0 ? 'Starting level' : 
                       index === 1 ? '5% discount on orders' : 
                       index === 2 ? '10% discount & priority pickup' : 
                       index === 3 ? '15% discount & exclusive offers' :
                       '20% discount & VIP benefits'}
                    </p>
                  </div>
                  {index === userLevel && (
                    <div className="h-6 w-6 rounded-full bg-eco-500 flex items-center justify-center">
                      <Award size={14} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
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
              {pointEarningActions.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b last:border-b-0">
                  <span>{item.action}</span>
                  <span className="font-medium text-eco-600">{item.points}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default LoyaltyProgramPage;
