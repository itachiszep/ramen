import Navbar from "@/components/Navbar";
import Image from "next/image";
export default function Home() {
const videos = [
  "D_Vg4uyYwEk",
"fvFuGq-1Z8M",
"7u9JDhwJXTc", 
"ZtLlfdyDySY",     
"pLnGByBsFqE",  
"BsblgcBB17A",    
"y4-in1XbVEc",     
"kt04TZi72P0",     
"0X-bcrwmEBc",     
"h3Nqbx7mbAo",     
"1eiFc8g1VXI",    
"H0NCRHpKuO0",
"wtHrDSR6100",
"iB6gWXG8zwo",
"H4BXkyj9dJE",
"yHFfpqgHld4",
"82InbtYxdJY",
"HWmqLXP1-o0"
  ];
return (
<div className="bg-black text-white box-border m-0 p-0">
<div className="w-full bg-black flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 pt-20 md:pt-24 text-center">
{/* Obraz */}
{/* Iframy jedno pod drugim */}
<div className="w-full flex flex-col items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-4xl">
{videos.map((videoId, index) => (
<div 
key={index}
className="w-full aspect-video rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
>
<iframe 
className="w-full h-full"
src={`https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=0`}
title={`YouTube video ${index + 1}`}
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
allowFullScreen
></iframe>
</div>
          ))}
</div>
</div>
</div>
  );
}