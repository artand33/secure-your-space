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
      bookings: {
        Row: {
          admin_notes: string | null
          cancel_reason: string | null
          client_id: string | null
          client_notes: string | null
          created_at: string | null
          id: string
          job_id: string | null
          property_photo_urls: string[] | null
          quote_url: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["booking_status"]
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          cancel_reason?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          property_photo_urls?: string[] | null
          quote_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          cancel_reason?: string | null
          client_id?: string | null
          client_notes?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          property_photo_urls?: string[] | null
          quote_url?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["booking_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiries: {
        Row: {
          conversion_tracking: Json | null
          created_at: string | null
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["enquiry_status"]
        }
        Insert: {
          conversion_tracking?: Json | null
          created_at?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
        }
        Update: {
          conversion_tracking?: Json | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["enquiry_status"]
        }
        Relationships: []
      }
      job_availability: {
        Row: {
          available_from: string | null
          available_until: string | null
          exception_dates: string[] | null
          id: string
          is_ongoing: boolean | null
          job_id: string | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          exception_dates?: string[] | null
          id?: string
          is_ongoing?: boolean | null
          job_id?: string | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          exception_dates?: string[] | null
          id?: string
          is_ongoing?: boolean | null
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_availability_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_engineer: string | null
          booked_slots: number | null
          cancel_reason: string | null
          cancelled_at: string | null
          created_at: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          max_slots: number | null
          pricing_note: string | null
          recurrence_rule: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          service_type_id: string | null
          slug: string
          status: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_engineer?: string | null
          booked_slots?: number | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_slots?: number | null
          pricing_note?: string | null
          recurrence_rule?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          service_type_id?: string | null
          slug: string
          status?: Database["public"]["Enums"]["job_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_engineer?: string | null
          booked_slots?: number | null
          cancel_reason?: string | null
          cancelled_at?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          max_slots?: number | null
          pricing_note?: string | null
          recurrence_rule?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          service_type_id?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["job_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_service_type_id_fkey"
            columns: ["service_type_id"]
            isOneToOne: false
            referencedRelation: "service_types"
            referencedColumns: ["id"]
          },
        ]
      }
      login_history: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "login_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          admin_notes: string | null
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          property_type: string | null
          rejection_reason: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          admin_notes?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          property_type?: string | null
          rejection_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          admin_notes?: string | null
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          property_type?: string | null
          rejection_reason?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      service_types: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
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
      booking_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "rejected"
      enquiry_status: "new" | "contacted" | "converted" | "closed"
      job_status:
        | "draft"
        | "published"
        | "in_progress"
        | "completed"
        | "cancelled"
      notification_type: "info" | "success" | "warning" | "error"
      user_role: "user" | "client" | "admin" | "banned"
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
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "rejected",
      ],
      enquiry_status: ["new", "contacted", "converted", "closed"],
      job_status: [
        "draft",
        "published",
        "in_progress",
        "completed",
        "cancelled",
      ],
      notification_type: ["info", "success", "warning", "error"],
      user_role: ["user", "client", "admin", "banned"],
    },
  },
} as const
