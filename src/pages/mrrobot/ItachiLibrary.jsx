'use client';
 
import React, { useEffect, useState } from "react";
 
export default function ItachiLibrary() {
  const [books, setBooks] = useState([]);
 
  useEffect(() => {
    setBooks([
      {
        title: "12 życiowych zasad — Antidotum na chaos",
        author: "Jordan B. Peterson",
        pdf: "/ksiazki/12 życiowych zasad- Antidotum na chaos -- Jordan B. Peterson -- ( WeLib.org ).pdf",
      },
      {
        title: "Advanced Security Testing with Kali Linux",
        author: "Daniel Dieterle",
        pdf: "/ksiazki/_OceanofPDF.com_Advanced_Security_Testing_with_Kali_Linux_-_Daniel_Dieterle.pdf",
      },
      {
        title: "Kali Linux Penetration Testing Bible",
        author: "Gus Khawaja",
        pdf: "/ksiazki/AnyConv.com__Kali Linux Penetration Testing Bible -- Gus Khawaja -- ( WeLib.org ).pdf",
      },
    ]);
  }, []);
 
  const openPDF = (pdf) => {
    window.open(pdf, "_blank");
  };
 
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Header z obrazem Itachi */}
      <div className="relative w-full py-12 md:py-20 flex flex-col items-center justify-center">
        {/* Gradient overlay */}
 
        {/* Obraz Itachi - możesz dodać prawdziwy obraz */}
        
 
        {/* Tytuł biblioteki */}
        <h1 className="relative z-10 text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-4 px-4">
          <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
            Itachi Uchiha edit
          </span>
        </h1>
 
        <p className="relative z-10 text-gray-400 text-sm md:text-base text-center px-4 max-w-2xl">
          Biblioteka wiedzy i mocy
        </p>
 
        {/* Sharingan pattern */}
       
      </div>
 
      {/* Grid książek */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {books.map((book, index) => (
            <div
              key={index}
              className="group relative bg-gradient-to-br from-gray-900 to-black border border-red-900/30 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-900/50"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/0 via-red-600/0 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
 
              {/* Card content */}
              <div className="relative p-6 md:p-8">
                {/* Sharingan corner decoration */}
 
                {/* Book number */}
                <div className="absolute top-4 left-4 w-10 h-10 bg-red-900/30 rounded-full flex items-center justify-center text-red-500 font-bold text-sm border border-red-700/50">
                  {index + 1}
                </div>
 
                {/* Title */}
                <h2 className="text-xl md:text-2xl font-bold mb-3 mt-8 text-red-100 group-hover:text-white transition-colors line-clamp-2">
                  {book.title}
                </h2>
 
                {/* Author */}
                <p className="text-gray-400 text-sm md:text-base mb-6 group-hover:text-gray-300 transition-colors">
                  {book.author}
                </p>
 
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-red-800 to-transparent mb-6"></div>
 
                {/* Button */}
                <button
                  onClick={() => openPDF(book.pdf)}
                  className="w-full py-3 px-6 bg-gradient-to-r from-red-900 to-red-700 hover:from-red-800 hover:to-red-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-red-900/50 hover:shadow-red-800/70"
                >
                  Otwórz książkę w przeglądarce
                </button>
 
                {/* Corner accent */}
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-red-900/20 to-transparent pointer-events-none"></div>
              </div>
 
              {/* Animated border on hover */}
              <div className="absolute inset-0 border-2 border-red-600/0 group-hover:border-red-600/50 rounded-xl transition-all duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
 
        {/* Footer citation */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm md:text-base italic">
            "Ci, którzy wybaczają sobie wszystko i nie uznają własnych wad, nazywani są głupcami."
          </p>
          <p className="text-red-700 text-xs md:text-sm mt-2">— Itachi Uchiha</p>
        </div>
      </div>
 
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-600/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
