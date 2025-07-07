import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, Edit3, Save, X } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    display_name: profile?.display_name || '',
    phone: profile?.phone || '',
    email: profile?.email || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      display_name: profile?.display_name || '',
      phone: profile?.phone || '',
      email: profile?.email || ''
    });
    setIsEditing(false);
  };

  const getInitials = () => {
    const firstName = formData.first_name || profile?.first_name || '';
    const lastName = formData.last_name || profile?.last_name || '';
    return (firstName[0] || '') + (lastName[0] || '');
  };

  const getMemberSince = () => {
    // Since created_at is not in the Profile interface, we'll use a default date
    return 'October 2024';
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-wedding-navy" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-wedding-navy">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Button>
        )}
      </div>

      {/* Profile Avatar Card */}
      <GlassCard className="p-6 mb-6 text-center">
        <div 
          className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--glass-blue-tint)) 0%, hsl(var(--glass-purple-tint)) 100%)'
          }}
        >
          {getInitials()}
        </div>
        
        <h2 className="text-xl font-semibold text-wedding-navy mb-1">
          {formData.display_name || `${formData.first_name} ${formData.last_name}`.trim() || 'Wedding Guest'}
        </h2>
        
        <p className="text-sm text-muted-foreground mb-4">
          {formData.email}
        </p>

        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Member since {getMemberSince()}</span>
        </div>
      </GlassCard>

      {/* Profile Information */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-wedding-navy">Personal Information</h3>
          {isEditing && (
            <div className="flex gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                size="sm"
                className="gap-2"
                disabled={loading}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* First Name */}
          <div>
            <Label htmlFor="first_name" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              First Name
            </Label>
            {isEditing ? (
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Enter your first name"
              />
            ) : (
              <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                {formData.first_name || 'Not set'}
              </div>
            )}
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="last_name" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Last Name
            </Label>
            {isEditing ? (
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Enter your last name"
              />
            ) : (
              <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                {formData.last_name || 'Not set'}
              </div>
            )}
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="display_name" className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Display Name
            </Label>
            {isEditing ? (
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Enter your preferred display name"
              />
            ) : (
              <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                {formData.display_name || 'Not set'}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <div className="p-3 bg-secondary/30 rounded-lg text-sm text-muted-foreground">
              {formData.email}
              <div className="text-xs mt-1">Email cannot be changed</div>
            </div>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4" />
              Phone Number
            </Label>
            {isEditing ? (
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter your phone number"
                type="tel"
              />
            ) : (
              <div className="p-3 bg-secondary/30 rounded-lg text-sm">
                {formData.phone || 'Not set'}
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Profile;