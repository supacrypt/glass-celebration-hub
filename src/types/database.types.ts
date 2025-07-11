export type Json = | string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

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
          message_type: string
          sender_id: string
        }
        Insert: {
          chat_id: string
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          sender_id: string
        }
        Update: {
          chat_id?: string
          content?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message_type?: string
          sender_id?: string
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
      direct_chats: {
        Row: {
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
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
          is_active: boolean
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
          is_active?: boolean
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
          is_active?: boolean
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
          is_active: boolean
          is_featured: boolean
          question: string
          updated_at: string
          view_count: number
        }
        Insert: {
          answer: string
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          question: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          answer?: string
          category_id?: string | null
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          is_featured?: boolean
          question?: string
          updated_at?: string
          view_count?: number
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
      gallery_albums: {
        Row: {
          cover_image_path: string | null
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          cover_image_path?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_photos: {
        Row: {
          album_id: string
          caption: string | null
          created_at: string
          id: string
          image_path: string
          uploaded_by: string | null
        }
        Insert: {
          album_id: string
          caption?: string | null
          created_at?: string
          id?: string
          image_path: string
          uploaded_by?: string | null
        }
        Update: {
          album_id?: string
          caption?: string | null
          created_at?: string
          id?: string
          image_path?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_photos_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_gifts: {
        Row: {
          amount: number | null
          created_at: string
          gift_id: string
          guest_id: string
          id: string
          message: string | null
          payment_intent_id: string | null
          payment_status: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          gift_id: string
          guest_id: string
          id?: string
          message?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          gift_id?: string
          guest_id?: string
          id?: string
          message?: string | null
          payment_intent_id?: string | null
          payment_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_gifts_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_gifts_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      guests: {
        Row: {
          accommodation_notes: string | null
          additional_guests: number | null
          created_at: string
          dietary_restrictions: string | null
          email: string | null
          full_name: string
          id: string
          is_attending: boolean | null
          is_plus_one_attending: boolean | null
          plus_one_name: string | null
          rsvp_at: string | null
          song_requests: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          accommodation_notes?: string | null
          additional_guests?: number | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          full_name: string
          id?: string
          is_attending?: boolean | null
          is_plus_one_attending?: boolean | null
          plus_one_name?: string | null
          rsvp_at?: string | null
          song_requests?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          accommodation_notes?: string | null
          additional_guests?: number | null
          created_at?: string
          dietary_restrictions?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_attending?: boolean | null
          is_plus_one_attending?: boolean | null
          plus_one_name?: string | null
          rsvp_at?: string | null
          song_requests?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      gifts: {
        Row: {
          amount_raised: number
          created_at: string
          description: string | null
          display_order: number
          goal_amount: number
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          amount_raised?: number
          created_at?: string
          description?: string | null
          display_order?: number
          goal_amount?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          amount_raised?: number
          created_at?: string
          description?: string | null
          display_order?: number
          goal_amount?: number
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string | null
          message: string
          recipient_id: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message: string
          recipient_id: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string | null
          message?: string
          recipient_id?: string
          type?: string
        }
        Relationships: []
      }
      poll_options: {
        Row: {
          created_at: string
          id: string
          option_text: string
          poll_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_text: string
          poll_id: string
        }
        Update: {
          created_at?: string
          id?: string
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
      poll_responses: {
        Row: {
          created_at: string
          id: string
          option_id: string | null
          poll_id: string
          rating_value: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          option_id?: string | null
          poll_id: string
          rating_value?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          option_id?: string | null
          poll_id?: string
          rating_value?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_responses_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "poll_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "poll_responses_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "polls"
            referencedColumns: ["id"]
          },
        ]
      }
      polls: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_anonymous: boolean
          question: string
          status: Database["public"]["Enums"]["poll_status"]
          type: Database["public"]["Enums"]["poll_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_anonymous?: boolean
          question: string
          status?: Database["public"]["Enums"]["poll_status"]
          type: Database["public"]["Enums"]["poll_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_anonymous?: boolean
          question?: string
          status?: Database["public"]["Enums"]["poll_status"]
          type?: Database["public"]["Enums"]["poll_type"]
          updated_at?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      reactions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          type: Database["public"]["Enums"]["reaction_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          type?: Database["public"]["Enums"]["reaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      registry_items: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_purchased: boolean
          name: string
          price: number
          purchase_url: string | null
          quantity: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          name: string
          price: number
          purchase_url?: string | null
          quantity?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_purchased?: boolean
          name?: string
          price?: number
          purchase_url?: string | null
          quantity?: number
          updated_at?: string
        }
        Relationships: []
      }
      rsvp_responses: {
        Row: {
          attending_events: string[] | null
          created_at: string
          guest_id: string
          id: string
          message: string | null
          updated_at: string
        }
        Insert: {
          attending_events?: string[] | null
          created_at?: string
          guest_id: string
          id?: string
          message?: string | null
          updated_at?: string
        }
        Update: {
          attending_events?: string[] | null
          created_at?: string
          guest_id?: string
          id?: string
          message?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvp_responses_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: true
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
        ]
      }
      table_assignments: {
        Row: {
          created_at: string
          guest_id: string
          id: string
          seat_number: number | null
          table_id: string
        }
        Insert: {
          created_at?: string
          guest_id: string
          id?: string
          seat_number?: number | null
          table_id: string
        }
        Update: {
          created_at?: string
          guest_id?: string
          id?: string
          seat_number?: number | null
          table_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_assignments_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: true
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_assignments_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          capacity: number
          created_at: string
          id: string
          name: string
          venue_id: string
        }
        Insert: {
          capacity?: number
          created_at?: string
          id?: string
          name: string
          venue_id: string
        }
        Update: {
          capacity?: number
          created_at?: string
          id?: string
          name?: string
          venue_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tables_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          id: string
          image_url: string | null
          location: string | null
          start_time: string
          title: string
          venue_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_time: string
          title: string
          venue_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          id?: string
          image_url?: string | null
          location?: string | null
          start_time?: string
          title?: string
          venue_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_bookings: {
        Row: {
          booking_reference: string | null
          created_at: string
          details: string | null
          guest_id: string
          id: string
          provider: string | null
          type: string
        }
        Insert: {
          booking_reference?: string | null
          created_at?: string
          details?: string | null
          guest_id: string
          id?: string
          provider?: string | null
          type: string
        }
        Update: {
          booking_reference?: string | null
          created_at?: string
          details?: string | null
          guest_id?: string
          id?: string
          provider?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_bookings_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
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
          created_at: string
          date: string
          description: string | null
          id: string
          is_main_event: boolean
          location: string
          name: string
          time: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          id?: string
          is_main_event?: boolean
          location: string
          name: string
          time: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          is_main_event?: boolean
          location?: string
          name?: string
          time?: string
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
          display_order: number | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          question: string | null
          view_count: number | null
        }
        Insert: {
          answer?: string | null
          category_description?: string | null
          category_icon?: string | null
          category_id?: string | null
          category_name?: string | null
          category_slug?: string | null
          display_order?: number | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          question?: string | null
          view_count?: number | null
        }
        Update: {
          answer?: string | null
          category_description?: string | null
          category_icon?: string | null
          category_id?: string | null
          category_name?: string | null
          category_slug?: string | null
          display_order?: number | null
          id?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          question?: string | null
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
      guest_details: {
        Row: {
          accommodation_notes: string | null
          additional_guests: number | null
          attending_events: string[] | null
          dietary_restrictions: string | null
          email: string | null
          full_name: string | null
          guest_id: string | null
          is_attending: boolean | null
          is_plus_one_attending: boolean | null
          plus_one_name: string | null
          rsvp_at: string | null
          rsvp_message: string | null
          song_requests: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_featured_faqs: {
        Args: {
          limit_count: number
        }
        Returns: {
          answer: string | null
          category_description: string | null
          category_icon: string | null
          category_id: string | null
          category_name: string | null
          category_slug: string | null
          display_order: number | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          question: string | null
          view_count: number | null
        }[]
      }
      increment_faq_view_count: {
        Args: {
          faq_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "guest" | "admin" | "couple"
      poll_status: "active" | "closed" | "draft"
      poll_type: "multiple_choice" | "yes_no" | "rating"
      reaction_type: "like" | "love" | "laugh" | "wow" | "sad" | "angry"
    }
    CompositeTypes: {}
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]
export type Functions<T extends keyof PublicSchema["Functions"]> = PublicSchema["Functions"][T]

export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]


export type DbResult<T> = T extends PromiseLike<infer U> ? U : never
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never
export type DbResultErr = PostgrestError

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
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
