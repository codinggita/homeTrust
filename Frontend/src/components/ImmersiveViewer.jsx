import { useState } from "react";
import { Maximize2, Move, Rotate3D } from "lucide-react";

export default function ImmersiveViewer({ imageColor = "#0b1f3a" }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border shadow-sm transition-all duration-500 ${isExpanded ? "h-[600px]" : "h-64"}`} style={{ background: `linear-gradient(135deg, ${imageColor}22 0%, #0b1f3a22 100%)` }}>
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Mocking a 3D panorama wrapper */}
        <div className="w-[120%] h-[120%] cursor-move opacity-70 animate-[pan_30s_linear_infinite]" style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(11,31,58,0.05) 10px, rgba(11,31,58,0.05) 20px)",
          backgroundSize: "200% 200%",
        }} />
      </div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <Rotate3D className="h-12 w-12 text-navy opacity-30 mb-2" />
        <p className="font-semibold text-navy/70">Drag to pan 360° view</p>
      </div>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/80 text-navy backdrop-blur-md hover:bg-white shadow-sm" title="Move">
          <Move className="h-4 w-4" />
        </button>
        <button onClick={() => setIsExpanded(!isExpanded)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy text-white hover:bg-navy/90 shadow-sm" title="Expand">
          <Maximize2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="absolute top-4 left-4 bg-navy text-gold text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Virtual Tour
      </div>

      <style jsx>{`
        @keyframes pan {
          0% { background-position: 0 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
