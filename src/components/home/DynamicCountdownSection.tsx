import React, { useState, useEffect } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';

interface TimeToWedding {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast?: boolean;
  isToday?: boolean;
}

interface PostWeddingState {
  isMarried: boolean;
  daysMarried: number;
  hoursMarried: number;
  minutesMarried: number;
  secondsMarried: number;
}

const DynamicCountdownSection: React.FC = () => {
  const { settings, loading } = useAppSettings();
  const [timeToWedding, setTimeToWedding] = useState<TimeToWedding>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    isToday: false
  });
  const [postWeddingState, setPostWeddingState] = useState<PostWeddingState>({
    isMarried: false,
    daysMarried: 0,
    hoursMarried: 0,
    minutesMarried: 0,
    secondsMarried: 0
  });

  useEffect(() => {
    if (loading || !settings.wedding_date) return;

    const weddingDate = new Date(settings.wedding_date);
    
    const updateCountdown = () => {
      const now = new Date();
      const nowTime = now.getTime();
      const weddingTime = weddingDate.getTime();
      const distance = weddingTime - nowTime;

      // Check if wedding is today
      const isToday = now.toDateString() === weddingDate.toDateString();
      
      if (distance > 0) {
        // Wedding is in the future
        setTimeToWedding({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          isPast: false,
          isToday
        });
        setPostWeddingState({
          isMarried: false,
          daysMarried: 0,
          hoursMarried: 0,
          minutesMarried: 0,
          secondsMarried: 0
        });
      } else {
        // Wedding has passed
        const timeSinceWedding = Math.abs(distance);
        setTimeToWedding({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: true,
          isToday
        });
        setPostWeddingState({
          isMarried: true,
          daysMarried: Math.floor(timeSinceWedding / (1000 * 60 * 60 * 24)),
          hoursMarried: Math.floor((timeSinceWedding % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutesMarried: Math.floor((timeSinceWedding % (1000 * 60 * 60)) / (1000 * 60)),
          secondsMarried: Math.floor((timeSinceWedding % (1000 * 60)) / 1000)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.wedding_date, loading]);

  if (loading) {
    return (
      <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 text-center animate-fade-up">
        <div className="animate-pulse">
          <div className="h-8 bg-glass-blue/20 rounded mb-4"></div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-secondary p-4 sm:p-6 min-h-[120px] sm:min-h-[140px]">
                <div className="h-12 bg-glass-blue/20 rounded mb-2"></div>
                <div className="h-4 bg-glass-blue/20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle post-wedding state
  if (postWeddingState.isMarried) {
    const marriedItems = [
      { value: postWeddingState.daysMarried, label: 'DAYS' },
      { value: postWeddingState.hoursMarried, label: 'HOURS' },
      { value: postWeddingState.minutesMarried, label: 'MINUTES' },
      { value: postWeddingState.secondsMarried, label: 'SECONDS' }
    ];

    return (
      <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 text-center animate-fade-up">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <span className="text-xl sm:text-2xl lg:text-3xl animate-glass-float">💍</span>
          <h1 className="responsive-heading-lg font-dolly font-bold text-wedding-navy tracking-tight">
            We're Married!
          </h1>
        </div>
        <p className="responsive-text-lg text-muted-foreground mb-6 sm:mb-8">
          Thank you for celebrating with us! Here's how long we've been married:
        </p>
        
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6">
          {marriedItems.map((item) => (
            <div 
              key={item.label}
              className="glass-secondary p-4 sm:p-6 text-center transition-all duration-300 hover:scale-105 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center"
            >
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-wedding-navy leading-none mb-2 bg-gradient-to-r from-glass-green to-glass-blue bg-clip-text text-transparent">
                {item.value}
              </div>
              <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
        
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-glass-green font-semibold uppercase tracking-wider">
          <div className="w-2 h-2 bg-glass-green rounded-full animate-pulse"></div>
          Married
        </div>
      </div>
    );
  }

  // Handle today's wedding
  if (timeToWedding.isToday) {
    return (
      <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 text-center animate-fade-up">
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
          <span className="text-xl sm:text-2xl lg:text-3xl animate-glass-float">🎉</span>
          <h1 className="responsive-heading-lg font-dolly font-bold text-wedding-navy tracking-tight">
            Today's The Day!
          </h1>
        </div>
        <p className="responsive-text-lg text-muted-foreground mb-6 sm:mb-8">
          It's our wedding day! The ceremony begins at {settings.ceremony_time}
        </p>
        
        <div className="glass-secondary p-8 text-center">
          <div className="text-6xl mb-4">💒</div>
          <div className="text-2xl font-bold text-wedding-navy mb-2">
            See you at {settings.ceremony_time}!
          </div>
          <div className="text-muted-foreground">
            Ben Ean, Hunter Valley
          </div>
        </div>
      </div>
    );
  }

  // Default countdown (wedding is in the future)
  const countdownItems = [
    { value: timeToWedding.days, label: 'DAYS' },
    { value: timeToWedding.hours, label: 'HOURS' },
    { value: timeToWedding.minutes, label: 'MINUTES' },
    { value: timeToWedding.seconds, label: 'SECONDS' }
  ];

  return (
    <div className="glass-card responsive-card-padding mb-6 sm:mb-8 lg:mb-10 text-center animate-fade-up">
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-2 sm:mb-3">
        <span className="text-xl sm:text-2xl lg:text-3xl animate-glass-float">⏰</span>
        <h1 className="responsive-heading-lg font-dolly font-bold text-wedding-navy tracking-tight">
          {settings.countdown_message}
        </h1>
      </div>
      <p className="responsive-text-lg text-muted-foreground mb-6 sm:mb-8">
        Every second brings us closer to celebrating with you!
      </p>
      
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 mb-6">
        {countdownItems.map((item) => (
          <div 
            key={item.label}
            className="glass-secondary p-4 sm:p-6 text-center transition-all duration-300 hover:scale-105 min-h-[120px] sm:min-h-[140px] flex flex-col justify-center"
          >
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-wedding-navy leading-none mb-2 bg-gradient-to-r from-glass-blue to-glass-purple bg-clip-text text-transparent">
              {item.value}
            </div>
            <div className="text-sm sm:text-base text-muted-foreground uppercase tracking-wider font-medium">
              {item.label}
            </div>
          </div>
        ))}
      </div>
      
      <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-glass-green font-semibold uppercase tracking-wider">
        <div className="w-2 h-2 bg-glass-green rounded-full animate-pulse"></div>
        Live
      </div>
    </div>
  );
};

export default DynamicCountdownSection;