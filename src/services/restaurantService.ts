
import { supabase } from "@/integrations/supabase/client";
import { RestaurantTable, TableSession, MenuCategory, ItemModifier } from "@/types/database";

// Get all restaurant tables for a restaurant
export const getRestaurantTables = async (restaurantId: string): Promise<RestaurantTable[]> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true);

    if (error) throw error;
    
    return data as RestaurantTable[];
  } catch (error) {
    console.error('Error fetching restaurant tables:', error);
    return [];
  }
};

// Get a restaurant table by ID
export const getRestaurantTableById = async (tableId: string): Promise<RestaurantTable | null> => {
  try {
    const { data, error } = await supabase
      .from('restaurant_tables')
      .select('*')
      .eq('id', tableId)
      .single();

    if (error) throw error;
    
    return data as RestaurantTable;
  } catch (error) {
    console.error('Error fetching restaurant table:', error);
    return null;
  }
};

// Create a table session
export const createTableSession = async (tableId: string, restaurantId: string): Promise<TableSession | null> => {
  try {
    // Generate a random 6-character alphanumeric code
    const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { data, error } = await supabase
      .from('table_sessions')
      .insert({
        table_id: tableId,
        restaurant_id: restaurantId,
        session_code: sessionCode,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    
    return data as TableSession;
  } catch (error) {
    console.error('Error creating table session:', error);
    return null;
  }
};

// Get a table session by ID
export const getTableSessionById = async (sessionId: string): Promise<TableSession | null> => {
  try {
    const { data, error } = await supabase
      .from('table_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    
    return data as TableSession;
  } catch (error) {
    console.error('Error fetching table session:', error);
    return null;
  }
};

// Get a table session by code
export const getTableSessionByCode = async (sessionCode: string): Promise<TableSession | null> => {
  try {
    const { data, error } = await supabase
      .from('table_sessions')
      .select('*')
      .eq('session_code', sessionCode)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    
    return data as TableSession;
  } catch (error) {
    console.error('Error fetching table session by code:', error);
    return null;
  }
};

// Get menu categories for a restaurant
export const getMenuCategories = async (restaurantId: string): Promise<MenuCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    
    return data as MenuCategory[];
  } catch (error) {
    console.error('Error fetching menu categories:', error);
    return [];
  }
};

// Get modifiers for a food item
export const getFoodItemModifiers = async (foodId: string): Promise<ItemModifier[]> => {
  try {
    const { data, error } = await supabase
      .from('food_item_modifiers')
      .select(`
        modifier_id,
        item_modifiers:modifier_id(*)
      `)
      .eq('food_id', foodId);

    if (error) throw error;
    
    // Extract the modifiers from the joined query
    const modifiers = data.map(item => item.item_modifiers);
    return modifiers as ItemModifier[];
  } catch (error) {
    console.error('Error fetching food item modifiers:', error);
    return [];
  }
};

// Get food items by category
export const getFoodItemsByCategory = async (categoryId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('food_item_categories')
      .select(`
        food_id,
        food_items:food_id(*)
      `)
      .eq('category_id', categoryId);

    if (error) throw error;
    
    // Extract the food items from the joined query
    const foodItems = data.map(item => item.food_items);
    return foodItems;
  } catch (error) {
    console.error('Error fetching food items by category:', error);
    return [];
  }
};

// End a table session
export const endTableSession = async (sessionId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('table_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error ending table session:', error);
    return false;
  }
};
