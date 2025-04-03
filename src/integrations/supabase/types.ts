export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      food_item_categories: {
        Row: {
          category_id: string
          food_id: string
        }
        Insert: {
          category_id: string
          food_id: string
        }
        Update: {
          category_id?: string
          food_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_item_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "menu_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_item_categories_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
        ]
      }
      food_item_modifiers: {
        Row: {
          food_id: string
          modifier_id: string
        }
        Insert: {
          food_id: string
          modifier_id: string
        }
        Update: {
          food_id?: string
          modifier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_item_modifiers_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_item_modifiers_modifier_id_fkey"
            columns: ["modifier_id"]
            isOneToOne: false
            referencedRelation: "item_modifiers"
            referencedColumns: ["id"]
          },
        ]
      }
      food_items: {
        Row: {
          created_at: string
          description: string
          discounted_price: number
          distance: string | null
          id: string
          image_url: string | null
          is_flash_deal: boolean | null
          original_price: number
          quantity: number
          restaurant_id: string
          tags: string[] | null
          time_remaining: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description: string
          discounted_price: number
          distance?: string | null
          id?: string
          image_url?: string | null
          is_flash_deal?: boolean | null
          original_price: number
          quantity?: number
          restaurant_id: string
          tags?: string[] | null
          time_remaining?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          discounted_price?: number
          distance?: string | null
          id?: string
          image_url?: string | null
          is_flash_deal?: boolean | null
          original_price?: number
          quantity?: number
          restaurant_id?: string
          tags?: string[] | null
          time_remaining?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      item_modifiers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_multiple: boolean | null
          is_required: boolean | null
          name: string
          options: Json | null
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_multiple?: boolean | null
          is_required?: boolean | null
          name: string
          options?: Json | null
          restaurant_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_multiple?: boolean | null
          is_required?: boolean | null
          name?: string
          options?: Json | null
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_modifiers_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_levels: {
        Row: {
          benefits: string
          created_at: string
          id: string
          name: string
          points: number
        }
        Insert: {
          benefits: string
          created_at?: string
          id?: string
          name: string
          points: number
        }
        Update: {
          benefits?: string
          created_at?: string
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          created_at: string
          description: string
          icon: string
          id: string
          name: string
          points: number
        }
        Insert: {
          created_at?: string
          description: string
          icon: string
          id?: string
          name: string
          points: number
        }
        Update: {
          created_at?: string
          description?: string
          icon?: string
          id?: string
          name?: string
          points?: number
        }
        Relationships: []
      }
      menu_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          restaurant_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          restaurant_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          restaurant_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_categories_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          food_id: string
          id: string
          name: string
          order_id: string
          quantity: number
          restaurant_id: string
          selected_modifiers: Json | null
          special_instructions: string | null
          table_session_id: string | null
          unit_price: number
        }
        Insert: {
          created_at?: string
          food_id: string
          id?: string
          name: string
          order_id: string
          quantity: number
          restaurant_id: string
          selected_modifiers?: Json | null
          special_instructions?: string | null
          table_session_id?: string | null
          unit_price: number
        }
        Update: {
          created_at?: string
          food_id?: string
          id?: string
          name?: string
          order_id?: string
          quantity?: number
          restaurant_id?: string
          selected_modifiers?: Json | null
          special_instructions?: string | null
          table_session_id?: string | null
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_table_session_id_fkey"
            columns: ["table_session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          delivery_fee: number
          id: string
          is_paid: boolean | null
          order_type: string | null
          restaurant_table_id: string | null
          status: string
          subtotal: number
          table_session_id: string | null
          tax: number
          total: number
          user_id: string
        }
        Insert: {
          created_at?: string
          delivery_fee: number
          id?: string
          is_paid?: boolean | null
          order_type?: string | null
          restaurant_table_id?: string | null
          status?: string
          subtotal: number
          table_session_id?: string | null
          tax: number
          total: number
          user_id: string
        }
        Update: {
          created_at?: string
          delivery_fee?: number
          id?: string
          is_paid?: boolean | null
          order_type?: string | null
          restaurant_table_id?: string | null
          status?: string
          subtotal?: number
          table_session_id?: string | null
          tax?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_table_id_fkey"
            columns: ["restaurant_table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_table_session_id_fkey"
            columns: ["table_session_id"]
            isOneToOne: false
            referencedRelation: "table_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      point_earning_actions: {
        Row: {
          action: string
          created_at: string
          id: string
          points: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          points: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          points?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          eco_level: string
          eco_points: number
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          eco_level?: string
          eco_points?: number
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          eco_level?: string
          eco_points?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      restaurant_tables: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          qr_code: string | null
          restaurant_id: string
          table_number: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          qr_code?: string | null
          restaurant_id: string
          table_number: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          qr_code?: string | null
          restaurant_id?: string
          table_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          location: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
        }
        Relationships: []
      }
      table_sessions: {
        Row: {
          ended_at: string | null
          id: string
          restaurant_id: string
          session_code: string
          started_at: string
          status: string
          table_id: string
          user_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          restaurant_id: string
          session_code: string
          started_at?: string
          status?: string
          table_id: string
          user_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          restaurant_id?: string
          session_code?: string
          started_at?: string
          status?: string
          table_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "table_sessions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_sessions_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "restaurant_tables"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
