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
      credentialing_applications: {
        Row: {
          application_date: string
          application_type: string
          approval_date: string | null
          created_at: string
          doctor_id: string
          estimated_completion_days: number | null
          expiry_date: string | null
          id: string
          insurance_company: string
          notes: string | null
          priority: string
          status: string
          submission_date: string | null
          updated_at: string
        }
        Insert: {
          application_date?: string
          application_type?: string
          approval_date?: string | null
          created_at?: string
          doctor_id: string
          estimated_completion_days?: number | null
          expiry_date?: string | null
          id?: string
          insurance_company: string
          notes?: string | null
          priority?: string
          status?: string
          submission_date?: string | null
          updated_at?: string
        }
        Update: {
          application_date?: string
          application_type?: string
          approval_date?: string | null
          created_at?: string
          doctor_id?: string
          estimated_completion_days?: number | null
          expiry_date?: string | null
          id?: string
          insurance_company?: string
          notes?: string | null
          priority?: string
          status?: string
          submission_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentialing_applications_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "credentialing_doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      credentialing_doctors: {
        Row: {
          address: string
          board_certification: string | null
          board_expiry: string | null
          city: string
          created_at: string
          dea_expiry: string | null
          dea_number: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          license_expiry: string
          license_number: string
          license_state: string
          npi_number: string
          phone: string
          specialty: string
          state: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          address: string
          board_certification?: string | null
          board_expiry?: string | null
          city: string
          created_at?: string
          dea_expiry?: string | null
          dea_number?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          license_expiry: string
          license_number: string
          license_state: string
          npi_number: string
          phone: string
          specialty: string
          state: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          address?: string
          board_certification?: string | null
          board_expiry?: string | null
          city?: string
          created_at?: string
          dea_expiry?: string | null
          dea_number?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          license_expiry?: string
          license_number?: string
          license_state?: string
          npi_number?: string
          phone?: string
          specialty?: string
          state?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      credentialing_documents: {
        Row: {
          application_id: string
          created_at: string
          document_name: string
          document_type: string
          expiry_date: string | null
          id: string
          notes: string | null
          received: boolean
          received_date: string | null
          required: boolean
          updated_at: string
        }
        Insert: {
          application_id: string
          created_at?: string
          document_name: string
          document_type: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          received?: boolean
          received_date?: string | null
          required?: boolean
          updated_at?: string
        }
        Update: {
          application_id?: string
          created_at?: string
          document_name?: string
          document_type?: string
          expiry_date?: string | null
          id?: string
          notes?: string | null
          received?: boolean
          received_date?: string | null
          required?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentialing_documents_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "credentialing_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      credentialing_timeline: {
        Row: {
          application_id: string
          created_at: string
          created_by: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          application_id: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          status: string
        }
        Update: {
          application_id?: string
          created_at?: string
          created_by?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "credentialing_timeline_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "credentialing_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      spreadsheet_imports: {
        Row: {
          created_at: string
          file_size: number | null
          filename: string
          id: string
          import_date: string
          imported_by_username: string
          notes: string | null
          records_imported: number
          status: string
        }
        Insert: {
          created_at?: string
          file_size?: number | null
          filename: string
          id?: string
          import_date?: string
          imported_by_username: string
          notes?: string | null
          records_imported?: number
          status?: string
        }
        Update: {
          created_at?: string
          file_size?: number | null
          filename?: string
          id?: string
          import_date?: string
          imported_by_username?: string
          notes?: string | null
          records_imported?: number
          status?: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
