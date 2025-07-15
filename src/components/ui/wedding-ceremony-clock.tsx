import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Heart, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useRSVPs } from '@/hooks/useWeddingData';
import { toast } from 'sonner';

interface WeddingCeremonyClockProps {
  targetDate: string;
  className?: string;
  onRSVPClick?: () => void;
}

interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

interface ClockAngles {
  hour: number;
  minute: number;
  second: number;
}

const WeddingCeremonyClock: React.FC<WeddingCeremonyClockProps> = ({ 
  targetDate, 
  className,
  onRSVPClick 
}) => {
  const [timeState, setTimeState] = useState<TimeState | null>(null);
  const [clockAngles, setClockAngles] = useState<ClockAngles>({ hour: 0, minute: 0, second: 0 });
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { rsvps, submitRSVP } = useRSVPs(user?.id);

  // Check if user has already RSVP'd for the ceremony
  const hasRSVPd = rsvps.some(rsvp => rsvp.status === 'attending');
  const rsvpStatus = rsvps.find(rsvp => rsvp.event_id)?.status;

  useEffect(() => {
    if (!targetDate) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeState({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
          isPast: false,
        });
      } else {
        setTimeState({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
      }
    };

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // Calculate smooth angles
      const secondAngle = (seconds * 6) + (milliseconds * 0.006);
      const minuteAngle = (minutes * 6) + (seconds * 0.1);
      const hourAngle = ((hours % 12) * 30) + (minutes * 0.5);

      setClockAngles({
        hour: hourAngle,
        minute: minuteAngle,
        second: secondAngle
      });

      // Update digital time
      const digitalHours = hours.toString().padStart(2, '0');
      const digitalMinutes = minutes.toString().padStart(2, '0');
      const digitalSeconds = seconds.toString().padStart(2, '0');
      setCurrentTime(`${digitalHours}:${digitalMinutes}:${digitalSeconds}`);
    };

    updateCountdown();
    updateClock();
    setIsVisible(true);

    const countdownInterval = setInterval(updateCountdown, 1000);
    const clockInterval = setInterval(updateClock, 50);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(clockInterval);
    };
  }, [targetDate]);

  const handleRSVP = async (status: 'attending' | 'not_attending') => {
    if (!user) {
      if (onRSVPClick) {
        onRSVPClick();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // For this demo, we'll use a mock event ID. In real implementation, 
      // you'd get the actual ceremony event ID
      const result = await submitRSVP('ceremony-event-id', status, 1);
      
      if (result.error) {
        throw result.error;
      }

      toast.success(
        status === 'attending' 
          ? "🎉 Thank you for your RSVP! We can't wait to celebrate with you!" 
          : "Thank you for letting us know. We'll miss you!"
      );
    } catch (error) {
      console.error('RSVP Error:', error);
      toast.error('Failed to submit RSVP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Background orbs animation
  const BackgroundOrbs = () => (
    <div className="absolute inset-0 overflow-hidden">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full filter blur-3xl opacity-20"
          style={{
            width: `${300 + i * 50}px`,
            height: `${300 + i * 50}px`,
            background: i === 0 
              ? 'radial-gradient(circle, hsl(var(--wedding-navy)) 0%, transparent 70%)'
              : i === 1
              ? 'radial-gradient(circle, hsl(var(--wedding-gold)) 0%, transparent 70%)'
              : 'radial-gradient(circle, hsl(var(--wedding-cream)) 0%, transparent 70%)',
            top: i === 0 ? '-150px' : i === 1 ? 'auto' : '50%',
            bottom: i === 1 ? '-150px' : 'auto',
            left: i === 0 ? '-150px' : i === 1 ? 'auto' : '50%',
            right: i === 1 ? '-150px' : 'auto',
            transform: i === 2 ? 'translate(-50%, -50%)' : 'none'
          }}
          animate={{
            x: [0, 50, -30, -50, 0],
            y: [0, -50, 30, -30, 0],
            scale: [1, 1.1, 0.9, 1.05, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            delay: i * 5,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );

  // Hour markers for the clock
  const HourMarkers = () => (
    <>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-full flex justify-center"
          style={{ transform: `rotate(${i * 30}deg)` }}
        >
          <div 
            className={cn(
              "rounded-full bg-gradient-to-b from-wedding-navy/60 to-wedding-navy/30 shadow-sm",
              i % 3 === 0 ? "w-1.5 h-8" : "w-1 h-5"
            )}
          />
        </div>
      ))}
    </>
  );

  // Clock hands
  const ClockHands = () => (
    <>
      {/* Hour hand */}
      <motion.div
        className="absolute w-2 bg-gradient-to-t from-wedding-navy to-wedding-navy/70 rounded-full shadow-lg"
        style={{
          height: '80px',
          bottom: '50%',
          left: '50%',
          marginLeft: '-4px',
          transformOrigin: 'bottom center',
          transform: `rotate(${clockAngles.hour}deg)`
        }}
      />
      
      {/* Minute hand */}
      <motion.div
        className="absolute w-1.5 bg-gradient-to-t from-wedding-navy to-wedding-navy/80 rounded-full shadow-lg"
        style={{
          height: '110px',
          bottom: '50%',
          left: '50%',
          marginLeft: '-3px',
          transformOrigin: 'bottom center',
          transform: `rotate(${clockAngles.minute}deg)`
        }}
      />
      
      {/* Second hand */}
      <motion.div
        className="absolute w-0.5 bg-gradient-to-t from-wedding-gold to-wedding-gold/70 rounded-full shadow-lg"
        style={{
          height: '120px',
          bottom: '50%',
          left: '50%',
          marginLeft: '-1px',
          transformOrigin: 'bottom center',
          transform: `rotate(${clockAngles.second}deg)`,
          filter: 'drop-shadow(0 0 10px hsl(var(--wedding-gold) / 0.5))'
        }}
      />
      
      {/* Center dot */}
      <div className="absolute w-4 h-4 bg-gradient-to-br from-wedding-navy to-wedding-navy/80 rounded-full shadow-lg border border-wedding-gold/20" />
    </>
  );

  if (timeState === null) {
    return (
      <div className={cn("flex justify-center items-center p-8", className)}>
        <div className="animate-pulse glass-card p-8 rounded-3xl">
          <div className="w-80 h-80 bg-wedding-navy/10 rounded-full mx-auto" />
        </div>
      </div>
    );
  }

  if (timeState.isPast) {
    return (
      <motion.div 
        className={cn("relative glass-card rounded-3xl overflow-hidden p-8", className)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <BackgroundOrbs />
        <div className="relative z-10 text-center space-y-6">
          <motion.div
            className="text-4xl font-bold text-wedding-navy mb-4"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            💍 We're Married! 💍
          </motion.div>
          <p className="text-wedding-navy/70">Thank you for celebrating with us!</p>
          
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{
                  y: [0, -10, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              >
                <Heart className="w-5 h-5 text-wedding-gold fill-current" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={cn("relative space-y-8", className)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          {/* Main container */}
          <div className={cn(
            "relative rounded-3xl overflow-hidden p-8",
            "bg-white/10 dark:bg-black/20",
            "backdrop-blur-2xl border border-white/10"
          )}>
            <BackgroundOrbs />
            
            <div className="relative z-10 space-y-8">
              {/* Ceremony info */}
              <motion.div 
                className="text-center space-y-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-semibold text-wedding-navy">Until We Say "I Do"</h2>
                <div className="flex items-center justify-center gap-2 text-wedding-navy/70">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(targetDate).toLocaleDateString('en-AU', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              </motion.div>

              {/* Countdown cards */}
              <div className="flex justify-center gap-4">
                {[
                  { label: 'Days', value: timeState.days },
                  { label: 'Hours', value: timeState.hours },
                  { label: 'Minutes', value: timeState.minutes }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    className={cn(
                      "relative w-24 h-28 rounded-2xl flex flex-col items-center justify-center gap-2 overflow-hidden",
                      "bg-gradient-to-br from-slate-800 to-slate-900 shadow-neumorphic-dark",
                      "transition-all duration-300",
                      item.label !== 'Seconds' && "hover:shadow-neumorphic-dark-inset hover:bg-blue-500/20"
                    )}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-wedding-gold/10 to-transparent"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    />
                    
                    <span className="text-4xl md:text-5xl font-bold text-white font-dolly tracking-tighter">
                      {item.value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs font-medium text-white/80 uppercase tracking-widest">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Analog clock */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="relative w-80 h-80">
                  {/* Glow ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-wedding-gold/20 via-transparent to-wedding-gold/20"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Clock base */}
                  <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/20 shadow-2xl">
                    {/* Glass overlay with reflection */}
                    <div className="absolute inset-2 rounded-full bg-white/5 backdrop-blur-sm">
                      <div className="absolute top-4 left-6 w-16 h-16 rounded-full bg-gradient-to-br from-white/10 to-transparent filter blur-sm" />
                    </div>
                    
                    {/* Clock face */}
                    <div className="absolute inset-4 rounded-full flex items-center justify-center">
                      <HourMarkers />
                      
                      {/* Digital time display */}
                      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full border border-white/10 text-white text-sm font-mono tabular-nums shadow-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {currentTime}
                        </div>
                      </div>
                      
                      <ClockHands />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* RSVP Section */}
          <motion.div
            className={cn(
              "rounded-2xl p-6",
              "bg-white/10 dark:bg-black/20",
              "backdrop-blur-2xl border border-white/10"
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-wedding-navy flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5 text-wedding-gold" />
                  Will you celebrate with us?
                </h3>
                <div className="flex items-center justify-center gap-2 text-sm text-wedding-navy/60">
                  <MapPin className="w-4 h-4" />
                  <span>Ben Ean, Hunter Valley • Arrive by 2:30 PM</span>
                </div>
              </div>

              {!user ? (
                <Button 
                  onClick={onRSVPClick}
                  className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-navy font-medium"
                >
                  Please Sign In to RSVP
                </Button>
              ) : hasRSVPd ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-wedding-navy">
                    <Heart className="w-4 h-4 text-wedding-gold fill-current" />
                    <span className="font-medium">
                      {rsvpStatus === 'attending' 
                        ? "You're attending! 🎉" 
                        : rsvpStatus === 'not_attending'
                        ? "Thanks for letting us know"
                        : "RSVP status pending"
                      }
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRSVP('attending')}
                      disabled={isSubmitting}
                      variant={rsvpStatus === 'attending' ? 'default' : 'outline'}
                      className={cn(
                        "flex-1",
                        rsvpStatus === 'attending' && "bg-wedding-gold text-wedding-navy"
                      )}
                    >
                      ✓ Attending
                    </Button>
                    <Button
                      onClick={() => handleRSVP('not_attending')}
                      disabled={isSubmitting}
                      variant={rsvpStatus === 'not_attending' ? 'default' : 'outline'}
                      className={cn(
                        "flex-1",
                        rsvpStatus === 'not_attending' && "bg-wedding-navy text-white"
                      )}
                    >
                      Can't Make It
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRSVP('attending')}
                    disabled={isSubmitting}
                    className="flex-1 bg-wedding-gold hover:bg-wedding-gold/90 text-wedding-navy font-medium"
                  >
                    {isSubmitting ? 'Submitting...' : '✓ Yes, I\'ll Be There!'}
                  </Button>
                  <Button
                    onClick={() => handleRSVP('not_attending')}
                    disabled={isSubmitting}
                    variant="outline"
                    className="flex-1 border-wedding-navy/20 text-wedding-navy hover:bg-wedding-navy/5"
                  >
                    {isSubmitting ? 'Submitting...' : 'Can\'t Make It'}
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WeddingCeremonyClock;