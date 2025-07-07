import React, { useState, useEffect } from 'react';
import GlassCard from '@/components/GlassCard';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';
import weddingHero from '@/assets/wedding-hero.jpg';

const Home: React.FC = () => {
  const [timeToWedding, setTimeToWedding] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Wedding date - you can change this
  const weddingDate = new Date('2024-09-15T16:00:00');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance > 0) {
        setTimeToWedding({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <div 
        className="relative h-screen flex items-center justify-center px-5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${weddingHero})` }}
      >
        {/* Glass Overlay */}
        <div className="absolute inset-0 glass-frosted" />
        
        {/* Hero Content */}
        <div className="relative z-10 text-center animate-fade-up">
          <h1 className="wedding-display text-white mb-4 animate-glass-float drop-shadow-lg">
            Sarah & James
          </h1>
          <p className="wedding-subheading text-white/90 mb-6 drop-shadow-md">
            September 15, 2024
          </p>
          <p className="wedding-body text-white/80 max-w-md mx-auto drop-shadow-md">
            Join us as we celebrate our love story and begin this beautiful journey together
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 py-12">
        {/* Countdown Timer */}
        <GlassCard className="mb-8 p-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-semibold text-center mb-6 text-wedding-navy">
            Countdown to Forever
          </h2>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl font-light text-wedding-navy mb-1">
                {timeToWedding.days}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Days
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-light text-wedding-navy mb-1">
                {timeToWedding.hours}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Hours
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-light text-wedding-navy mb-1">
                {timeToWedding.minutes}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Minutes
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-3xl font-light text-wedding-navy mb-1">
                {timeToWedding.seconds}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">
                Seconds
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <GlassCard 
            className="p-6 text-center animate-fade-up" 
            style={{ animationDelay: '0.4s' }}
          >
            <Calendar className="w-8 h-8 mx-auto mb-3 text-glass-blue" />
            <h3 className="font-semibold mb-2 text-wedding-navy">When</h3>
            <p className="text-sm text-muted-foreground">
              September 15, 2024<br />
              4:00 PM
            </p>
          </GlassCard>
          
          <GlassCard 
            className="p-6 text-center animate-fade-up" 
            style={{ animationDelay: '0.5s' }}
          >
            <MapPin className="w-8 h-8 mx-auto mb-3 text-glass-pink" />
            <h3 className="font-semibold mb-2 text-wedding-navy">Where</h3>
            <p className="text-sm text-muted-foreground">
              Sunset Garden<br />
              Venue
            </p>
          </GlassCard>
        </div>

        {/* Welcome Message */}
        <GlassCard 
          className="p-6 animate-fade-up" 
          style={{ animationDelay: '0.6s' }}
          variant="secondary"
        >
          <h3 className="text-lg font-semibold mb-4 text-wedding-navy">
            Welcome to Our Wedding
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We're so excited to share this special day with you! This app contains 
            everything you need to know about our wedding celebration.
          </p>
          <div className="flex items-center gap-2 text-sm text-glass-green">
            <Clock className="w-4 h-4" />
            <span>RSVP by August 1st, 2024</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Home;