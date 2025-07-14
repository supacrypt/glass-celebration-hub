import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  UserPlus, 
  CheckCircle, 
  XCircle, 
  Utensils, 
  AlertTriangle,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface RSVPFormData {
  rsvp_status: 'confirmed' | 'declined';
  plus_one_name: string;
  plus_one_email: string;
  dietary_needs: string[];
  allergies: string[];
  special_requests: string;
  additional_guests: {
    first_name: string;
    last_name: string;
    email: string;
    relationship: string;
  }[];
  contact_updates: {
    phone: string;
    address: string;
    emergency_contact: string;
  };
}

interface RSVPIntegrationProps {
  guestId?: string;
  onRSVPSubmitted?: (data: RSVPFormData) => void;
  readonly?: boolean;
}

const DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan', 
  'Gluten-free',
  'Dairy-free',
  'Nut-free',
  'Kosher',
  'Halal',
  'Low-sodium',
  'Keto',
  'Pescatarian'
];

const ALLERGY_OPTIONS = [
  'Nuts',
  'Shellfish',
  'Dairy',
  'Eggs',
  'Soy',
  'Wheat/Gluten',
  'Fish',
  'Sesame',
  'Sulfites',
  'Other'
];

const RSVPIntegration: React.FC<RSVPIntegrationProps> = ({ 
  guestId, 
  onRSVPSubmitted,
  readonly = false 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentGuest, setCurrentGuest] = useState<any>(null);
  const [formData, setFormData] = useState<RSVPFormData>({
    rsvp_status: 'confirmed',
    plus_one_name: '',
    plus_one_email: '',
    dietary_needs: [],
    allergies: [],
    special_requests: '',
    additional_guests: [],
    contact_updates: {
      phone: '',
      address: '',
      emergency_contact: ''
    }
  });

  useEffect(() => {
    if (guestId) {
      fetchGuestData();
    } else if (user) {
      fetchCurrentUserGuest();
    }
  }, [guestId, user]);

  const fetchGuestData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', guestId)
        .single();

      if (error) throw error;
      
      setCurrentGuest(data);
      
      // Pre-populate form with existing data
      setFormData(prev => ({
        ...prev,
        rsvp_status: data.rsvp_status || 'confirmed',
        plus_one_name: data.plus_one_name || '',
        plus_one_email: data.plus_one_email || '',
        dietary_needs: data.dietary_needs || [],
        allergies: data.allergies || [],
        special_requests: data.special_requests || '',
        contact_updates: {
          phone: data.phone || '',
          address: data.contact_details?.address || '',
          emergency_contact: data.contact_details?.emergency_contact || ''
        }
      }));
    } catch (error) {
      console.error('Error fetching guest data:', error);
      toast.error('Failed to load guest information');
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUserGuest = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setCurrentGuest(data);
        setFormData(prev => ({
          ...prev,
          rsvp_status: data.rsvp_status || 'confirmed',
          plus_one_name: data.plus_one_name || '',
          plus_one_email: data.plus_one_email || '',
          dietary_needs: data.dietary_needs || [],
          allergies: data.allergies || [],
          special_requests: data.special_requests || '',
          contact_updates: {
            phone: data.phone || '',
            address: data.contact_details?.address || '',
            emergency_contact: data.contact_details?.emergency_contact || ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching current user guest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRSVP = async () => {
    try {
      setSubmitting(true);
      
      const targetGuestId = guestId || currentGuest?.id;
      if (!targetGuestId) {
        toast.error('No guest record found');
        return;
      }

      // Update guest record with RSVP data
      const updateData = {
        rsvp_status: formData.rsvp_status,
        rsvp_responded_at: new Date().toISOString(),
        plus_one_name: formData.plus_one_name || null,
        plus_one_email: formData.plus_one_email || null,
        dietary_needs: formData.dietary_needs,
        allergies: formData.allergies,
        special_requests: formData.special_requests || null,
        phone: formData.contact_updates.phone,
        contact_details: {
          ...currentGuest?.contact_details,
          address: formData.contact_updates.address,
          emergency_contact: formData.contact_updates.emergency_contact
        }
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', targetGuestId);

      if (updateError) throw updateError;

      // Add additional guests to the system
      if (formData.additional_guests.length > 0) {
        const newGuestInserts = formData.additional_guests
          .filter(guest => guest.first_name && guest.last_name && guest.email)
          .map(guest => ({
            first_name: guest.first_name,
            last_name: guest.last_name,
            email: guest.email,
            rsvp_status: 'confirmed',
            rsvp_responded_at: new Date().toISOString(),
            contact_details: { 
              relationship: guest.relationship,
              added_by_guest: targetGuestId
            }
          }));

        if (newGuestInserts.length > 0) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert(newGuestInserts);

          if (insertError) throw insertError;
          
          toast.success(`Added ${newGuestInserts.length} additional guest(s) to the list`);
        }
      }

      // Archive guest if they declined
      if (formData.rsvp_status === 'declined') {
        await supabase
          .from('profiles')
          .update({ 
            is_archived: true,
            archived_at: new Date().toISOString(),
            archive_reason: 'Declined RSVP'
          })
          .eq('id', targetGuestId);
      }

      // Log RSVP change in history
      await supabase
        .from('rsvp_history')
        .insert([{
          guest_id: targetGuestId,
          old_status: currentGuest?.rsvp_status || 'pending',
          new_status: formData.rsvp_status,
          change_method: 'online_form',
          change_reason: 'Guest RSVP submission'
        }]);

      // Send confirmation communication log
      await supabase
        .from('guest_communications')
        .insert([{
          guest_id: targetGuestId,
          communication_type: 'email',
          subject: `RSVP ${formData.rsvp_status === 'confirmed' ? 'Confirmation' : 'Decline'} Received`,
          content: `Guest ${formData.rsvp_status} their invitation${formData.plus_one_name ? ` with plus one: ${formData.plus_one_name}` : ''}`,
          direction: 'inbound',
          status: 'received'
        }]);

      toast.success(
        formData.rsvp_status === 'confirmed' 
          ? 'RSVP confirmed! We\'re excited to celebrate with you!' 
          : 'RSVP received. Thank you for letting us know.'
      );

      if (onRSVPSubmitted) {
        onRSVPSubmitted(formData);
      }

      // Refresh guest data
      if (guestId) {
        await fetchGuestData();
      } else {
        await fetchCurrentUserGuest();
      }

    } catch (error) {
      console.error('Error submitting RSVP:', error);
      toast.error('Failed to submit RSVP. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addAdditionalGuest = () => {
    setFormData(prev => ({
      ...prev,
      additional_guests: [
        ...prev.additional_guests,
        { first_name: '', last_name: '', email: '', relationship: '' }
      ]
    }));
  };

  const removeAdditionalGuest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      additional_guests: prev.additional_guests.filter((_, i) => i !== index)
    }));
  };

  const updateAdditionalGuest = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      additional_guests: prev.additional_guests.map((guest, i) => 
        i === index ? { ...guest, [field]: value } : guest
      )
    }));
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto"></div>
          <p className="text-[#7a736b] mt-4">Loading RSVP information...</p>
        </div>
      </GlassCard>
    );
  }

  const isAlreadyResponded = currentGuest?.rsvp_responded_at && readonly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <GlassCard className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Heart className="w-12 h-12 text-wedding-gold mx-auto" />
          <h2 className="text-2xl font-bold text-[#2d3f51]">
            {isAlreadyResponded ? 'Your RSVP Response' : 'Please Respond'}
          </h2>
          <p className="text-[#7a736b]">
            {isAlreadyResponded 
              ? `You responded on ${new Date(currentGuest.rsvp_responded_at).toLocaleDateString()}`
              : 'Help us plan the perfect celebration by sharing your details'
            }
          </p>
          {currentGuest?.rsvp_deadline && (
            <div className="flex items-center justify-center gap-2 text-sm text-orange-600">
              <Clock className="w-4 h-4" />
              Please respond by {new Date(currentGuest.rsvp_deadline).toLocaleDateString()}
            </div>
          )}
        </motion.div>
      </GlassCard>

      {/* RSVP Status */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#2d3f51] flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Will you be attending?
          </h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={formData.rsvp_status === 'confirmed' ? 'default' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, rsvp_status: 'confirmed' }))}
              disabled={readonly}
              className={`h-20 flex-col gap-2 ${
                formData.rsvp_status === 'confirmed' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'border-green-200 text-green-700 hover:bg-green-50'
              }`}
            >
              <CheckCircle className="w-6 h-6" />
              Yes, I'll be there!
            </Button>
            
            <Button
              variant={formData.rsvp_status === 'declined' ? 'default' : 'outline'}
              onClick={() => setFormData(prev => ({ ...prev, rsvp_status: 'declined' }))}
              disabled={readonly}
              className={`h-20 flex-col gap-2 ${
                formData.rsvp_status === 'declined' 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'border-red-200 text-red-700 hover:bg-red-50'
              }`}
            >
              <XCircle className="w-6 h-6" />
              Sorry, can't make it
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Conditional sections based on RSVP status */}
      <AnimatePresence>
        {formData.rsvp_status === 'confirmed' && (
          <>
            {/* Plus One Section */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2d3f51] flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Plus One Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plus_one_name">Partner/Guest Name</Label>
                      <Input
                        id="plus_one_name"
                        value={formData.plus_one_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, plus_one_name: e.target.value }))}
                        placeholder="Full name"
                        disabled={readonly}
                      />
                    </div>
                    <div>
                      <Label htmlFor="plus_one_email">Partner/Guest Email</Label>
                      <Input
                        id="plus_one_email"
                        type="email"
                        value={formData.plus_one_email}
                        onChange={(e) => setFormData(prev => ({ ...prev, plus_one_email: e.target.value }))}
                        placeholder="email@example.com"
                        disabled={readonly}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Dietary Requirements */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <GlassCard className="p-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2d3f51] flex items-center gap-2">
                    <Utensils className="w-5 h-5" />
                    Dietary Preferences & Allergies
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-base font-medium">Dietary Needs</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {DIETARY_OPTIONS.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`dietary-${option}`}
                              checked={formData.dietary_needs.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    dietary_needs: [...prev.dietary_needs, option]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    dietary_needs: prev.dietary_needs.filter(item => item !== option)
                                  }));
                                }
                              }}
                              disabled={readonly}
                            />
                            <Label htmlFor={`dietary-${option}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-base font-medium">Allergies</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {ALLERGY_OPTIONS.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`allergy-${option}`}
                              checked={formData.allergies.includes(option)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setFormData(prev => ({
                                    ...prev,
                                    allergies: [...prev.allergies, option]
                                  }));
                                } else {
                                  setFormData(prev => ({
                                    ...prev,
                                    allergies: prev.allergies.filter(item => item !== option)
                                  }));
                                }
                              }}
                              disabled={readonly}
                            />
                            <Label htmlFor={`allergy-${option}`} className="text-sm">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Additional Guests */}
            {!readonly && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <GlassCard className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#2d3f51] flex items-center gap-2">
                        <UserPlus className="w-5 h-5" />
                        Additional Guests
                      </h3>
                      <Button
                        onClick={addAdditionalGuest}
                        variant="outline"
                        size="sm"
                        className="text-wedding-navy border-wedding-navy"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Guest
                      </Button>
                    </div>
                    
                    <p className="text-sm text-[#7a736b]">
                      Need to add more guests to your party? We'll add them to our guest list.
                    </p>
                    
                    <AnimatePresence>
                      {formData.additional_guests.map((guest, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="p-4 border border-gray-200 rounded-lg space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">Guest {index + 1}</h4>
                            <Button
                              onClick={() => removeAdditionalGuest(index)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                            >
                              Remove
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Input
                              placeholder="First Name"
                              value={guest.first_name}
                              onChange={(e) => updateAdditionalGuest(index, 'first_name', e.target.value)}
                            />
                            <Input
                              placeholder="Last Name"
                              value={guest.last_name}
                              onChange={(e) => updateAdditionalGuest(index, 'last_name', e.target.value)}
                            />
                            <Input
                              placeholder="Email"
                              type="email"
                              value={guest.email}
                              onChange={(e) => updateAdditionalGuest(index, 'email', e.target.value)}
                            />
                            <Input
                              placeholder="Relationship (Friend, Family, etc.)"
                              value={guest.relationship}
                              onChange={(e) => updateAdditionalGuest(index, 'relationship', e.target.value)}
                            />
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Contact Updates */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#2d3f51] flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </h3>
          <p className="text-sm text-[#7a736b]">
            Help us keep in touch and ensure we have your latest details.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_phone">Phone Number</Label>
              <Input
                id="contact_phone"
                value={formData.contact_updates.phone}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_updates: { ...prev.contact_updates, phone: e.target.value }
                }))}
                placeholder="Your phone number"
                disabled={readonly}
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact">Emergency Contact</Label>
              <Input
                id="emergency_contact"
                value={formData.contact_updates.emergency_contact}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  contact_updates: { ...prev.contact_updates, emergency_contact: e.target.value }
                }))}
                placeholder="Name and phone number"
                disabled={readonly}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="contact_address">Mailing Address</Label>
            <Textarea
              id="contact_address"
              value={formData.contact_updates.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                contact_updates: { ...prev.contact_updates, address: e.target.value }
              }))}
              placeholder="Full mailing address for thank you notes"
              disabled={readonly}
            />
          </div>
        </div>
      </GlassCard>

      {/* Special Requests */}
      <GlassCard className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#2d3f51] flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Special Requests or Notes
          </h3>
          
          <Textarea
            value={formData.special_requests}
            onChange={(e) => setFormData(prev => ({ ...prev, special_requests: e.target.value }))}
            placeholder="Any special accommodations, questions, or messages for us..."
            rows={4}
            disabled={readonly}
          />
        </div>
      </GlassCard>

      {/* Submit Button */}
      {!readonly && (
        <GlassCard className="p-6">
          <div className="text-center space-y-4">
            <Button
              onClick={handleSubmitRSVP}
              disabled={submitting}
              className={`w-full md:w-auto px-8 py-3 text-lg ${
                formData.rsvp_status === 'confirmed'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Submitting...
                </div>
              ) : (
                <>
                  {formData.rsvp_status === 'confirmed' ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirm My Attendance
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 mr-2" />
                      Submit My Decline
                    </>
                  )}
                </>
              )}
            </Button>
            
            <p className="text-sm text-[#7a736b]">
              {formData.rsvp_status === 'confirmed' 
                ? "We can't wait to celebrate with you!" 
                : "Thank you for letting us know. We'll miss you!"
              }
            </p>
          </div>
        </GlassCard>
      )}
    </div>
  );
};

export default RSVPIntegration;