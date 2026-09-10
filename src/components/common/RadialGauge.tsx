import React from 'react';

interface RadialGaugeProps {
  score: number; // 0 - 100
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const RadialGauge: React.FC<RadialGaugeProps> = ({
  score,
  size = 90,
  strokeWidth = 8,
  showLabel = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // Emerald for > 80
  let glowColor = 'rgba(16, 185, 129, 0.4)';

  if (score < 50) {
    strokeColor = '#f43f5e'; // Rose for severe
    glowColor = 'rgba(244, 63, 94, 0.4)';
  } else if (score < 75) {
    strokeColor = '#f59e0b'; // Amber for caution
    glowColor = 'rgba(245, 158, 11, 0.4)';
  }

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#10141f"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          style={{
            filter: `drop-shadow(0 0 6px ${glowColor})`,
            transition: 'stroke-dashoffset 1s ease-in-out'
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-base font-bold font-mono tracking-tight text-white">
            {Math.round(score)}%
          </span>
          <span className="text-[9px] uppercase tracking-wider text-slate-400 -mt-0.5">
            Access
          </span>
        </div>
      )}
    </div>
  );
};
