#!/usr/bin/env node

/**
 * User Role Management Script
 * 
 * This script helps you safely manage user roles in your Supabase database.
 * Usage:
 *   node manage-user-roles.js list                           # List all users and roles
 *   node manage-user-roles.js change daniel.j.fleuren@gmail.com guest    # Change user to guest
 *   node manage-user-roles.js change daniel.j.fleuren@gmail.com admin    # Change user to admin
 *   node manage-user-roles.js backup                         # Create backup of current roles
 *   node manage-user-roles.js restore                        # Restore from backup
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables (you'll need to set these)
config();

// Load from .env file
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://iwmfxcrzzwpmxomydmuq.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3bWZ4Y3J6endwbXhvbXlkbXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NjQ5NjEsImV4cCI6MjA2NzQ0MDk2MX0.0Nh_rE_1vKYxT68nwQ11esIkOz6OcDY3YdZCb-bucYc';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing Supabase credentials');
    console.error('Please set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
    console.error('Or use VITE_SUPABASE_ANON_KEY if service role key is not available');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listUsers() {
    console.log('📋 Fetching all users and their roles...\n');
    
    try {
        // Get all profiles first
        const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('*')
            .order('email');

        if (profilesError) throw profilesError;

        // Get all user roles
        const { data: roles, error: rolesError } = await supabase
            .from('user_roles')
            .select('*');

        if (rolesError) throw rolesError;

        // Combine profiles with their roles
        const data = profiles.map(profile => {
            const userRole = roles.find(role => role.user_id === profile.user_id);
            return {
                ...profile,
                user_roles: userRole ? [userRole] : []
            };
        });

        if (!data || data.length === 0) {
            console.log('No users found.');
            return;
        }

        console.log('Current Users and Roles:');
        console.log('='.repeat(80));
        
        data.forEach(user => {
            const role = user.user_roles?.[0]?.role || 'no role';
            const roleDate = user.user_roles?.[0]?.created_at || 'unknown';
            const displayName = getDisplayName(user);
            
            console.log(`📧 Email: ${user.email}`);
            console.log(`👤 Name: ${displayName}`);
            console.log(`🔐 Role: ${role.toUpperCase()}`);
            console.log(`📅 Role Set: ${new Date(roleDate).toLocaleString()}`);
            console.log(`🆔 User ID: ${user.user_id}`);
            console.log('-'.repeat(80));
        });
        
    } catch (error) {
        console.error('❌ Error fetching users:', error.message);
    }
}

async function changeUserRole(email, newRole) {
    const validRoles = ['guest', 'admin', 'couple'];
    
    if (!validRoles.includes(newRole)) {
        console.error(`❌ Invalid role: ${newRole}`);
        console.error(`Valid roles are: ${validRoles.join(', ')}`);
        return;
    }

    console.log(`🔄 Changing ${email} to ${newRole.toUpperCase()} role...\n`);
    
    try {
        // First, find the user
        const { data: user, error: userError } = await supabase
            .from('profiles')
            .select('user_id, email, first_name, last_name')
            .eq('email', email)
            .single();

        if (userError) {
            if (userError.code === 'PGRST116') {
                console.error(`❌ User not found: ${email}`);
                return;
            }
            throw userError;
        }

        console.log(`✅ Found user: ${user.email}`);
        
        // Check current role
        const { data: currentRole } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.user_id)
            .single();

        if (currentRole) {
            console.log(`📋 Current role: ${currentRole.role.toUpperCase()}`);
            
            if (currentRole.role === newRole) {
                console.log(`ℹ️  User already has ${newRole} role. No change needed.`);
                return;
            }
        } else {
            console.log('📋 Current role: No role assigned');
        }

        // Create backup of current state
        const backupData = {
            user_id: user.user_id,
            email: user.email,
            old_role: currentRole?.role || null,
            new_role: newRole,
            timestamp: new Date().toISOString(),
            operation: 'role_change'
        };
        
        const backupFile = path.join(__dirname, 'role-change-backup.json');
        let backups = [];
        
        if (fs.existsSync(backupFile)) {
            try {
                backups = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
            } catch (e) {
                backups = [];
            }
        }
        
        backups.push(backupData);
        fs.writeFileSync(backupFile, JSON.stringify(backups, null, 2));
        console.log(`💾 Backup created: ${backupFile}`);

        // Use safe upsert approach
        const { error: roleError } = await supabase
            .from('user_roles')
            .upsert({
                user_id: user.user_id,
                role: newRole
            }, {
                onConflict: 'user_id'
            });

        if (roleError) {
            // If upsert fails, try delete and insert approach
            console.log('⚠️  Upsert failed, trying delete and insert approach...');
            
            const { error: deleteError } = await supabase
                .from('user_roles')
                .delete()
                .eq('user_id', user.user_id);

            if (deleteError) {
                console.error('❌ Error deleting old role:', deleteError.message);
                throw deleteError;
            }

            const { error: insertError } = await supabase
                .from('user_roles')
                .insert({
                    user_id: user.user_id,
                    role: newRole
                });

            if (insertError) {
                console.error('❌ Error inserting new role:', insertError.message);
                throw insertError;
            }
        }

        console.log(`✅ Successfully changed ${email} to ${newRole.toUpperCase()} role!`);
        
        // Verify the change
        const { data: newRoleData } = await supabase
            .from('user_roles')
            .select('role, created_at')
            .eq('user_id', user.user_id)
            .single();

        if (newRoleData) {
            console.log(`✅ Verified: Role is now ${newRoleData.role.toUpperCase()}`);
            console.log(`📅 Changed at: ${new Date(newRoleData.created_at).toLocaleString()}`);
        }
        
    } catch (error) {
        console.error('❌ Error changing user role:', error.message);
    }
}

async function createBackup() {
    console.log('💾 Creating backup of all user roles...\n');
    
    try {
        const { data, error } = await supabase
            .from('user_roles')
            .select(`
                *,
                profiles(email, first_name, last_name)
            `);

        if (error) throw error;

        const backup = {
            created_at: new Date().toISOString(),
            user_roles: data
        };

        const backupFile = path.join(__dirname, `user-roles-backup-${Date.now()}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2));
        
        console.log(`✅ Backup created: ${backupFile}`);
        console.log(`📊 Backed up ${data.length} user role records`);
        
    } catch (error) {
        console.error('❌ Error creating backup:', error.message);
    }
}

function getDisplayName(user) {
    return user.display_name || 
           `${user.first_name || ''} ${user.last_name || ''}`.trim() || 
           user.email.split('@')[0];
}

function showUsage() {
    console.log('User Role Management Script');
    console.log('=' .repeat(50));
    console.log('');
    console.log('Usage:');
    console.log('  node manage-user-roles.js list');
    console.log('  node manage-user-roles.js change <email> <role>');
    console.log('  node manage-user-roles.js backup');
    console.log('');
    console.log('Examples:');
    console.log('  node manage-user-roles.js list');
    console.log('  node manage-user-roles.js change daniel.j.fleuren@gmail.com guest');
    console.log('  node manage-user-roles.js change daniel.j.fleuren@gmail.com admin');
    console.log('  node manage-user-roles.js backup');
    console.log('');
    console.log('Valid roles: guest, admin, couple');
}

async function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        showUsage();
        return;
    }

    const command = args[0];

    switch (command) {
        case 'list':
            await listUsers();
            break;
            
        case 'change':
            if (args.length !== 3) {
                console.error('❌ Usage: node manage-user-roles.js change <email> <role>');
                return;
            }
            await changeUserRole(args[1], args[2]);
            break;
            
        case 'backup':
            await createBackup();
            break;
            
        default:
            console.error(`❌ Unknown command: ${command}`);
            showUsage();
    }
}

// Run the script
main().catch(console.error);

export {
    listUsers,
    changeUserRole,
    createBackup
};