// 'use client';

// import { useEffect, useState } from 'react';
// import { Loader2 } from 'lucide-react';

// export default function NavigationLoader() {
//   const [loading, setLoading] = useState(false);
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setProgress(prev => {
//           if (prev >= 90) return prev;
//           return prev + 10;
//         });
//       }, 100);
//       return () => clearInterval(interval);
//     } else {
//       setProgress(0);
//     }
//   }, [loading]);

//   useEffect(() => {
//     const handleClick = (e) => {
//       const target = e.target;
//       const link = target.closest('a');
      
//       if (link && link.href && !link.href.startsWith('#') && !link.target) {
//         const url = new URL(link.href);
//         const currentUrl = new URL(window.location.href);
        
//         if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
//           setLoading(true);
//         }
//       }
//     };

//     document.addEventListener('click', handleClick);
//     return () => document.removeEventListener('click', handleClick);
//   }, []);

//   if (!loading) return null;

//   return (
//     <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
//       {/* Simple dot pattern background */}
//       <div className="absolute inset-0 opacity-5" style={{
//         backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
//         backgroundSize: '50px 50px'
//       }} />
      
//       {/* Main loader container */}
//       <div className="relative z-10 flex flex-col items-center gap-8">
//         {/* Spinning loader with icon */}
//         <div className="relative">
//           <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
//         </div>
        
//         {/* Text and progress */}
//         <div className="flex flex-col items-center gap-4">
//           <div className="text-center">
//             <div className="text-white font-semibold text-xl mb-1">LeaderLab</div>
//             <p className="text-gray-400 text-sm">Loading your experience...</p>
//           </div>
          
//           {/* Progress bar */}
//           <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
//             <div 
//               className="h-full bg-blue-500 rounded-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }