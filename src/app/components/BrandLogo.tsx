import Image from "next/image";

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo = ({ className = "" }: BrandLogoProps) => {
  return (
    <Image
  src="/aur-logo.jpg"
  alt="Asia University Rankings"
  width={70}
  height={60}
  priority
  className="h-9 w-auto"
 />
  );
};


// import React from 'react';

// interface BrandLogoProps {
//   className?: string;
//   theme?: "light" | "dark";
// }

// export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "", theme = "dark" }) => {
//   const textColor = theme === "dark" ? "text-white" : "text-[#1E3A8A]";
//   const highlightColor = "#A855F7"; // Purple for A, U, R
//   const accentColor = "#FBBF24"; // Yellow for lines and star

//   return (
//     <div className={`flex items-center gap-3 ${className}`}>
//       {/* AR Icon Box */}
//       <div 
//         className="relative flex items-center justify-center rounded-sm overflow-hidden shadow-md shrink-0"
//         style={{ 
//           width: '64px', 
//           height: '56px',
//           background: 'linear-gradient(135deg, #d946ef 0%, #7e22ce 50%, #1e3a8a 100%)' 
//         }}
//       >
//         {/* Star */}
//         <svg className="absolute top-1.5 right-1.5 w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 24 24">
//           <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
//         </svg>

//         {/* AR Letters Custom SVG */}
//         <svg className="w-12 h-12 text-white drop-shadow-md" viewBox="0 0 100 100">
//           {/* A Left Leg */}
//           <polygon fill="currentColor" points="15,85 45,25 55,25 25,85" />
//           {/* A/R Shared Vertical Stem */}
//           <rect fill="currentColor" x="42" y="25" width="10" height="60" />
//           {/* A Crossbar */}
//           <polygon fill="currentColor" points="22,65 45,65 45,53 28,53" />
//           {/* R Loop */}
//           <path fill="currentColor" d="M42,25 h20 c15,0 15,30 0,30 h-20 v-12 h12 c5,0 5,-18 0,-18 h-12 z" />
//           {/* R Right Leg */}
//           <polygon fill="currentColor" points="52,50 64,50 82,85 70,85" />
//         </svg>
//       </div>

//       {/* Vertical divider */}
//       <div className="w-1 h-14 bg-yellow-400 rounded-sm shrink-0" />

//       {/* Text Area */}
//       <div className="flex flex-col leading-none font-bold tracking-[0.15em] font-sans uppercase shrink-0 pt-1">
//         <div className={`flex items-center text-lg ${textColor}`}>
//           <span style={{ color: highlightColor }}>A</span>SIA
//         </div>
//         <div className={`flex items-center text-lg mt-[3px] ${textColor}`}>
//           <span style={{ color: highlightColor }}>U</span>NIVERSITY
//         </div>
//         <div className={`flex items-center text-lg mt-[3px] ${textColor}`}>
//           <span style={{ color: highlightColor }}>R</span>ANKINGS
          
//           {/* Hamburger-like lines next to RANKINGS */}
//           <div className="flex flex-col gap-[3px] ml-2 mt-0.5">
//             <div className="w-5 h-[2px] bg-yellow-400 rounded-full" />
//             <div className="w-5 h-[2px] bg-yellow-400 rounded-full" />
//             <div className="w-5 h-[2px] bg-yellow-400 rounded-full" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
