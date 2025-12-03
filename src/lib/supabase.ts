import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mwikduzkufyldfrwowdh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13aWtkdXprdWZ5bGRmcndvd2RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTUzODUsImV4cCI6MjA4MDIzMTM4NX0.qBJrPOyhrFm90RiGmwf_V8QqvzfIbXdNk-ykHB3DOb0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          email: string
          profile_pic: string | null
          clout_score: number
          badges: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email: string
          profile_pic?: string | null
          clout_score?: number
          badges?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string
          profile_pic?: string | null
          clout_score?: number
          badges?: string[]
          created_at?: string
        }
      }
      devices: {
        Row: {
          id: string
          user_id: string
          brand: string
          model: string
          storage: string | null
          ram: string | null
          accessories: string | null
          photos: string[]
          ai_value_min: number | null
          ai_value_max: number | null
          confidence: number | null
          damage_analysis: string | null
          suggested_listing: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          brand: string
          model: string
          storage?: string | null
          ram?: string | null
          accessories?: string | null
          photos?: string[]
          ai_value_min?: number | null
          ai_value_max?: number | null
          confidence?: number | null
          damage_analysis?: string | null
          suggested_listing?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          brand?: string
          model?: string
          storage?: string | null
          ram?: string | null
          accessories?: string | null
          photos?: string[]
          ai_value_min?: number | null
          ai_value_max?: number | null
          confidence?: number | null
          damage_analysis?: string | null
          suggested_listing?: string | null
          created_at?: string
        }
      }
      history: {
        Row: {
          id: string
          device_id: string
          valuation_result: Record<string, unknown>
          date: string
        }
        Insert: {
          id?: string
          device_id: string
          valuation_result: Record<string, unknown>
          date?: string
        }
        Update: {
          id?: string
          device_id?: string
          valuation_result?: Record<string, unknown>
          date?: string
        }
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string
          clout_score: number
          badges: string[]
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          clout_score?: number
          badges?: string[]
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          clout_score?: number
          badges?: string[]
          updated_at?: string
        }
      }
    }
  }
}

