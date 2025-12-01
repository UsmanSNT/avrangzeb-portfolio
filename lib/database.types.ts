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
      portfolio_book_quotes: {
        Row: {
          author: string
          book_title: string
          created_at: string | null
          dislikes: number | null
          id: number
          image_url: string | null
          likes: number | null
          quote: string
        }
        Insert: {
          author: string
          book_title: string
          created_at?: string | null
          dislikes?: number | null
          id?: never
          image_url?: string | null
          likes?: number | null
          quote: string
        }
        Update: {
          author?: string
          book_title?: string
          created_at?: string | null
          dislikes?: number | null
          id?: never
          image_url?: string | null
          likes?: number | null
          quote?: string
        }
        Relationships: []
      }
      portfolio_gallery: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: number
          images: string[] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: never
          images?: string[] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: never
          images?: string[] | null
          title?: string
        }
        Relationships: []
      }
      portfolio_notes: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: number
          important: boolean | null
          tags: string[] | null
          title: string
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: never
          important?: boolean | null
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: never
          important?: boolean | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
    CompositeTypes: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type BookQuote = Tables<'portfolio_book_quotes'>
export type GalleryItem = Tables<'portfolio_gallery'>
export type Note = Tables<'portfolio_notes'>

