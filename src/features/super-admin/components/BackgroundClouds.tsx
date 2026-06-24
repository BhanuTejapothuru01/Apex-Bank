import React from 'react';
import { motion } from 'motion/react';

interface CloudProps {
  size?: number;
  top?: string;
  duration?: number;
  delay?: number;
  opacity?: number;
  direction?: 'ltr' | 'rtl';
  color?: string;
  secondaryColor?: string;
}

const Cloud: React.FC<CloudProps> = ({ 
  size = 300, 
  top = '10%', 
  duration = 60, 
  delay = 0,
  opacity = 0.15,
  direction = 'ltr',
  color = '#FDE2E7',
  secondaryColor = '#FFF1F5'
}) => {
  const isLtr = direction === 'ltr';
  
  return (
    <motion.div
      initial={{ 
        x: isLtr ? '-40vw' : '140vw', 
        y: 0,
        opacity: 0 
      }}
      animate={{ 
        x: isLtr ? ['-40vw', '140vw'] : ['140vw', '-40vw'],
        y: [0, -60, 40, 0],
        opacity: [0, opacity, opacity, 0],
      }}
      transition={{ 
        x: {
          duration, 
          repeat: Infinity, 
          delay,
          ease: "linear" 
        },
        y: {
          duration: duration * 0.4,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: {
          duration,
          repeat: Infinity,
          delay,
          ease: "linear"
        }
      }}
      className="absolute pointer-events-none select-none"
      style={{ 
        top, 
        width: size, 
        height: size * 0.8,
        zIndex: 0
      }}
    >
      {/* Primary fluffy body */}
      <div 
        className="absolute inset-0 blur-[100px] rounded-full"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, ${color} 0%, transparent 70%)`,
        }}
      />
      {/* Secondary highlight for depth */}
      <div 
        className="absolute inset-0 blur-[80px] rounded-full scale-75 translate-x-10 -translate-y-5"
        style={{ 
          background: `radial-gradient(circle at 70% 70%, ${secondaryColor} 0%, transparent 60%)`,
        }}
      />
      {/* Ambient soft core */}
      <div 
        className="absolute inset-0 blur-[120px] rounded-full scale-125 opacity-50"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 80%)`,
        }}
      />
    </motion.div>
  );
};

export const BackgroundClouds: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* 
        Requested Colors:
        Pale Pink (#FDE2E7)
        Blush Pink (#F8D7E3)
        Soft Rose (#FBCFE8)
        Light Cotton Pink (#FFF1F5)
      */}

      {/* TOP LEFT CLUSTER - Dynamic interaction areas */}
      <Cloud size={800} top="-15%" direction="ltr" duration={100} opacity={0.16} color="#FDE2E7" secondaryColor="#FFF1F5" />
      <Cloud size={550} top="0%" direction="ltr" duration={85} delay={15} opacity={0.12} color="#F8D7E3" secondaryColor="#FDE2E7" />
      <Cloud size={450} top="10%" direction="ltr" duration={70} delay={8} opacity={0.10} color="#FFF1F5" secondaryColor="#FBCFE8" />
      
      {/* BOTTOM RIGHT CLUSTER - Visual anchor point */}
      <Cloud size={900} top="60%" direction="rtl" duration={110} opacity={0.18} color="#FBCFE8" secondaryColor="#F8D7E3" />
      <Cloud size={650} top="70%" direction="rtl" duration={95} delay={20} opacity={0.14} color="#FDE2E7" secondaryColor="#FFF1F5" />
      <Cloud size={500} top="50%" direction="rtl" duration={75} delay={5} opacity={0.11} color="#F8D7E3" secondaryColor="#FDE2E7" />

      {/* FLOATING MIDDLE CLOUDS - Ambient atmosphere */}
      <Cloud size={400} top="25%" direction="ltr" duration={150} delay={30} opacity={0.07} color="#FFF1F5" secondaryColor="#FDE2E7" />
      <Cloud size={450} top="45%" direction="rtl" duration={130} delay={50} opacity={0.06} color="#FDE2E7" secondaryColor="#FBCFE8" />
      <Cloud size={350} top="15%" direction="ltr" duration={140} delay={40} opacity={0.08} color="#FBCFE8" secondaryColor="#F8D7E3" />
      <Cloud size={420} top="80%" direction="ltr" duration={160} delay={12} opacity={0.09} color="#F8D7E3" secondaryColor="#FFF1F5" />

      {/* Deep foundation glows for glassmorphism */}
      <div className="absolute top-[-25%] left-[-20%] w-[80%] h-[80%] bg-[#FDE2E7]/6 blur-[200px] rounded-full" />
      <div className="absolute bottom-[-25%] right-[-20%] w-[80%] h-[80%] bg-[#FBCFE8]/6 blur-[200px] rounded-full" />
      <div className="absolute top-[35%] right-[15%] w-[50%] h-[50%] bg-[#FFF1F5]/3 blur-[160px] rounded-full" />
      
      {/* Subtle grain/noise texture overlay to prevent banding in high blur (optional, but adds "premium" feel) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  );
};
