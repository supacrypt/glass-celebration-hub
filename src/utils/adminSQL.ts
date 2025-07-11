// Admin SQL Executor - Uses service role for DDL operations
import { supabaseAdmin } from '@/integrations/supabase/client';

export class AdminSQLExecutor {
  private static instance: AdminSQLExecutor;
  
  public static getInstance(): AdminSQLExecutor {
    if (!AdminSQLExecutor.instance) {
      AdminSQLExecutor.instance = new AdminSQLExecutor();
    }
    return AdminSQLExecutor.instance;
  }

  async executeSQL(sql: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      // Use the admin client which has service role permissions
      const { data, error } = await supabaseAdmin.rpc('exec_sql', {
        sql_query: sql
      });

      if (error) {
        console.error('SQL execution error:', error);
        return { success: false, error: error.message };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Failed to execute SQL:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  async enableRLS(tableName: string): Promise<{ success: boolean; error?: string }> {
    const sql = `ALTER TABLE public.${tableName} ENABLE ROW LEVEL SECURITY;`;
    return this.executeSQL(sql);
  }

  async createPolicy(tableName: string, policyName: string, policySQL: string): Promise<{ success: boolean; error?: string }> {
    const sql = `CREATE POLICY "${policyName}" ON public.${tableName} ${policySQL};`;
    return this.executeSQL(sql);
  }

  async fixAllSecurityIssues(): Promise<{ success: boolean; error?: string; results: any[] }> {
    const results: any[] = [];
    
    // List of all tables that need RLS enabled
    const rlsTables = [
      'app_settings', 'transportation_options', 'transportation_schedules',
      'bus_seat_bookings', 'carpool_coordination', 'carpool_participants',
      'guest_transport_status', 'content_blocks', 'faqs',
      'gift_registry_redirects', 'contact_categories', 'contact_details',
      'social_feed', 'social_feed_likes', 'chat_messages', 'user_profiles',
      'wedding_events', 'rsvps', 'accommodation_categories',
      'accommodation_options', 'transportation_categories', 'photo_gallery'
    ];

    // Enable RLS on all tables
    for (const table of rlsTables) {
      const result = await this.enableRLS(table);
      results.push({ table, action: 'enable_rls', ...result });
    }

    // Create basic policies for critical tables
    const criticalPolicies = [
      {
        table: 'app_settings',
        policies: [
          { name: 'app_settings_read', sql: 'FOR SELECT USING (true)' },
          { name: 'app_settings_admin', sql: 'FOR ALL USING (auth.jwt() ->> \'role\' IN (\'admin\', \'service_role\'))' }
        ]
      },
      {
        table: 'wedding_events',
        policies: [
          { name: 'wedding_events_read', sql: 'FOR SELECT USING (true)' },
          { name: 'wedding_events_write', sql: 'FOR ALL USING (auth.uid() IS NOT NULL)' }
        ]
      },
      {
        table: 'rsvps',
        policies: [
          { name: 'rsvps_user_access', sql: 'FOR ALL USING (auth.uid() IS NOT NULL AND (auth.uid()::text = user_id OR auth.jwt() ->> \'role\' IN (\'admin\', \'service_role\')))' }
        ]
      },
      {
        table: 'user_profiles',
        policies: [
          { name: 'user_profiles_read', sql: 'FOR SELECT USING (true)' },
          { name: 'user_profiles_write', sql: 'FOR ALL USING (auth.uid() IS NOT NULL AND (auth.uid()::text = id OR auth.jwt() ->> \'role\' IN (\'admin\', \'service_role\')))' }
        ]
      }
    ];

    for (const tableConfig of criticalPolicies) {
      for (const policy of tableConfig.policies) {
        const result = await this.createPolicy(tableConfig.table, policy.name, policy.sql);
        results.push({ 
          table: tableConfig.table, 
          action: 'create_policy', 
          policy: policy.name, 
          ...result 
        });
      }
    }

    // Check if all operations succeeded
    const failures = results.filter(r => !r.success);
    if (failures.length > 0) {
      return {
        success: false,
        error: `${failures.length} operations failed`,
        results
      };
    }

    return { success: true, results };
  }

  async checkRLSStatus(): Promise<{ table: string; hasRLS: boolean; policies: number }[]> {
    try {
      // Query to check RLS status and policy count
      const { data, error } = await supabaseAdmin
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
        
      if (error) {
        console.error('Error checking RLS status:', error);
        return [];
      }
      
      // This is simplified - would need more complex queries for full RLS status
      return (data || []).map(table => ({
        table: table.table_name,
        hasRLS: false, // Would be determined by actual query
        policies: 0
      }));
    } catch (error) {
      console.error('Error in checkRLSStatus:', error);
      return [];
    }
  }
}

export const adminSQL = AdminSQLExecutor.getInstance();