import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase credentials not configured')
}

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

