import { motion } from 'motion/react';

interface BrandLogoProps {
  size?: number;
  className?: string;
}

export default function BrandLogo({ size, className = "" }: BrandLogoProps) {
  // If size is not provided, we should probably handle responsiveness outside or pass different sizes
  // But the user specified 56, 48, 40 based on screen size.
  // We can use tailwind classes for responsiveness if size is not passed as a prop.
  
  const sizeClasses = size ? "" : "w-10 h-10 tablet:w-12 tablet:h-12 desktop:w-14 desktop:h-14";
  const inlineStyle = size ? { width: size, height: size } : {};

  return (
    <motion.div
      whileHover={{ scale: 1.08, rotate: 5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`relative flex items-center justify-center bg-white border-2 border-white/80 shadow-2xl overflow-hidden cursor-pointer rounded-full transition-all group ${sizeClasses} ${className}`}
      style={inlineStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      <img 
        src="/input_file_1.png" 
        alt="Apex Bank Logo" 
        className="w-[85%] h-[85%] object-contain"
        referrerPolicy="no-referrer"
      />
    </motion.div>
  );
}
