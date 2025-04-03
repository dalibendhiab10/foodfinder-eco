
import { supabase } from '@/integrations/supabase/client';

export interface LoyaltyLevel {
  name: string;
  points: number;
  icon: React.ReactNode; // This will be set in the component
  benefits: string;
}

export interface LoyaltyReward {
  id: number;
  name: string;
  description: string;
  points: number;
  icon: string; 
}

export interface PointEarningAction {
  action: string;
  points: string;
}

export interface UserLoyaltyProfile {
  id: string;
  ecoPoints: number;
  ecoLevel: string;
}

// Define our loyalty levels
export const getLoyaltyLevels = (): LoyaltyLevel[] => [
  { 
    name: 'Eco Novice', 
    points: 0, 
    icon: null, // Will be set in component
    benefits: 'Starting level'
  },
  { 
    name: 'Earth Protector', 
    points: 1000, 
    icon: null,
    benefits: '5% discount on orders' 
  },
  { 
    name: 'Green Guardian', 
    points: 2500, 
    icon: null,
    benefits: '10% discount & priority pickup'
  },
  { 
    name: 'Eco Champion', 
    points: 5000, 
    icon: null,
    benefits: '15% discount & exclusive offers'
  },
  { 
    name: 'Food Waste Hero', 
    points: 10000, 
    icon: null,
    benefits: '20% discount & VIP benefits'
  },
];

// Define available rewards
export const getAvailableRewards = (): LoyaltyReward[] => [
  { id: 1, name: '10% Discount', description: 'Get 10% off on your next order', points: 500, icon: '🎁' },
  { id: 2, name: 'Free Delivery', description: 'Free delivery on your next order', points: 800, icon: '🚚' },
  { id: 3, name: 'Exclusive Box', description: 'Special surprise eco box', points: 1500, icon: '📦' },
  { id: 4, name: 'Plant a Tree', description: 'We plant a tree in your name', points: 2000, icon: '🌳' },
];

// Define point earning actions
export const getPointEarningActions = (): PointEarningAction[] => [
  { action: "Save food from waste", points: "50-100 points" },
  { action: "Complete 5 orders", points: "250 points" },
  { action: "Share on social media", points: "100 points" },
  { action: "Refer a friend", points: "500 points" },
  { action: "Use reusable bags", points: "50 points" },
];

// Get user loyalty profile
export const getUserLoyaltyProfile = async (userId: string): Promise<UserLoyaltyProfile | null> => {
  try {
    // Check if we have a profile record for this user
    const { data, error } = await supabase
      .from('profiles')
      .select('id, eco_points, eco_level')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user loyalty profile:', error);
      
      // If user doesn't exist yet, create a default profile
      if (error.code === 'PGRST116') {
        const defaultProfile = {
          id: userId,
          eco_points: 0,
          eco_level: 'Eco Novice'
        };
        
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(defaultProfile);
          
        if (insertError) {
          console.error('Error creating default profile:', insertError);
          return null;
        }
        
        return {
          id: userId,
          ecoPoints: 0,
          ecoLevel: 'Eco Novice'
        };
      }
      
      return null;
    }
    
    // Transform the data to match our interface
    return {
      id: data.id,
      ecoPoints: data.eco_points || 0,
      ecoLevel: data.eco_level || 'Eco Novice'
    };
  } catch (error) {
    console.error('Error in getUserLoyaltyProfile:', error);
    return null;
  }
};

// Redeem a reward
export const redeemReward = async (
  userId: string, 
  rewardId: number, 
  pointCost: number
): Promise<{ success: boolean; message: string }> => {
  try {
    // Get current user points
    const profile = await getUserLoyaltyProfile(userId);
    
    if (!profile) {
      return { 
        success: false, 
        message: 'User profile not found' 
      };
    }
    
    if (profile.ecoPoints < pointCost) {
      return { 
        success: false, 
        message: `Not enough points. You need ${pointCost - profile.ecoPoints} more points.` 
      };
    }
    
    // Update user points
    const { error } = await supabase
      .from('profiles')
      .update({ 
        eco_points: profile.ecoPoints - pointCost,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) {
      console.error('Error redeeming reward:', error);
      return { 
        success: false, 
        message: 'Failed to redeem reward. Please try again.' 
      };
    }
    
    // Record the redemption (could be in a separate table)
    // This is simplified, you might want to create a redemptions table
    
    return { 
      success: true, 
      message: 'Reward successfully redeemed!' 
    };
  } catch (error) {
    console.error('Error in redeemReward:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred' 
    };
  }
};
