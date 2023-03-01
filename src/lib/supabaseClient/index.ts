import {
  createClient,
  Session,
  PostgrestError,
  UserResponse,
  AuthError,
} from '@supabase/supabase-js'

export type SupaBaseUser = UserResponse
export type SupaBaseSession =
  | {
      data: {
        session: Session
      }
      error: null
    }
  | {
      data: {
        session: null
      }
      error: AuthError
    }
  | {
      data: {
        session: null
      }
      error: null
    }
    
export type SupaBaseFetchError = PostgrestError

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const VITE_SUPABASE_API_ANON_KEY = import.meta.env.VITE_SUPABASE_API_ANON_KEY

export const supabase = createClient(
  VITE_SUPABASE_URL,
  VITE_SUPABASE_API_ANON_KEY,
)
