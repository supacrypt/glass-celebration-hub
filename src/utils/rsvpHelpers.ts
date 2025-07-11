import { supabase } from '@/integrations/supabase/client';

export interface RSVPData {
  userId: string;
  eventId: string;
  status: 'attending' | 'declined' | 'pending' | 'maybe';
  guestCount?: number;
  dietaryRestrictions?: string;
  message?: string;
  plusOneName?: string;
  tableAssignment?: string;
  mealPreference?: string;
  songRequest?: string;
  accommodationNeeded?: boolean;
  transportationNeeded?: boolean;
}

/**
 * Safely upsert an RSVP using the database function
 * This prevents ON CONFLICT issues and handles all edge cases
 */
export async function safeUpsertRSVP(rsvpData: RSVPData) {
  const { data, error } = await supabase.rpc('safe_upsert_rsvp', {
    p_user_id: rsvpData.userId,
    p_event_id: rsvpData.eventId,
    p_status: rsvpData.status,
    p_guest_count: rsvpData.guestCount || 1,
    p_dietary_restrictions: rsvpData.dietaryRestrictions || null,
    p_message: rsvpData.message || null,
    p_plus_one_name: rsvpData.plusOneName || null,
    p_table_assignment: rsvpData.tableAssignment || null,
    p_meal_preference: rsvpData.mealPreference || null,
    p_song_request: rsvpData.songRequest || null,
    p_accommodation_needed: rsvpData.accommodationNeeded || false,
    p_transportation_needed: rsvpData.transportationNeeded || false
  });

  if (error) {
    console.error('RSVP upsert error:', error);
    throw error;
  }

  return data; // Returns the RSVP ID
}

/**
 * Get RSVP analytics for an event
 */
export async function getRSVPAnalytics(eventId?: string) {
  let query = supabase.from('rsvp_analytics').select('*');
  
  if (eventId) {
    query = query.eq('event_id', eventId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('RSVP analytics error:', error);
    throw error;
  }
  
  return data;
}

/**
 * Legacy function for backward compatibility
 * Use safeUpsertRSVP instead for new code
 */
export async function upsertRSVP(rsvpData: RSVPData) {
  console.warn('upsertRSVP is deprecated. Use safeUpsertRSVP instead.');
  return safeUpsertRSVP(rsvpData);
}

/**
 * Convert old status values to new standardized values
 */
export function normalizeRSVPStatus(status: string): 'attending' | 'declined' | 'pending' | 'maybe' {
  switch (status.toLowerCase()) {
    case 'yes':
    case 'attending':
      return 'attending';
    case 'no':
    case 'not_attending':
    case 'declined':
      return 'declined';
    case 'maybe':
    case 'tentative':
      return 'maybe';
    default:
      return 'pending';
  }
}

/**
 * Validate RSVP data before submission
 */
export function validateRSVPData(rsvpData: Partial<RSVPData>): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!rsvpData.userId) {
    errors.push('User ID is required');
  }

  if (!rsvpData.eventId) {
    errors.push('Event ID is required');
  }

  if (!rsvpData.status) {
    errors.push('RSVP status is required');
  } else if (!['attending', 'declined', 'pending', 'maybe'].includes(rsvpData.status)) {
    errors.push('Invalid RSVP status');
  }

  if (rsvpData.guestCount && (rsvpData.guestCount < 0 || rsvpData.guestCount > 10)) {
    errors.push('Guest count must be between 0 and 10');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}