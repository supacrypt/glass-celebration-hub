import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, X, Users, Calendar } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Badge } from '@/components/ui/badge';
import { useRSVPs, useWeddingEvents } from '@/hooks/useWeddingData';
import { useAuth } from '@/hooks/useAuth';

const RSVPStatus: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rsvps, loading } = useRSVPs(user?.id);
  const { events } = useWeddingEvents();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attending':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'not_attending':
        return <X className="w-5 h-5 text-red-500" />;
      case 'maybe':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'attending':
        return <Badge className="bg-green-100 text-green-800">Attending</Badge>;
      case 'not_attending':
        return <Badge className="bg-red-100 text-red-800">Not Attending</Badge>;
      case 'maybe':
        return <Badge className="bg-yellow-100 text-yellow-800">Maybe</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalGuests = rsvps.reduce((total, rsvp) => {
    return rsvp.status === 'attending' ? total + rsvp.guest_count : total;
  }, 0);

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/rsvp')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#2d3f51]">RSVP Status</h1>
          <p className="text-sm text-[#7a736b]">Your wedding event responses</p>
        </div>
      </div>

      {/* Summary Card */}
      <GlassCard className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-wedding-navy/10 flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-wedding-navy" />
            </div>
            <div className="text-2xl font-bold text-wedding-navy">{totalGuests}</div>
            <div className="text-sm text-muted-foreground">Total Guests</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {rsvps.filter(r => r.status === 'attending').length}
            </div>
            <div className="text-sm text-muted-foreground">Events Attending</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-2xl font-bold text-gray-600">{events.length}</div>
            <div className="text-sm text-muted-foreground">Total Events</div>
          </div>
        </div>
      </GlassCard>

      {/* RSVP List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy mx-auto"></div>
        </div>
      ) : rsvps.length === 0 ? (
        <GlassCard className="p-8 text-center">
          <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No RSVPs Yet</h3>
          <p className="text-muted-foreground mb-4">
            You haven't responded to any wedding events yet.
          </p>
          <button 
            onClick={() => navigate('/rsvp')}
            className="px-4 py-2 bg-wedding-navy text-white rounded-glass hover:bg-wedding-navy-light transition-colors"
          >
            Submit RSVP
          </button>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {events.map((event) => {
            const rsvp = rsvps.find(r => r.event_id === event.id);
            
            return (
              <GlassCard key={event.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(rsvp?.status || 'pending')}
                      <h3 className="font-semibold text-[#2d3f51]">{event.title}</h3>
                      {getStatusBadge(rsvp?.status || 'pending')}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {formatDate(event.event_date)}
                    </p>
                    
                    {event.venue_name && (
                      <p className="text-sm text-muted-foreground mb-2">
                        📍 {event.venue_name}
                      </p>
                    )}
                    
                    {rsvp && (
                      <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
                        <div className="text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="w-4 h-4" />
                            <span>Guest Count: {rsvp.guest_count}</span>
                          </div>
                          
                          {rsvp.dietary_restrictions && (
                            <div className="text-xs text-muted-foreground">
                              Dietary: {rsvp.dietary_restrictions}
                            </div>
                          )}
                          
                          {rsvp.message && (
                            <div className="text-xs text-muted-foreground mt-2">
                              Message: "{rsvp.message}"
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Update Button */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => navigate('/rsvp')}
          className="px-6 py-3 bg-wedding-navy text-white rounded-glass hover:bg-wedding-navy-light transition-colors"
        >
          Update RSVP Responses
        </button>
      </div>
    </div>
  );
};

export default RSVPStatus;