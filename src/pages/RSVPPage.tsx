import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Heart, Calendar, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import RSVPIntegration from '@/components/guest/RSVPIntegration';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { GuestManager } from '@/utils/guestManagement';
import { toast } from 'sonner';

const RSVPPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [guestRecord, setGuestRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Get guest ID from URL params or use current user
  const guestId = searchParams.get('guest') || undefined;

  useEffect(() => {
    loadGuestData();
  }, [user, guestId]);

  const loadGuestData = async () => {
    try {
      setLoading(true);
      
      if (guestId) {
        // Load specific guest by ID
        const guests = await GuestManager.getAllGuests();
        const guest = guests.find(g => g.id === guestId);
        setGuestRecord(guest || null);
      } else if (user) {
        // Load current user's guest record
        const guest = await GuestManager.getGuestByUserId(user.id);
        setGuestRecord(guest);
      }
    } catch (error) {
      console.error('Error loading guest data:', error);
      toast.error('Failed to load guest information');
    } finally {
      setLoading(false);
    }
  };

  const handleRSVPSubmitted = async () => {
    // Show success message
    toast.success('Thank you for your RSVP response!');
    
    // Navigate back to home after a short delay to let the toast show
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 pb-24 px-5">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto"></div>
              <p className="text-[#7a736b] mt-4">Loading RSVP form...</p>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  const weddingDetails = {
    date: 'October 5, 2025',
    time: '3:00 PM',
    ceremony: 'Ben Ean Winery, Hunter Valley',
    reception: 'Same Location',
    dress_code: 'Cocktail Attire'
  };

  return (
    <div className="min-h-screen pt-16 pb-24 px-5 bg-gradient-to-br from-blue-50 via-white to-cream-50">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/')}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#2d3f51] flex items-center gap-2">
                <Heart className="w-6 h-6 text-wedding-gold" />
                Wedding RSVP
              </h1>
              <p className="text-sm text-[#7a736b]">
                {guestRecord?.display_name || guestRecord?.first_name 
                  ? `Welcome, ${guestRecord.display_name || guestRecord.first_name}!`
                  : 'Please respond to our wedding invitation'
                }
              </p>
            </div>
          </div>
        </motion.div>

        {/* Wedding Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <GlassCard className="p-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-[#2d3f51]">
                Tim & Kirsten's Wedding
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="w-4 h-4 text-wedding-gold" />
                  <span>{weddingDetails.date}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Clock className="w-4 h-4 text-wedding-gold" />
                  <span>{weddingDetails.time}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <MapPin className="w-4 h-4 text-wedding-gold" />
                  <span>{weddingDetails.ceremony}</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <Heart className="w-4 h-4 text-wedding-gold" />
                  <span>{weddingDetails.dress_code}</span>
                </div>
              </div>
              
            </div>
          </GlassCard>
        </motion.div>

        {/* RSVP Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {guestRecord ? (
            <RSVPIntegration
              guestId={guestRecord.id}
              onRSVPSubmitted={handleRSVPSubmitted}
              readonly={guestRecord.rsvp_responded_at !== null}
            />
          ) : (
            <GlassCard className="p-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-[#2d3f51]">
                  Guest Record Not Found
                </h3>
                <p className="text-[#7a736b]">
                  We couldn't find your guest record. This could be because:
                </p>
                <ul className="text-sm text-[#7a736b] text-left space-y-1">
                  <li>• You need to sign in to access your RSVP</li>
                  <li>• Your email address may not be in our guest list yet</li>
                  <li>• There may be a typo in the invitation link</li>
                </ul>
                <div className="space-y-2">
                  <Button
                    onClick={() => navigate('/auth')}
                    className="bg-wedding-navy hover:bg-wedding-navy/90"
                  >
                    Sign In to RSVP
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="border-wedding-navy text-wedding-navy"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <GlassCard className="p-4">
            <p className="text-sm text-[#7a736b]">
              Having trouble with your RSVP? Contact us at:
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm">
                <strong className="text-wedding-navy">Tim:</strong>{' '}
                <a 
                  href="tel:0401372025" 
                  className="text-wedding-navy hover:underline"
                >
                  0401 372 025
                </a>
              </p>
              <p className="text-sm">
                <strong className="text-wedding-navy">Kirsten:</strong>{' '}
                <a 
                  href="tel:0402180915" 
                  className="text-wedding-navy hover:underline"
                >
                  0402 180 915
                </a>
              </p>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default RSVPPage;