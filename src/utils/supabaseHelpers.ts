// Supabase helper utilities to replace problematic upsert operations
import { supabase } from '@/integrations/supabase/client';

/**
 * Safe upsert that works around constraint issues
 * Uses check-then-insert-or-update pattern
 */
export const safeUpsert = async (
  tableName: string,
  data: Record<string, any>,
  matchColumns: string[],
  options: { returning?: string } = {}
) => {
  try {
    // Build where clause for matching
    const whereClause: Record<string, any> = {};
    matchColumns.forEach(col => {
      whereClause[col] = data[col];
    });

    // Check if record exists
    let query = supabase.from(tableName).select('id');
    
    // Apply where conditions
    Object.entries(whereClause).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data: existing, error: selectError } = await query.maybeSingle();

    if (selectError) {
      throw selectError;
    }

    let result;
    if (existing) {
      // Update existing record
      let updateQuery = supabase
        .from(tableName)
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', existing.id);

      if (options.returning) {
        updateQuery = updateQuery.select(options.returning);
      }

      result = await updateQuery;
    } else {
      // Insert new record
      let insertQuery = supabase
        .from(tableName)
        .insert(data);

      if (options.returning) {
        insertQuery = insertQuery.select(options.returning);
      }

      result = await insertQuery;
    }

    return result;
  } catch (error) {
    console.error(`Safe upsert failed for ${tableName}:`, error);
    return { data: null, error };
  }
};

/**
 * Safe upsert for app settings (common use case)
 */
export const safeUpdateAppSetting = async (settingKey: string, settingValue: string) => {
  return safeUpsert('app_settings', {
    setting_key: settingKey,
    setting_value: settingValue
  }, ['setting_key']);
};

/**
 * Safe upsert for user roles (common use case)
 */
export const safeUpdateUserRole = async (userId: string, role: string) => {
  return safeUpsert('user_roles', {
    user_id: userId,
    role: role
  }, ['user_id']);
};

/**
 * Safe upsert for photo likes (common use case)
 */
export const safeTogglePhotoLike = async (photoId: string, userId: string) => {
  try {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from('photo_likes')
      .select('id')
      .eq('photo_id', photoId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      // Unlike (delete)
      return await supabase
        .from('photo_likes')
        .delete()
        .eq('id', existingLike.id);
    } else {
      // Like (insert)
      return await supabase
        .from('photo_likes')
        .insert({
          photo_id: photoId,
          user_id: userId
        });
    }
  } catch (error) {
    console.error('Safe toggle photo like failed:', error);
    return { data: null, error };
  }
};

/**
 * Safe upsert for message likes (common use case)
 */
export const safeToggleMessageLike = async (messageId: string, userId: string) => {
  try {
    // Check if like exists
    const { data: existingLike } = await supabase
      .from('message_likes')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .maybeSingle();

    if (existingLike) {
      // Unlike (delete)
      return await supabase
        .from('message_likes')
        .delete()
        .eq('id', existingLike.id);
    } else {
      // Like (insert)
      return await supabase
        .from('message_likes')
        .insert({
          message_id: messageId,
          user_id: userId
        });
    }
  } catch (error) {
    console.error('Safe toggle message like failed:', error);
    return { data: null, error };
  }
};