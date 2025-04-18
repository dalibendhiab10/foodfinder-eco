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

export interface CollaborationSummary {
  merchantId: string;
  businessName: string;
  permissions: Record<string, boolean>;
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
export const createMerchantProfile = async (profile: { 
  business_name: string; 
  description?: string | null; 
  address?: string | null;
  phone?: string | null;
  logo_url?: string | null;
}): Promise<MerchantProfile> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) throw new Error('Not authenticated');

    // Insert merchant profile
    const { data, error } = await supabase
      .from('merchant_profiles')
      .insert({
        business_name: profile.business_name, // Ensure business_name is explicitly included
        description: profile.description || null,
        address: profile.address || null,
        phone: profile.phone || null,
        logo_url: profile.logo_url || null,
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
    // Ensure business_name is required for update if it's included
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
    // First get user ID from email through profiles table
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

// Get collaborators for a merchant - Fixed to prevent type instantiation issues
export const getMerchantCollaborators = async (merchantId: string): Promise<Collaborator[]> => {
  try {
    // Use a simple select query without joins to avoid type issues
    const { data, error } = await supabase
      .from('merchant_collaborators')
      .select('*')
      .eq('merchant_id', merchantId);
    
    if (error) throw error;
    if (!data) return [];
    
    // Process the data after fetching to ensure proper types
    return data.map(item => ({
      id: item.id,
      merchant_id: item.merchant_id,
      user_id: item.user_id,
      created_at: item.created_at || '',
      permissions: typeof item.permissions === 'string' 
        ? JSON.parse(item.permissions) 
        : (item.permissions || {view_orders: true, manage_products: false})
    }));
  } catch (error) {
    console.error('Error fetching collaborators:', error);
    throw error;
  }
};

// Get merchants where user is a collaborator - Fixed to prevent type instantiation issues
export const getUserCollaborations = async (): Promise<CollaborationSummary[]> => {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return [];

    // Simplify query to avoid deep type instantiation
    const { data, error } = await supabase
      .from('merchant_collaborators')
      .select('merchant_id, permissions')
      .eq('user_id', session.session.user.id);
    
    if (error) throw error;
    if (!data || data.length === 0) return [];
    
    // Get merchant names in a separate query to avoid nesting
    const merchantIds = data.map(item => item.merchant_id);
    const { data: merchants, error: merchantError } = await supabase
      .from('merchant_profiles')
      .select('id, business_name')
      .in('id', merchantIds);
      
    if (merchantError) throw merchantError;
    
    // Manual join to avoid complex type issues
    const result: CollaborationSummary[] = [];
    for (const collab of data) {
      const merchant = merchants?.find(m => m.id === collab.merchant_id);
      if (merchant) {
        result.push({
          merchantId: collab.merchant_id,
          permissions: collab.permissions,
          businessName: merchant.business_name
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching collaborations:', error);
    return [];
  }
};

// Now let's add a function to assign merchant role to a specific user
export const addMerchantRoleToUser = async (userId: string): Promise<boolean> => {
  try {
    // Add merchant role to user
    const { error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'merchant'
      });
    
    if (error) {
      // If the role already exists, this is not an error
      if (error.code === '23505') {  // Unique violation
        console.log('User already has merchant role');
        return true;
      }
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error adding merchant role:', error);
    throw error;
  }
};
