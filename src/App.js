import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setEmail('');
        alert('Successfully joined the waitlist!');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // Loader
    const handleLoad = () => {
      setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
          loader.style.transform = 'translateY(-100%)';
          document.body.classList.remove('loading');
        }
      }, 800);
    };

    // Cursor
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (window.matchMedia("(pointer: fine)").matches && cursorDot && cursorRing) {
      let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

      const handleMouseMove = (e) => {
        mouseX = e.clientX; 
        mouseY = e.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      };

      const animateRing = () => {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateRing);
      };

      window.addEventListener('mousemove', handleMouseMove);
      animateRing();

      // Hover interactions
      document.querySelectorAll('a, button, input').forEach(el => {
        el.addEventListener('mouseenter', () => {
          cursorRing.style.width = '40px';
          cursorRing.style.height = '40px';
          cursorRing.style.backgroundColor = 'rgba(204, 255, 0, 0.1)';
          cursorRing.style.borderColor = 'transparent';
        });
        el.addEventListener('mouseleave', () => {
          cursorRing.style.width = '20px';
          cursorRing.style.height = '20px';
          cursorRing.style.backgroundColor = 'transparent';
          cursorRing.style.borderColor = 'rgba(204, 255, 0, 0.5)';
        });
      });
    }

    // Spotlight
    const handleSpotlight = (e) => {
      document.querySelectorAll('.spotlight-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.background = `radial-gradient(800px circle at ${x}px ${y}px, rgba(255,255,255,0.06), #080808 40%)`;
      });
    };

    window.addEventListener('load', handleLoad);
    document.addEventListener('mousemove', handleSpotlight);

    return () => {
      window.removeEventListener('load', handleLoad);
      document.removeEventListener('mousemove', handleSpotlight);
    };
  }, []);

  return (
    <div className="App">
      {/* OVERLAYS */}
      <div className="noise"></div>
      <div className="scanlines"></div>
      <div className="vignette"></div>
      
      {/* CURSOR */}
      <div className="cursor-dot hidden md:block"></div>
      <div className="cursor-ring hidden md:block"></div>

      {/* PRELOADER */}
      <div className="loader" id="loader">
        <div className="flex flex-col items-center gap-4">
          <div className="font-mono text-signal text-xs tracking-[0.5em] uppercase">Initializing</div>
          <div className="w-48 h-[1px] bg-zinc-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-signal w-full origin-left animate-[grow_1.5s_ease-in-out]"></div>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-[#030303] to-transparent">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 border border-zinc-800 bg-zinc-900/50 flex items-center justify-center clip-corner group-hover:border-signal/50 transition-colors">
            <iconify-icon icon="lucide:aperture" className="text-signal text-lg animate-spin-slow"></iconify-icon>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-white tracking-tight leading-none group-hover:text-signal transition-colors">STAY-ON-BRAND</span>
            <span className="font-mono text-[9px] text-zinc-500 tracking-widest uppercase">CTRL. CHECK. POST</span>
          </div>
        </div>
        
        <div className="hidden md:block">
          <div className="flex items-center gap-2 px-3 py-1.5 border border-zinc-800 bg-black/40 backdrop-blur-sm rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal"></span>
            </span>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">Waitlist Open</span>
          </div>
        </div>
      </nav>

      <main>
        {/* HERO / HEADER SECTION */}
        <section className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden pt-20">
          {/* 3D Environment */}
          <div className="grid-floor opacity-40"></div>
          
          <div className="atom">
            <div className="ring w-[600px] h-[600px] opacity-20"></div>
            <div className="ring w-[400px] h-[400px] border-dashed opacity-30 animate-spin-slow" style={{animationDuration: '40s'}}></div>
            <div className="orbit w-[500px] h-[500px] opacity-30" style={{animationDuration: '15s', transform: 'rotateX(70deg)'}}></div>
          </div>

          {/* Content */}
          <div className="relative z-20 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
            
            {/* Main Title */}
            <h1 className="font-display font-bold leading-[0.85] tracking-tighter mb-8 mix-blend-screen perspective-1000">
              <span className="block text-[13vw] md:text-[8vw] hero-title animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)_0.5s_both]">
                BRAND PERFECT
              </span>
              <span className="block text-[13vw] md:text-[8vw] text-white opacity-70 animate-[slideUp_1s_cubic-bezier(0.16,1,0.3,1)_0.6s_both] drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                BUT ARE THEY READABLE?
              </span>
            </h1>

            {/* Subheadline */}
            <p className="font-mono text-xs md:text-sm text-zinc-400 text-center uppercase tracking-widest leading-loose mb-10 max-w-xl mx-auto opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards]">
              Validate your social media posts against your brand color in 30 seconds.<br />
              <span className="text-white">We don't hope it's readable. We prove it.</span>
            </p>

            {/* Waitlist Form */}
            <div className="w-full max-w-md opacity-0 animate-[fadeInUp_0.5s_ease-out_1.2s_forwards]">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-0 md:gap-0 border border-zinc-700 p-1 bg-zinc-900/30 backdrop-blur-md clip-corner group focus-within:border-signal transition-colors duration-300">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-transparent text-white font-mono text-xs px-4 py-4 outline-none placeholder:text-zinc-600 uppercase tracking-wider w-full" 
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-signal text-black font-mono text-xs font-bold uppercase tracking-widest px-8 py-4 md:py-0 hover:bg-white transition-colors btn-glitch flex items-center justify-center gap-2"
                >
                  <span>{isSubmitting ? 'Joining...' : 'Join the waitList'}</span>
                  <iconify-icon icon="lucide:arrow-right"></iconify-icon>
                </button>
              </form>
              <div className="mt-4 flex justify-between items-center px-2">
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">Waitlisted: <span className="text-signal">Revealed Soon</span></span>
                <span className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">LAUNCHING SOON</span>
              </div>
            </div>
          </div>

          {/* Bottom Fade */}
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#030303] to-transparent z-5"></div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 opacity-0 animate-[fadeIn_1s_ease-out_2s_forwards]">
            <div className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => document.getElementById('use-cases').scrollIntoView({behavior: 'smooth'})}>
              <div className="w-6 h-10 border border-zinc-700 rounded-full flex justify-center group-hover:border-signal/50 transition-colors">
                <div className="w-1 h-3 bg-signal rounded-full mt-2 animate-bounce"></div>
              </div>
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest group-hover:text-signal transition-colors">Scroll Down</span>
            </div>
          </div>
        </section>

        {/* USE CASE SECTION */}
        <section id="use-cases" className="py-24 relative bg-void border-t border-zinc-900">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none"></div>

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex items-end justify-between mb-16">
              <div>
                <span className="text-signal font-mono text-xs tracking-widest uppercase mb-2 block">/// Capabilities</span>
                <h2 className="font-display text-4xl md:text-5xl text-white font-medium leading-[0.9]">
                  WHAT YOU GET?<br />
                  <span className="text-zinc-700">THREE STEPS TO ACCESSIBLE POSTS.</span>
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Case 1 */}
              <div className="group relative bg-[#080808] border border-zinc-800 p-8 hover:bg-zinc-900/30 transition-all duration-300 spotlight-card">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-signal/30 transition-colors">
                  <iconify-icon icon="lucide:zap" className="text-xl text-zinc-500 group-hover:text-signal transition-colors"></iconify-icon>
                </div>
                <h3 className="font-display text-xl text-white mb-3">Brand Color Audit</h3>
                <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                  Validate your palette against WCAG 2.1 AA/AAA Standards. Know which combination pass before you design.
                </p>
              </div>

              {/* Case 2 */}
              <div className="group relative bg-[#080808] border border-zinc-800 p-8 hover:bg-zinc-900/30 transition-all duration-300 spotlight-card">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top delay-75"></div>
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-signal/30 transition-colors">
                  <iconify-icon icon="lucide:network" className="text-xl text-zinc-500 group-hover:text-signal transition-colors"></iconify-icon>
                </div>
                <h3 className="font-display text-xl text-white mb-3">Instant Post Validation</h3>
                <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                  Upload social media posts, get results in 30 seconds.
                </p>
              </div>

              {/* Case 3 */}
              <div className="group relative bg-[#080808] border border-zinc-800 p-8 hover:bg-zinc-900/30 transition-all duration-300 spotlight-card">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-signal transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top delay-100"></div>
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 group-hover:border-signal/30 transition-colors">
                  <iconify-icon icon="lucide:fingerprint" className="text-xl text-zinc-500 group-hover:text-signal transition-colors"></iconify-icon>
                </div>
                <h3 className="font-display text-xl text-white mb-3">Smart Compliance Fixes</h3>
                <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                  Don't just find porblems. Fix them. Get brand-safe color swaps that meet accessibility without killing your vibe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-700 bg-zinc-950 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <iconify-icon icon="lucide:aperture" className="text-zinc-400 text-sm"></iconify-icon>
            <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest">© 2026 C3Labs.</span>
          </div>
          
          <div className="flex gap-6 font-mono text-[10px] text-zinc-400 uppercase tracking-widest">
            <a href="https://twitter.com/this_is_mhd" className="hover:text-signal transition-colors">Twitter</a>
            {/* <a href="#" className="hover:text-signal transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-signal transition-colors">Github</a> */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;