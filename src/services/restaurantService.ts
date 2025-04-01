
import { supabase } from '@/integrations/supabase/client';
import type { RestaurantTable, TableSession, MenuCategory, ItemModifier } from '@/types/database';

// Restaurant Tables
export async function getRestaurantTables(restaurantId: string): Promise<RestaurantTable[]> {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching restaurant tables:', error);
    throw error;
  }

  return data || [];
}

export async function getTableById(tableId: string): Promise<RestaurantTable | null> {
  const { data, error } = await supabase
    .from('restaurant_tables')
    .select('*')
    .eq('id', tableId)
    .single();

  if (error) {
    console.error(`Error fetching table with id ${tableId}:`, error);
    throw error;
  }

  return data;
}

// Table Sessions
export async function createTableSession(tableId: string, restaurantId: string, userId?: string): Promise<TableSession> {
  // Generate a random 6-character session code
  const sessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const { data, error } = await supabase
    .from('table_sessions')
    .insert({
      table_id: tableId,
      restaurant_id: restaurantId,
      user_id: userId,
      session_code: sessionCode
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating table session:', error);
    throw error;
  }

  return data;
}

export async function getTableSessionByCode(sessionCode: string): Promise<TableSession | null> {
  const { data, error } = await supabase
    .from('table_sessions')
    .select('*')
    .eq('session_code', sessionCode)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error(`Error fetching table session with code ${sessionCode}:`, error);
    throw error;
  }

  return data;
}

export async function endTableSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from('table_sessions')
    .update({
      status: 'ended',
      ended_at: new Date().toISOString()
    })
    .eq('id', sessionId);

  if (error) {
    console.error(`Error ending table session ${sessionId}:`, error);
    throw error;
  }
}

// Menu Categories
export async function getMenuCategories(restaurantId: string): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching menu categories:', error);
    throw error;
  }

  return data || [];
}

// Item Modifiers
export async function getItemModifiers(foodId: string): Promise<ItemModifier[]> {
  const { data, error } = await supabase
    .from('food_item_modifiers')
    .select(`
      modifier_id,
      item_modifiers!inner (
        id,
        name,
        description,
        options,
        is_multiple,
        is_required,
        restaurant_id,
        created_at
      )
    `)
    .eq('food_id', foodId);

  if (error) {
    console.error(`Error fetching modifiers for food item ${foodId}:`, error);
    throw error;
  }

  // Transform the data to match our interface
  return data.map(item => item.item_modifiers) || [];
}

// Food Items by Category
export async function getFoodItemsByCategory(categoryId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('food_item_categories')
    .select(`
      food_id,
      food_items!inner (
        *,
        restaurants:restaurant_id (
          name
        )
      )
    `)
    .eq('category_id', categoryId);

  if (error) {
    console.error(`Error fetching food items for category ${categoryId}:`, error);
    throw error;
  }

  // Transform the data to match our FoodItem interface
  return (data || []).map(item => ({
    ...item.food_items,
    restaurant_name: item.food_items.restaurants?.name || '',
  }));
}

// Update Order Service
export async function placeTableOrder(
  tableSessionId: string, 
  items: any[], 
  userId: string, 
  restaurantId: string, 
  restaurantTableId: string
): Promise<{success: boolean, orderId?: string}> {
  try {
    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + tax;

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        subtotal,
        tax,
        delivery_fee: 0, // No delivery fee for table orders
        total,
        status: 'pending',
        order_type: 'dine_in',
        table_session_id: tableSessionId,
        restaurant_table_id: restaurantTableId
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      food_id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      restaurant_id: restaurantId,
      table_session_id: tableSessionId,
      selected_modifiers: item.selectedModifiers || [],
      special_instructions: item.specialInstructions || ''
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return { success: true, orderId: order.id };
  } catch (error) {
    console.error('Error placing table order:', error);
    return { success: false };
  }
}
