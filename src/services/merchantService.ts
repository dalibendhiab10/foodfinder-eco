
import { supabase } from "@/integrations/supabase/client";

export interface MerchantProfile {
  id: string;
  user_id: string;
  business_name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  logo_url: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Collaborator {
  id: string;
  merchant_id: string;
  user_id: string;
  permissions: {
    view_orders: boolean;
    manage_products: boolean;
    [key: string]: boolean;
  };
  created_at: string;
  user_email?: string;
}

// Fetch merchant profile for current user
export const fetchMerchantProfile = async (): Promise<MerchantProfile | null> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return null;

    const { data, error } = await supabase
      .from('merchant_profiles')
      .select('*')
      .eq('user_id', session.session.user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No profile found
        return null;
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching merchant profile:', error);
    throw error;
  }
};

// Create a new merchant profile
export const createMerchantProfile = async (profile: Partial<Omit<MerchantProfile, 'id' | 'user_id' | 'created_at' | 'is_approved'>>): Promise<MerchantProfile> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('Not authenticated');

    // Insert merchant profile
    const { data, error } = await supabase
      .from('merchant_profiles')
      .insert({
        ...profile,
        user_id: session.session.user.id
      })
      .select()
      .single();
    
    if (error) throw error;

    // Add merchant role to user
    await supabase
      .from('user_roles')
      .insert({
        user_id: session.session.user.id,
        role: 'merchant'
      });
    
    return data;
  } catch (error) {
    console.error('Error creating merchant profile:', error);
    throw error;
  }
};

// Update merchant profile
export const updateMerchantProfile = async (
  profileId: string, 
  updates: Partial<Omit<MerchantProfile, 'id' | 'user_id' | 'created_at' | 'is_approved'>>
): Promise<MerchantProfile> => {
  try {
    const { data, error } = await supabase
      .from('merchant_profiles')
      .update(updates)
      .eq('id', profileId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error updating merchant profile:', error);
    throw error;
  }
};

// Check if user has merchant role
export const checkMerchantRole = async (): Promise<boolean> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return false;

    const { data, error } = await supabase
      .rpc('has_role', {
        user_id: session.session.user.id,
        role: 'merchant'
      });
    
    if (error) throw error;
    
    return data || false;
  } catch (error) {
    console.error('Error checking merchant role:', error);
    return false;
  }
};

// Add collaborator to merchant
export const addCollaborator = async (merchantId: string, email: string, permissions = { view_orders: true, manage_products: false }): Promise<boolean> => {
  try {
    // First get user ID from email through a custom RPC function or use an edge function
    // Since we can't query auth.users directly, we need a workaround
    // Here's a simplified example assuming users are stored in a profiles table
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();
    
    if (userError) throw userError;
    if (!userData) throw new Error('User not found');
    
    // Add collaborator
    const { error } = await supabase
      .from('merchant_collaborators')
      .insert({
        merchant_id: merchantId,
        user_id: userData.id,
        permissions
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding collaborator:', error);
    throw error;
  }
};

// Get collaborators for a merchant
export const getMerchantCollaborators = async (merchantId: string): Promise<Collaborator[]> => {
  try {
    const { data, error } = await supabase
      .from('merchant_collaborators')
      .select('*')
      .eq('merchant_id', merchantId);
    
    if (error) throw error;
    
    // Parse the JSON permissions to ensure they match the expected type
    return data?.map(item => ({
      ...item,
      permissions: typeof item.permissions === 'string' 
        ? JSON.parse(item.permissions) 
        : item.permissions
    })) || [];
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    throw error;
  }
};

// Get merchants where user is a collaborator
export const getUserCollaborations = async (): Promise<{merchantId: string, businessName: string, permissions: any}[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return [];

    const { data, error } = await supabase
      .from('merchant_collaborators')
      .select(`
        merchant_id,
        permissions,
        merchant_profiles:merchant_profiles(business_name)
      `)
      .eq('user_id', session.session.user.id);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      merchantId: item.merchant_id,
      permissions: item.permissions,
      businessName: item.merchant_profiles?.business_name || 'Unknown Business'
    }));
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return [];
  }
};
