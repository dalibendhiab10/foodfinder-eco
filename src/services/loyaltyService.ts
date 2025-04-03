
import { supabase } from '@/integrations/supabase/client';

export interface LoyaltyLevel {
  name: string;
  points: number;
  icon: React.ReactNode; // This will be set in the component
  benefits: string;
}

export interface LoyaltyReward {
  id: string;
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

// Get loyalty levels from Supabase
export const getLoyaltyLevels = async (): Promise<LoyaltyLevel[]> => {
  try {
    const { data, error } = await supabase
      .from('loyalty_levels')
      .select('*')
      .order('points', { ascending: true });
    
    if (error) {
      console.error('Error fetching loyalty levels:', error);
      return [];
    }
    
    return data.map(level => ({
      name: level.name,
      points: level.points,
      icon: null, // Will be set in component
      benefits: level.benefits
    }));
  } catch (error) {
    console.error('Error in getLoyaltyLevels:', error);
    return [];
  }
};

// Get available rewards from Supabase
export const getAvailableRewards = async (): Promise<LoyaltyReward[]> => {
  try {
    const { data, error } = await supabase
      .from('loyalty_rewards')
      .select('*')
      .order('points', { ascending: true });
    
    if (error) {
      console.error('Error fetching loyalty rewards:', error);
      return [];
    }
    
    return data.map(reward => ({
      id: reward.id,
      name: reward.name,
      description: reward.description,
      points: reward.points,
      icon: reward.icon
    }));
  } catch (error) {
    console.error('Error in getAvailableRewards:', error);
    return [];
  }
};

// Get point earning actions from Supabase
export const getPointEarningActions = async (): Promise<PointEarningAction[]> => {
  try {
    const { data, error } = await supabase
      .from('point_earning_actions')
      .select('*');
    
    if (error) {
      console.error('Error fetching point earning actions:', error);
      return [];
    }
    
    return data.map(action => ({
      action: action.action,
      points: action.points
    }));
  } catch (error) {
    console.error('Error in getPointEarningActions:', error);
    return [];
  }
};

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
      ecoPoints: data.eco_points,
      ecoLevel: data.eco_level
    };
  } catch (error) {
    console.error('Error in getUserLoyaltyProfile:', error);
    return null;
  }
};

// Redeem a reward
export const redeemReward = async (
  userId: string, 
  rewardId: string, 
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
