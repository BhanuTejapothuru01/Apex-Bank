import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveIndianClock() {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();

        // 1. Time Format: 10:45:30 AM IST
        const timeOptions: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        };
        const formatterTime = new Intl.DateTimeFormat('en-US', timeOptions);
        const formattedParts = formatterTime.formatToParts(now);
        
        let hour = '';
        let minute = '';
        let second = '';
        let dayPeriod = 'AM';
        
        formattedParts.forEach(part => {
          if (part.type === 'hour') hour = part.value;
          else if (part.type === 'minute') minute = part.value;
          else if (part.type === 'second') second = part.value;
          else if (part.type === 'dayPeriod') {
            dayPeriod = part.value.toUpperCase();
          }
        });

        // 2. Date Format: Friday, 12 June 2026
        const dateOptions: Intl.DateTimeFormatOptions = {
          timeZone: 'Asia/Kolkata',
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        };
        const formatterDate = new Intl.DateTimeFormat('en-US', dateOptions);
        const dateParts = formatterDate.formatToParts(now);
        
        let weekday = '';
        let day = '';
        let month = '';
        let year = '';
        
        dateParts.forEach(part => {
          if (part.type === 'weekday') weekday = part.value;
          else if (part.type === 'day') day = part.value;
          else if (part.type === 'month') month = part.value;
          else if (part.type === 'year') year = part.value;
        });

        setDateStr(`${weekday}, ${day} ${month} ${year}`);
        setTimeStr(`${hour}:${minute}:${second} ${dayPeriod} IST`);
      } catch (err) {
        // Fallback calculation using custom timezone offset when Asia/Kolkata cannot be resolved
        console.error("Timezone detection/resolution failed. Defaulitng to standard custom offset calculation.", err);
        const now = new Date();
        const localOffset = now.getTimezoneOffset(); // e.g. -330
        const istOffset = 330; // UTC+5.5 in minutes
        const totalOffsetMs = (istOffset + localOffset) * 60 * 1000;
        const istNow = new Date(now.getTime() + totalOffsetMs);
        
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        const weekday = days[istNow.getUTCDay()];
        const day = istNow.getUTCDate();
        const month = months[istNow.getUTCMonth()];
        const year = istNow.getUTCFullYear();
        
        let hours = istNow.getUTCHours();
        const minutes = String(istNow.getUTCMinutes()).padStart(2, '0');
        const seconds = String(istNow.getUTCSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 0 becomes 12
        const hourStr = String(hours).padStart(2, '0');

        setDateStr(`${weekday}, ${day} ${month} ${year}`);
        setTimeStr(`${hourStr}:${minutes}:${seconds} ${ampm} IST`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      id="live-indian-clock" 
      className="flex flex-col items-center xs:items-end justify-center px-4 py-2 border border-[rgba(255,94,207,0.35)] bg-gradient-to-br from-[#FF70D9] via-[#E86CFF] to-[#D778FF] rounded-[20px] shadow-[0_8px_30px_rgba(255,94,207,0.25)] hover:shadow-[0_12px_35px_rgba(255,94,207,0.4)] hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-[20px] group select-none min-w-[130px] sm:min-w-[170px] cursor-pointer"
    >
      <div className="flex items-center gap-1.5">
        <Clock size={13} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.65)] animate-[pulse_2s_infinite] group-hover:scale-110 transition-transform duration-300" />
        <span className="text-xs sm:text-sm font-mono text-[#4A044E] tracking-[1px] font-bold">
          {timeStr || '12:00:00 AM IST'}
        </span>
      </div>
      <span className="text-[9px] sm:text-[10px] text-white/85 font-semibold tracking-wide mt-0.5 whitespace-nowrap">
        {dateStr || 'Friday, 12 June 2026'}
      </span>
    </div>
  );
}
