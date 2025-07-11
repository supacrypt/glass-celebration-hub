import React, { useState, useEffect } from 'react';

interface CountdownProps {
  targetDate: string;
}

interface TimeState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeState, setTimeState] = useState<TimeState | null>(null);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
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
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeState === null) {
    return null; // Or a loading spinner
  }

  if (timeState.isPast) {
    return <div className="text-center text-xl font-bold text-wedding-gold">We're Married!</div>;
  }

  const timeParts = [
    { label: 'Days', value: timeState.days },
    { label: 'Hours', value: timeState.hours },
    { label: 'Minutes', value: timeState.minutes },
    { label: 'Seconds', value: timeState.seconds },
  ];

  return (
    <div className="flex justify-center items-center space-x-4 sm:space-x-8 my-4">
      {timeParts.map((part, index) => (
        <div key={part.label} className="flex items-center">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-black tabular-nums" style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.8), 1px 1px 2px rgba(255, 255, 255, 0.6)' }}>
              {part.value.toString().padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-glass-blue">
              {part.label}
            </div>
          </div>
          {index < timeParts.length - 1 && (
            <div className="text-3xl sm:text-4xl font-bold text-black mx-2 sm:mx-4 opacity-50" style={{ textShadow: '0 0 5px rgba(255, 255, 255, 0.8), 1px 1px 2px rgba(255, 255, 255, 0.6)' }}>:</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Countdown;
