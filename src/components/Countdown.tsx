import React, { useState, useEffect } from 'react';

export const Countdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Launch set to 30 days from now for demo
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });

      if (difference < 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const Item: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center">
      <span className="text-3xl md:text-5xl font-display font-extrabold tracking-tighter neon-text">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">{label}</span>
    </div>
  );

  return (
    <div className="flex gap-6 md:gap-10">
      <Item value={timeLeft.days} label="Days" />
      <Item value={timeLeft.hours} label="Hours" />
      <Item value={timeLeft.minutes} label="Mins" />
      <Item value={timeLeft.seconds} label="Secs" />
    </div>
  );
};
