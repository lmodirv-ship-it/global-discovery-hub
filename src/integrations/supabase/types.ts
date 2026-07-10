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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          actor: string
          created_at: string
          id: number
          target: string | null
        }
        Insert: {
          action: string
          actor?: string
          created_at?: string
          id?: number
          target?: string | null
        }
        Update: {
          action?: string
          actor?: string
          created_at?: string
          id?: number
          target?: string | null
        }
        Relationships: []
      }
      ai_commands: {
        Row: {
          created_at: string
          id: number
          prompt: string
          response: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: number
          prompt: string
          response?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: number
          prompt?: string
          response?: string | null
          status?: string
        }
        Relationships: []
      }
      backups: {
        Row: {
          created_at: string
          id: number
          kind: string
          site_id: number | null
          size_mb: number
          status: string
        }
        Insert: {
          created_at?: string
          id?: number
          kind?: string
          site_id?: number | null
          size_mb?: number
          status?: string
        }
        Update: {
          created_at?: string
          id?: number
          kind?: string
          site_id?: number | null
          size_mb?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "backups_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      databases: {
        Row: {
          connections: number
          created_at: string
          engine: string
          id: number
          name: string
          site_id: number | null
          size_mb: number
          status: string
        }
        Insert: {
          connections?: number
          created_at?: string
          engine?: string
          id?: number
          name: string
          site_id?: number | null
          size_mb?: number
          status?: string
        }
        Update: {
          connections?: number
          created_at?: string
          engine?: string
          id?: number
          name?: string
          site_id?: number | null
          size_mb?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "databases_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: number
          level: string
          title: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: number
          level?: string
          title: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: number
          level?: string
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_protected: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          is_protected?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_protected?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string
          event: string
          id: number
          ip: string | null
          severity: string
          site_id: number | null
        }
        Insert: {
          created_at?: string
          event: string
          id?: number
          ip?: string | null
          severity?: string
          site_id?: number | null
        }
        Update: {
          created_at?: string
          event?: string
          id?: number
          ip?: string | null
          severity?: string
          site_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "security_logs_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      servers: {
        Row: {
          cpu_pct: number
          created_at: string
          disk_pct: number
          id: number
          name: string
          ram_pct: number
          region: string
          status: string
        }
        Insert: {
          cpu_pct?: number
          created_at?: string
          disk_pct?: number
          id?: number
          name: string
          ram_pct?: number
          region?: string
          status?: string
        }
        Update: {
          cpu_pct?: number
          created_at?: string
          disk_pct?: number
          id?: number
          name?: string
          ram_pct?: number
          region?: string
          status?: string
        }
        Relationships: []
      }
      sites: {
        Row: {
          category: string
          created_at: string
          database_size_mb: number
          domain: string
          id: number
          server_id: number | null
          ssl_expires_at: string | null
          status: string
          storage_size_mb: number
          title: string | null
          users_count: number
        }
        Insert: {
          category?: string
          created_at?: string
          database_size_mb?: number
          domain: string
          id?: number
          server_id?: number | null
          ssl_expires_at?: string | null
          status?: string
          storage_size_mb?: number
          title?: string | null
          users_count?: number
        }
        Update: {
          category?: string
          created_at?: string
          database_size_mb?: number
          domain?: string
          id?: number
          server_id?: number | null
          ssl_expires_at?: string | null
          status?: string
          storage_size_mb?: number
          title?: string | null
          users_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "sites_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          cpu: number
          disk: number
          id: number
          ram: number
          recorded_at: string
          server_id: number | null
        }
        Insert: {
          cpu: number
          disk: number
          id?: number
          ram: number
          recorded_at?: string
          server_id?: number | null
        }
        Update: {
          cpu?: number
          disk?: number
          id?: number
          ram?: number
          recorded_at?: string
          server_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_metrics_server_id_fkey"
            columns: ["server_id"]
            isOneToOne: false
            referencedRelation: "servers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_protected_owner_email: { Args: { _email: string }; Returns: boolean }
    }
    Enums: {
      app_role: "owner" | "supervisor" | "customer" | "visitor"
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
      app_role: ["owner", "supervisor", "customer", "visitor"],
    },
  },
} as const
