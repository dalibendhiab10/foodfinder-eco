import { supabase } from '@/integrations/supabase/client';

export interface Restaurant {
  id: string;
  name: string;
  description: string | null;
  location: string;
  image_url: string | null;
}

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  original_price: number;
  discounted_price: number;
  image_url: string | null;
  restaurant_id: string;
  restaurant_name?: string;
  quantity: number;
  is_flash_deal: boolean;
  distance: string | null;
  time_remaining: string | null;
  tags: string[] | null;
}

export async function getAllFoodItems(): Promise<FoodItem[]> {
  const { data, error } = await supabase
    .from('food_items')
    .select(`
      *,
      restaurants:restaurant_id (
        name
      )
    `);

  if (error) {
    console.error('Error fetching food items:', error);
    throw error;
  }

  // Format the data to match our expected structure
  return (data || []).map(item => ({
    ...item,
    restaurant_name: item.restaurants?.name || '',
  }));
}

export async function getFlashDeals(): Promise<FoodItem[]> {
  const { data, error } = await supabase
    .from('food_items')
    .select(`
      *,
      restaurants:restaurant_id (
        name
      )
    `)
    .eq('is_flash_deal', true);

  if (error) {
    console.error('Error fetching flash deals:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    restaurant_name: item.restaurants?.name || '',
  }));
}

export async function getNonFlashDeals(): Promise<FoodItem[]> {
  const { data, error } = await supabase
    .from('food_items')
    .select(`
      *,
      restaurants:restaurant_id (
        name
      )
    `)
    .eq('is_flash_deal', false);

  if (error) {
    console.error('Error fetching non-flash deals:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    restaurant_name: item.restaurants?.name || '',
  }));
}

export async function getFoodItemById(id: string): Promise<FoodItem | null> {
  const { data, error } = await supabase
    .from('food_items')
    .select(`
      *,
      restaurants:restaurant_id (
        name
      )
    `)
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching food item with id ${id}:`, error);
    throw error;
  }

  if (!data) return null;

  return {
    ...data,
    restaurant_name: data.restaurants?.name || '',
  };
}

export async function searchFoodItems(query: string): Promise<FoodItem[]> {
  const { data, error } = await supabase
    .from('food_items')
    .select(`
      *,
      restaurants:restaurant_id (
        name
      )
    `)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('title');

  if (error) {
    console.error('Error searching food items:', error);
    throw error;
  }

  return (data || []).map(item => ({
    ...item,
    restaurant_name: item.restaurants?.name || '',
  }));
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: 'order' | 'promotion' | 'delivery' | 'payment' | 'system'
) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        is_read: false
      });

    if (error) {
      console.error('Error creating notification:', error);
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in createNotification:', error);
    return false;
  }
}
