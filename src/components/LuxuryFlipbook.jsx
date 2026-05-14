import React, { useRef, useState, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ✅ Pages
const pages = [
  "/images/page1.jpg",
  "/images/page2.jpg",
  "/images/page3.jpg",
  "/images/page4.jpg",
  "/images/page5.jpg",
  "/images/page6.jpg",
  "/images/page7.jpg",
  "/images/page8.jpg",
  "/images/page9.jpg",
  "/images/page10.jpg",
  "/images/page11.jpg",
  "/images/page12.jpg",
];

// ✅ PAGE COMPONENT (REALISTIC)
const Page = React.forwardRef(({ image }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-full h-full flex items-center justify-center bg-[#f8f8f8] overflow-hidden"
      style={{
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.08)",
      }}
    >
      {/* 📄 Paper texture */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]" />

      {/* ✅ Actual Image */}
      <img
        src={image}
        alt="page"
        className="w-full h-full object-contain"
        draggable={false}
      />

      {/* ✨ Lighting overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/20 pointer-events-none" />

      {/* Shadow edges */}
      <div className="absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-black/10 to-transparent" />
      <div className="absolute right-0 top-0 h-full w-5 bg-gradient-to-l from-black/10 to-transparent" />
    </div>
  );
});

export default function LuxuryFlipbook() {
  const bookRef = useRef();

  const [opened, setOpened] = useState(false);
  const [page, setPage] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });
  const [isMobile, setIsMobile] = useState(false);

  // ✅ Responsive
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Opening delay
  useEffect(() => {
    setTimeout(() => setOpened(true), 1600);
  }, []);

  // ✅ Mouse tracking (lighting)
  const handleMouseMove = (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    setMouse({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative h-screen w-screen bg-black flex flex-col items-center justify-center overflow-hidden"
    >

      {/* 🔥 DYNAMIC LIGHT FOLLOW */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(
            circle at ${mouse.x * 100}% ${mouse.y * 100}%,
            rgba(255,255,255,0.12),
            transparent 40%
          )`,
        }}
      />

      {/* ✨ CLOSED BOOK */}
      {!opened && (
        <motion.div
          className="relative w-[320px] h-[460px]"
          initial={{ rotateY: -60, scale: 0.85 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ duration: 1.4 }}
        >
          <img
            src={pages[0]}
            alt="cover"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
          />

          {/* spine */}
          <div className="absolute left-[-5px] top-0 h-full w-[5px] bg-neutral-700 rounded-l"></div>
        </motion.div>
      )}

      {/* ✅ FLIPBOOK */}
      {opened && (
        <>
          <motion.div
            className="relative flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >

            {/* 📚 FAKE PAGE THICKNESS */}
            <div className="absolute left-2 top-2 w-full h-full bg-black/20 blur-md rounded-lg"></div>
            <div className="absolute left-1 top-1 w-full h-full bg-black/10 blur-sm rounded-lg"></div>

            <HTMLFlipBook
              width={isMobile ? 300 : 420}
              height={isMobile ? 420 : 560}
              size="fixed"
              showCover={true}
              usePortrait={isMobile}
              drawShadow={true}
              flippingTime={700}
              mobileScrollSupport={false}
              onFlip={(e) => setPage(e.data)}
              className="shadow-[0_40px_120px_rgba(0,0,0,0.9)] rounded-lg"
              ref={bookRef}
            >
              {pages.map((p, i) => (
                <Page key={i} image={p} />
              ))}
            </HTMLFlipBook>

            {/* NAV */}
            {!isMobile && (
              <>
                <button
                  onClick={() => bookRef.current.pageFlip().flipPrev()}
                  className="absolute left-[-70px] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={() => bookRef.current.pageFlip().flipNext()}
                  className="absolute right-[-70px] p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </motion.div>

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500">
              Keetronics Catalogue
            </p>
            <p className="text-sm text-neutral-400">
              Page {page + 1} / {pages.length}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
