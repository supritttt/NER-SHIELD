import React, { useEffect, useState } from 'react';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  durationMs?: number;
  suffix?: string;
  prefix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  durationMs = 1200,
  suffix = '',
  prefix = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const initial = displayValue;
    const diff = value - initial;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = initial + diff * ease;
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(value);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value, durationMs]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })}
      {suffix}
    </span>
  );
};
