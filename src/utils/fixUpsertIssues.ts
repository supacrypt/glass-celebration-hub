// Emergency fix for RSVP constraint errors
// This patches the Supabase client to intercept upsert calls

import { supabase } from '@/integrations/supabase/client';

// Store the original from method
const originalFrom = supabase.from.bind(supabase);

// Known table constraints - mapped exactly to database unique constraints
const TABLE_CONSTRAINTS = {
  rsvps: ['user_id', 'event_id'], // UNIQUE(user_id, event_id) - constraint name: rsvps_user_id_event_id_unique
  user_roles: ['user_id'], // UNIQUE(user_id) 
  app_settings: ['setting_key'], // UNIQUE(setting_key)
  profiles: ['user_id'], // UNIQUE(user_id)
  photo_likes: ['photo_id', 'user_id'], // UNIQUE(photo_id, user_id)
  message_likes: ['message_id', 'user_id'] // UNIQUE(message_id, user_id)
};

// Override the from method to intercept upsert calls
(supabase as any).from = function(table: string) {
  const queryBuilder = originalFrom(table);
  const originalUpsert = queryBuilder.upsert;
  
  // Override upsert to use safe insert/update pattern
  queryBuilder.upsert = async function(values: any, options?: any) {
    console.log(`[UPSERT FIX] Intercepting upsert for table: ${table}`);
    
    try {
      // Always use the safe check-then-insert/update pattern
      const data = Array.isArray(values) ? values[0] : values;
      const constraintColumns = TABLE_CONSTRAINTS[table as keyof typeof TABLE_CONSTRAINTS];
      
      if (constraintColumns) {
        console.log(`[UPSERT FIX] Using known constraints for ${table}:`, constraintColumns);
        
        // Build where clause based on constraint columns
        let query = originalFrom(table).select('id');
        let hasAllConstraintValues = true;
        
        for (const col of constraintColumns) {
          if (data[col] === undefined || data[col] === null) {
            hasAllConstraintValues = false;
            break;
          }
          query = query.eq(col, data[col]);
        }
        
        if (!hasAllConstraintValues) {
          console.warn(`[UPSERT FIX] Missing constraint values for ${table}, falling back to insert`);
          return originalFrom(table).insert(data).select();
        }
        
        const { data: existing } = await query.maybeSingle();
        
        if (existing) {
          // Update existing record
          console.log(`[UPSERT FIX] Updating existing ${table} record`);
          const updateData = { ...data };
          if (table !== 'app_settings') { // app_settings doesn't have updated_at
            updateData.updated_at = new Date().toISOString();
          }
          return originalFrom(table)
            .update(updateData)
            .eq('id', existing.id)
            .select();
        } else {
          // Insert new record
          console.log(`[UPSERT FIX] Inserting new ${table} record`);
          return originalFrom(table)
            .insert(data)
            .select();
        }
      }
      
      // For unknown tables, if onConflict is provided, try to parse it
      if (options?.onConflict) {
        console.warn(`[UPSERT FIX] Unknown table ${table} with onConflict: ${options.onConflict}`);
        
        // Parse onConflict string to extract column names
        let conflictColumns: string[] = [];
        if (typeof options.onConflict === 'string') {
          conflictColumns = options.onConflict.split(',').map((col: string) => col.trim());
        } else if (Array.isArray(options.onConflict)) {
          conflictColumns = options.onConflict;
        }
        
        if (conflictColumns.length > 0) {
          // Use the same pattern as above
          let query = originalFrom(table).select('id');
          let hasAllValues = true;
          
          for (const col of conflictColumns) {
            if (data[col] === undefined || data[col] === null) {
              hasAllValues = false;
              break;
            }
            query = query.eq(col, data[col]);
          }
          
          if (!hasAllValues) {
            console.warn(`[UPSERT FIX] Missing values for conflict columns, falling back to insert`);
            return originalFrom(table).insert(data).select();
          }
          
          const { data: existing } = await query.maybeSingle();
          
          if (existing) {
            // Update
            const updateData = { ...data, updated_at: new Date().toISOString() };
            return originalFrom(table)
              .update(updateData)
              .eq('id', existing.id)
              .select();
          } else {
            // Insert
            return originalFrom(table)
              .insert(data)
              .select();
          }
        }
      }
      
      // Default behavior - just insert (no upsert)
      console.log(`[UPSERT FIX] No constraint info for ${table}, using insert`);
      const data_array = Array.isArray(values) ? values : [values];
      return originalFrom(table).insert(data_array).select();
      
    } catch (error) {
      console.error(`[UPSERT FIX] Error handling upsert for ${table}:`, error);
      // Fall back to original behavior as last resort
      return originalUpsert.call(this, values, options);
    }
  };
  
  return queryBuilder;
};

console.log('[UPSERT FIX] Supabase upsert interceptor installed with constraint handling');