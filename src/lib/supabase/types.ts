// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sku: string | null
          unit_price: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sku?: string | null
          unit_price?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sku?: string | null
          unit_price?: number | null
        }
        Relationships: []
      }
      purchase_request_items: {
        Row: {
          created_at: string
          id: string
          material_id: string | null
          purchase_request_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          material_id?: string | null
          purchase_request_id?: string | null
          quantity?: number
        }
        Update: {
          created_at?: string
          id?: string
          material_id?: string | null
          purchase_request_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_request_items_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          board: string | null
          buyer_id: string | null
          created_at: string
          delivery_date: string | null
          description: string
          id: string
          is_completed: boolean
          is_delayed: boolean
          need_date: string | null
          order_number: string | null
          priority: string
          project_id: string | null
          request_number: string | null
          request_type_id: string | null
          requester_id: string | null
          status_changed_at: string | null
          status_id: string | null
          type: string
        }
        Insert: {
          board?: string | null
          buyer_id?: string | null
          created_at?: string
          delivery_date?: string | null
          description: string
          id?: string
          is_completed?: boolean
          is_delayed?: boolean
          need_date?: string | null
          order_number?: string | null
          priority?: string
          project_id?: string | null
          request_number?: string | null
          request_type_id?: string | null
          requester_id?: string | null
          status_changed_at?: string | null
          status_id?: string | null
          type?: string
        }
        Update: {
          board?: string | null
          buyer_id?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string
          id?: string
          is_completed?: boolean
          is_delayed?: boolean
          need_date?: string | null
          order_number?: string | null
          priority?: string
          project_id?: string | null
          request_number?: string | null
          request_type_id?: string | null
          requester_id?: string | null
          status_changed_at?: string | null
          status_id?: string | null
          type?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: products
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   sku: text (nullable)
//   description: text (nullable)
//   category: text (nullable)
//   unit_price: numeric (nullable)
//   created_at: timestamp with time zone (not null, default: now())
// Table: purchase_request_items
//   id: uuid (not null, default: gen_random_uuid())
//   purchase_request_id: uuid (nullable)
//   material_id: text (nullable)
//   quantity: numeric (not null, default: 1)
//   created_at: timestamp with time zone (not null, default: now())
// Table: purchase_requests
//   id: uuid (not null, default: gen_random_uuid())
//   request_number: text (nullable)
//   description: text (not null)
//   type: text (not null, default: 'Material'::text)
//   project_id: text (nullable)
//   request_type_id: text (nullable)
//   priority: text (not null, default: 'P2'::text)
//   need_date: text (nullable)
//   delivery_date: text (nullable)
//   status_changed_at: timestamp with time zone (nullable)
//   is_completed: boolean (not null, default: false)
//   is_delayed: boolean (not null, default: false)
//   status_id: text (nullable)
//   requester_id: text (nullable)
//   buyer_id: text (nullable)
//   board: text (nullable)
//   order_number: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())

// --- CONSTRAINTS ---
// Table: products
//   PRIMARY KEY products_pkey: PRIMARY KEY (id)
//   UNIQUE products_sku_key: UNIQUE (sku)
// Table: purchase_request_items
//   PRIMARY KEY purchase_request_items_pkey: PRIMARY KEY (id)
//   FOREIGN KEY purchase_request_items_purchase_request_id_fkey: FOREIGN KEY (purchase_request_id) REFERENCES purchase_requests(id) ON DELETE CASCADE
// Table: purchase_requests
//   PRIMARY KEY purchase_requests_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: products
//   Policy "Allow authenticated to delete products" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Allow authenticated to insert products" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: true
//   Policy "Allow authenticated to select products" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: true
//   Policy "Allow authenticated to update products" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: purchase_request_items
//   Policy "Allow all for authenticated users on purchase_request_items" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: purchase_requests
//   Policy "Allow all for authenticated users on purchase_requests" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- INDEXES ---
// Table: products
//   CREATE UNIQUE INDEX products_sku_key ON public.products USING btree (sku)

