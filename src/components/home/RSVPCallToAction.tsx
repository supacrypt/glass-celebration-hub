import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRSVPStatus } from '@/hooks/useRSVPStatus';
import { Calendar, Heart, Check } from 'lucide-react';

const RSVPCallToAction: React.FC = () => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const { needsRSVP, loading } = useRSVPStatus();
  
  const isAdmin = userRole?.role === 'admin' || userRole?.role === 'couple';
  
  // Don't show for admins or if user already RSVP'd
  if (!user || isAdmin || loading) {
    return null;
  }
  
  const handleRSVPClick = () => {
    navigate('/rsvp');
  };
  
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 mt-6 sm:mt-8">
      {needsRSVP ? (
        // Show RSVP button for guests who haven't RSVP'd
        <div className="text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-4">
            We can't wait to celebrate with you!
          </p>
          <button
            onClick={handleRSVPClick}
            className="group relative px-8 py-4 bg-gradient-to-r from-wedding-navy to-wedding-navy-light text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span>RSVP Now</span>
              <Heart className="w-5 h-5 text-red-400 animate-pulse" />
            </div>
            
            {/* Glassmorphic overlay */}
            <div className="absolute inset-0 bg-white/10 rounded-xl backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      ) : (
        // Show confirmation for guests who have RSVP'd
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm sm:text-base text-muted-foreground">
              Thank you for your RSVP!
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground/80">
            We look forward to celebrating with you
          </p>
        </div>
      )}
    </div>
  );
};

export default RSVPCallToAction;