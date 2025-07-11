export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          created_at: string | null
          id: string
          setting_key: string
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          setting_key: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          setting_key?: string
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_members: {
        Row: {
          chat_id: string
          id: string
          joined_at: string
          left_at: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string
          joined_at?: string
          left_at?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string
          joined_at?: string
          left_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_members_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "direct_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chat_id: string
          content: string | null
          created_at: string
          id: string
          is_read: boolean
          media_thumbnail: string | null
          media_type: string | null
          media_url: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          media_thumbnail?: string | null
          media_type?: string | null
          media_url?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          media_thumbnail?: string | null
          media_type?: string | null
          media_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "direct_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_settings: {
        Row: {
          chat_id: string
          id: string
          is_archived: boolean
          is_important: boolean
          is_muted: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: string
          is_archived?: boolean
          is_important?: boolean
          is_muted?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: string
          is_archived?: boolean
          is_important?: boolean
          is_muted?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_settings_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "direct_chats"
            referencedColumns: ["id"]
          },
        ]
      }
      dietary_requirements: {
        Row: {
          created_at: string
          custom_requirement: string | null
          dietary_option_id: string | null
          id: string
          notes: string | null
          rsvp_id: string
          severity: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_requirement?: string | null
          dietary_option_id?: string | null
          id?: string
          notes?: string | null
          rsvp_id: string
          severity?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_requirement?: string | null
          dietary_option_id?: string | null
          id?: string
          notes?: string | null
          rsvp_id?: string
          severity?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dietary_requirements_rsvp_id_fkey"
            columns: ["rsvp_id"]
            isOneToOne: false
            referencedRelation: "rsvps"
            referencedColumns: ["id"]
          },
        ]
      }
      direct_chats: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_group: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_group?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_group?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faq_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      faq_items: {
        Row: {
          answer: string
          category_id: string | null
          created_at: string
          display_order: number
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          question: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          answer: string
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          question: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          answer?: string
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          question?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_photos: {
        Row: {
          backstory: string | null
          created_at: string
          display_order: number
          id: string
          image_path: string
          image_url: string
          is_published: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          backstory?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_path: string
          image_url: string
          is_published?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          backstory?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_path?: string
          image_url?: string
          is_published?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gift_registry: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_purchased: boolean | null
          price: number | null
          priority: number | null
          purchased_at: string | null
          purchased_by: string | null
          store_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_purchased?: boolean | null
          price?: number | null
          priority?: number | null
          purchased_at?: string | null
          purchased_by?: string | null
          store_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_purchased?: boolean | null
          price?: number | null
          priority?: number | null
          purchased_at?: string | null
          purchased_by?: string | null
          store_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gift_registry_purchased_by_fkey"
            columns: ["purchased_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      guests: {
        Row: {
          category: string
          created_at: string
          guest_count: number
          guest_names: string
          id: string
          invite_sent: boolean | null
          location: string | null
          mobile: string | null
          notes: string | null
          rsvp_count: number | null
          rsvp_status: string | null
          save_the_date_sent: boolean | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          guest_count?: number
          guest_names: string
          id?: string
          invite_sent?: boolean | null
          location?: string | null
          mobile?: string | null
          notes?: string | null
          rsvp_count?: number | null
          rsvp_status?: string | null
          save_the_date_sent?: boolean | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          guest_count?: number
          guest_names?: string
          id?: string
          invite_sent?: boolean | null
          location?: string | null
          mobile?: string | null
          notes?: string | null
          rsvp_count?: number | null
          rsvp_status?: string | null
          save_the_date_sent?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      message_likes: {
        Row: {
          created_at: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_likes_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      message_reactions: {
        Row: {
          created_at: string
          id: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_replies: {
        Row: {
          chat_id: string
          content: string
          created_at: string
          id: string
          parent_message_id: string
          user_id: string
        }
        Insert: {
          chat_id: string
          content: string
          created_at?: string
          id?: string
          parent_message_id: string
          user_id: string
        }
        Update: {
          chat_id?: string
          content?: string
          created_at?: string
          id?: string
          parent_message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_replies_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "direct_chats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "message_replies_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      message_reports: {
        Row: {
          created_at: string
          id: string
          message_id: string
          report_details: string | null
          report_reason: string
          reported_by: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          message_id: string
          report_details?: string | null
          report_reason: string
          reported_by: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          message_id?: string
          report_details?: string | null
          report_reason?: string
          reported_by?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_reports_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_public: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_public?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      photo_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          photo_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          photo_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          photo_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_comments_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      photo_likes: {
        Row: {
          created_at: string
          id: string
          photo_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          photo_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          photo_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_likes_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "photo_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string
          description: string | null
          file_path: string
          file_size: number | null
          file_url: string
          height: number | null
          id: string
          is_approved: boolean | null
          mime_type: string | null
          title: string | null
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path: string
          file_size?: number | null
          file_url: string
          height?: number | null
          id?: string
          is_approved?: boolean | null
          mime_type?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string
          file_size?: number | null
          file_url?: string
          height?: number | null
          id?: string
          is_approved?: boolean | null
          mime_type?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "photos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      poll_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          notification_type: string
          poll_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_type: string
          poll_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          notification_type?: string
          poll_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_notifications_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_options: {
        Row: {
          created_at: string
          id: string
          option_order: number
          option_text: string
          poll_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_order?: number
          option_text: string
          poll_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_order?: number
          option_text?: string
          poll_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_options_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          option_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          allow_multiple_selections: boolean | null
          anonymous_voting: boolean | null
          created_at: string
          expires_at: string | null
          id: string
          poll_status: Database["public"]["Enums"]["poll_status"] | null
          poll_type: Database["public"]["Enums"]["poll_type"] | null
          post_id: string
          question: string
          settings: Json | null
          updated_at: string | null
          vote_count: number | null
        }
        Insert: {
          allow_multiple_selections?: boolean | null
          anonymous_voting?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          poll_status?: Database["public"]["Enums"]["poll_status"] | null
          poll_type?: Database["public"]["Enums"]["poll_type"] | null
          post_id: string
          question: string
          settings?: Json | null
          updated_at?: string | null
          vote_count?: number | null
        }
        Update: {
          allow_multiple_selections?: boolean | null
          anonymous_voting?: boolean | null
          created_at?: string
          expires_at?: string | null
          id?: string
          poll_status?: Database["public"]["Enums"]["poll_status"] | null
          poll_type?: Database["public"]["Enums"]["poll_type"] | null
          post_id?: string
          question?: string
          settings?: Json | null
          updated_at?: string | null
          vote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "polls_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      post_reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          reaction_type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          reaction_type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          country: string | null
          created_at: string
          display_name: string | null
          email: string
          first_name: string | null
          has_plus_one: boolean | null
          id: string
          last_name: string | null
          mobile: string | null
          phone: string | null
          plus_one_email: string | null
          plus_one_invited: boolean | null
          plus_one_name: string | null
          postcode: string | null
          rsvp_completed: boolean | null
          state: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          email: string
          first_name?: string | null
          has_plus_one?: boolean | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          phone?: string | null
          plus_one_email?: string | null
          plus_one_invited?: boolean | null
          plus_one_name?: string | null
          postcode?: string | null
          rsvp_completed?: boolean | null
          state?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          email?: string
          first_name?: string | null
          has_plus_one?: boolean | null
          id?: string
          last_name?: string | null
          mobile?: string | null
          phone?: string | null
          plus_one_email?: string | null
          plus_one_invited?: boolean | null
          plus_one_name?: string | null
          postcode?: string | null
          rsvp_completed?: boolean | null
          state?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          created_at: string
          dietary_restrictions: string | null
          event_id: string
          guest_count: number | null
          id: string
          message: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dietary_restrictions?: string | null
          event_id: string
          guest_count?: number | null
          id?: string
          message?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dietary_restrictions?: string | null
          event_id?: string
          guest_count?: number | null
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "wedding_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      social_posts: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_published: boolean
          media_thumbnail: string | null
          media_type: string | null
          media_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          media_thumbnail?: string | null
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_published?: boolean
          media_thumbnail?: string | null
          media_type?: string | null
          media_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      stories: {
        Row: {
          created_at: string
          duration: number | null
          expires_at: string
          id: string
          media_thumbnail: string | null
          media_type: string
          media_url: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          expires_at?: string
          id?: string
          media_thumbnail?: string | null
          media_type: string
          media_url: string
          user_id: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          expires_at?: string
          id?: string
          media_thumbnail?: string | null
          media_type?: string
          media_url?: string
          user_id?: string
        }
        Relationships: []
      }
      user_blocks: {
        Row: {
          blocked_at: string
          blocked_user_id: string
          id: string
          user_id: string
        }
        Insert: {
          blocked_at?: string
          blocked_user_id: string
          id?: string
          user_id: string
        }
        Update: {
          blocked_at?: string
          blocked_user_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      venue_images: {
        Row: {
          created_at: string
          description: string | null
          file_size: number | null
          height: number | null
          id: string
          image_order: number
          image_path: string
          image_type: string
          image_url: string
          is_published: boolean
          mime_type: string | null
          title: string | null
          updated_at: string
          venue_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          image_order?: number
          image_path: string
          image_type?: string
          image_url: string
          is_published?: boolean
          mime_type?: string | null
          title?: string | null
          updated_at?: string
          venue_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_size?: number | null
          height?: number | null
          id?: string
          image_order?: number
          image_path?: string
          image_type?: string
          image_url?: string
          is_published?: boolean
          mime_type?: string | null
          title?: string | null
          updated_at?: string
          venue_id?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "venue_images_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      venues: {
        Row: {
          address: string | null
          caption: string | null
          created_at: string
          display_order: number
          id: string
          image_path: string
          image_url: string
          name: string
          quick_facts: Json | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_path: string
          image_url: string
          name: string
          quick_facts?: Json | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image_path?: string
          image_url?: string
          name?: string
          quick_facts?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      wedding_events: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          dress_code: string | null
          event_date: string
          id: string
          is_main_event: boolean | null
          location: string | null
          notes: string | null
          title: string
          updated_at: string
          venue_name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          dress_code?: string | null
          event_date: string
          id?: string
          is_main_event?: boolean | null
          location?: string | null
          notes?: string | null
          title: string
          updated_at?: string
          venue_name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          dress_code?: string | null
          event_date?: string
          id?: string
          is_main_event?: boolean | null
          location?: string | null
          notes?: string | null
          title?: string
          updated_at?: string
          venue_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      faq_with_categories: {
        Row: {
          answer: string | null
          category_description: string | null
          category_icon: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          created_at: string | null
          display_order: number | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          question: string | null
          updated_at: string | null
          view_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "faq_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_featured_faqs: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          question: string
          answer: string
          category_name: string
          category_icon: string
        }[]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_faq_view: {
        Args: { faq_id: string }
        Returns: undefined
      }
      increment_faq_view_count: {
        Args: { faq_id: string }
        Returns: undefined
      }
      is_chat_member: {
        Args: { chat_uuid: string; user_uuid: string }
        Returns: boolean
      }
      safe_upsert_rsvp: {
        Args: {
          p_user_id: string
          p_event_id: string
          p_status: string
          p_guest_count?: number
          p_dietary_restrictions?: string
          p_message?: string
          p_plus_one_name?: string
          p_table_assignment?: string
          p_meal_preference?: string
          p_song_request?: string
          p_accommodation_needed?: boolean
          p_transportation_needed?: boolean
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "guest" | "admin" | "couple"
      poll_status: "active" | "closed" | "draft"
      poll_type: "multiple_choice" | "yes_no" | "rating"
      reaction_type: "like" | "love" | "laugh" | "wow" | "sad" | "angry"
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
      app_role: ["guest", "admin", "couple"],
      poll_status: ["active", "closed", "draft"],
      poll_type: ["multiple_choice", "yes_no", "rating"],
      reaction_type: ["like", "love", "laugh", "wow", "sad", "angry"],
    },
  },
} as const
