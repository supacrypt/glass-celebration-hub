import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AvatarUpload from '@/components/ui/avatar-upload';
import { Facebook, Twitter, Instagram, Linkedin, Plus, X } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    display_name: profile?.display_name || '',
    phone: profile?.phone || '',
    avatar_url: profile?.avatar_url || '',
    social_links: profile?.social_links || {},
    contact_details: profile?.contact_details || {},
    dietary_needs: profile?.dietary_needs || [],
    allergies: profile?.allergies || [],
  });
  
  const [newDietaryNeed, setNewDietaryNeed] = useState('');
  const [newAllergy, setNewAllergy] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile(formData);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Profile updated successfully!",
          variant: "default",
        });
        setIsEditing(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
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
      avatar_url: profile?.avatar_url || '',
      social_links: profile?.social_links || {},
      contact_details: profile?.contact_details || {},
      dietary_needs: profile?.dietary_needs || [],
      allergies: profile?.allergies || [],
    });
    setIsEditing(false);
  };

  // Update form data when profile changes
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        display_name: profile.display_name || '',
        phone: profile.phone || '',
        avatar_url: profile.avatar_url || '',
        social_links: profile.social_links || {},
        contact_details: profile.contact_details || {},
        dietary_needs: profile.dietary_needs || [],
        allergies: profile.allergies || [],
      });
    }
  }, [profile]);

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value
      }
    }));
  };

  const handleContactDetailChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contact_details: {
        ...prev.contact_details,
        [field]: value
      }
    }));
  };

  const addDietaryNeed = () => {
    if (newDietaryNeed.trim() && !formData.dietary_needs.includes(newDietaryNeed.trim())) {
      setFormData(prev => ({
        ...prev,
        dietary_needs: [...prev.dietary_needs, newDietaryNeed.trim()]
      }));
      setNewDietaryNeed('');
    }
  };

  const removeDietaryNeed = (need: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_needs: prev.dietary_needs.filter(item => item !== need)
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(item => item !== allergy)
    }));
  };

  const handleAvatarUpdate = (url: string | null) => {
    setFormData(prev => ({ ...prev, avatar_url: url || '' }));
  };

  const socialPlatforms = [
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/yourprofile' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/yourusername' },
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/yourusername' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourprofile' },
  ];

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-2xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="wedding-heading">My Profile</CardTitle>
            <CardDescription>
              Manage your personal information and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a profile picture to help others recognize you
                </p>
              </div>
              
              <AvatarUpload
                currentAvatarUrl={formData.avatar_url}
                userId={user?.id || ''}
                onAvatarUpdate={handleAvatarUpdate}
                size="large"
                disabled={!isEditing}
                showRemoveOption={true}
              />
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Supports JPEG, PNG, WebP • Max 5MB
                </p>
              </div>
            </div>

            <Separator />

            {/* Basic Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => handleInputChange('display_name', e.target.value)}
                  disabled={!isEditing}
                  placeholder="How you'd like to be displayed"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your phone number"
                  type="tel"
                />
              </div>
            </div>

            <Separator />

            {/* Contact Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Additional Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.contact_details.address || ''}
                    onChange={(e) => handleContactDetailChange('address', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Your address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={formData.contact_details.emergency_contact || ''}
                    onChange={(e) => handleContactDetailChange('emergency_contact', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Emergency contact number"
                    type="tel"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Social Media Links */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Social Media Profiles</h3>
              <p className="text-sm text-muted-foreground">
                Connect your social media profiles to help others find and connect with you
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <div key={platform.key} className="space-y-2">
                      <Label htmlFor={platform.key} className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        {platform.label}
                      </Label>
                      <Input
                        id={platform.key}
                        value={formData.social_links[platform.key] || ''}
                        onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                        disabled={!isEditing}
                        placeholder={platform.placeholder}
                        type="url"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Dietary Needs & Allergies */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Dietary Preferences & Allergies</h3>
              <p className="text-sm text-muted-foreground">
                Help us accommodate your dietary needs for wedding events and meals
              </p>
              
              {/* Dietary Needs */}
              <div className="space-y-3">
                <Label>Dietary Needs</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.dietary_needs.map((need) => (
                    <Badge key={need} variant="secondary" className="flex items-center gap-1">
                      {need}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeDietaryNeed(need)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newDietaryNeed}
                      onChange={(e) => setNewDietaryNeed(e.target.value)}
                      placeholder="Add dietary need (e.g., Vegetarian, Vegan, Gluten-free)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDietaryNeed())}
                    />
                    <Button
                      type="button"
                      onClick={addDietaryNeed}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Allergies */}
              <div className="space-y-3">
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.allergies.map((allergy) => (
                    <Badge key={allergy} variant="destructive" className="flex items-center gap-1">
                      {allergy}
                      {isEditing && (
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="ml-1 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      placeholder="Add allergy (e.g., Nuts, Dairy, Seafood)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    />
                    <Button
                      type="button"
                      onClick={addAllergy}
                      size="sm"
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)}
                  className="glass-button"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleSave}
                    disabled={loading}
                    className="glass-button"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    onClick={handleCancel}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;