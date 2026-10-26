import React from 'react';
import { ArrowRight, BookOpen, Clock, Compass, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onBeginSession: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBeginSession }) => {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F2]">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left: Text & Editorial Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border-b border-[#D8D6CE] pb-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#77756F]">
                Design Thinking / Creative Practice
              </span>
            </div>

            <h1 className="font-editorial-heading text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight text-[#171717]">
              Eight ideas.<br />
              Eight minutes.<br />
              <span className="italic font-light">No overthinking.</span>
            </h1>

            <p className="font-editorial-body text-lg sm:text-xl text-[#77756F] max-w-xl font-light leading-relaxed">
              A simple exercise to get beyond your first idea. Sketch eight different possibilities, follow your curiosity, and discover something unexpected.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBeginSession}
                className="group flex items-center gap-2 px-6 py-3.5 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-all shadow-xs"
              >
                <span>Begin a session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="px-6 py-3.5 bg-transparent border border-[#D8D6CE] text-[#171717] text-xs font-mono uppercase tracking-widest hover:border-[#171717] hover:bg-[#F0EFE9] transition-colors"
              >
                How it works
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#77756F]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#171717]" />
                <span>60s per concept</span>
              </div>
              <div className="h-3 w-[1px] bg-[#D8D6CE]" />
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#171717]" />
                <span>Zero account required</span>
              </div>
              <div className="h-3 w-[1px] bg-[#D8D6CE]" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#171717]" />
                <span>Local & private</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Architectural 8-panel Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-[#FAF9F5] border border-[#171717] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D6CE] mb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#77756F]">
                  Sheet 01 — Divergent Grid
                </span>
                <span className="font-mono text-[11px] text-[#171717]">8.00 MIN</span>
              </div>

              {/* 8-panel hand-drawn architectural mockup */}
              <div className="grid grid-cols-4 gap-2 aspect-[4/2.6] w-full">
                {[
                  { num: '01', type: 'sketch', desc: 'First instinct' },
                  { num: '02', type: 'text', desc: 'Inverted logic' },
                  { num: '03', type: 'sketch', desc: 'Physical card' },
                  { num: '04', type: 'hybrid', desc: 'Audio gesture' },
                  { num: '05', type: 'sketch', desc: 'Radical minimal' },
                  { num: '06', type: 'text', desc: 'No-screen flow' },
                  { num: '07', type: 'sketch', desc: 'Social circle' },
                  { num: '08', type: 'sketch', desc: 'Wildcard idea', starred: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`relative border flex flex-col justify-between p-1.5 bg-[#F8F7F2] transition-transform hover:-translate-y-0.5 ${
                      item.starred ? 'border-[#171717] ring-1 ring-[#171717]' : 'border-[#D8D6CE]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#77756F]">
                      <span>{item.num}</span>
                      {item.starred && <span className="text-[#171717] font-bold">★</span>}
                    </div>

                    {/* Minimalist illustration lines */}
                    <div className="flex-1 flex items-center justify-center my-1">
                      {item.type === 'sketch' && (
                        <svg viewBox="0 0 40 24" className="w-full h-auto text-[#171717] stroke-current fill-none stroke-[1.2]">
                          <rect x="4" y="3" width="32" height="18" rx="1" />
                          <line x1="8" y1="8" x2="22" y2="8" />
                          <circle cx="28" cy="12" r="3" />
                        </svg>
                      )}
                      {item.type === 'text' && (
                        <div className="w-full space-y-1 px-1">
                          <div className="h-0.5 bg-[#171717] w-3/4" />
                          <div className="h-0.5 bg-[#D8D6CE] w-full" />
                          <div className="h-0.5 bg-[#D8D6CE] w-1/2" />
                        </div>
                      )}
                      {item.type === 'hybrid' && (
                        <svg viewBox="0 0 40 24" className="w-full h-auto text-[#171717] stroke-current fill-none stroke-[1.2]">
                          <path d="M6 18 Q 14 4, 20 12 T 34 8" />
                          <circle cx="20" cy="12" r="2" fill="#171717" />
                        </svg>
                      )}
                    </div>

                    <span className="text-[8px] font-mono uppercase text-[#77756F] truncate">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8D6CE] flex items-center justify-between text-[10px] font-mono text-[#77756F]">
                <span>A4 Landscape Folded 8x</span>
                <span className="text-[#171717]">Crazy 8s Exercise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin line divider */}
      <div className="border-t border-[#D8D6CE] max-w-7xl mx-auto w-full" />

      {/* How it Works Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#77756F]">
            The Methodical Framework
          </span>
          <h2 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717] mt-2">
            How Crazy 8s Works
          </h2>
          <p className="mt-3 text-base text-[#77756F] max-w-2xl font-light">
            Originally created as a core sprint exercise at Google Ventures and Stanford d.school, Crazy 8s is a fast-paced sketching exercise that forces divergent thinking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 */}
          <div className="border border-[#D8D6CE] bg-[#FAF9F5] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#171717] pb-2 border-b border-[#D8D6CE] inline-block">
                01 — DEFINE
              </span>
              <h3 className="font-editorial-heading text-2xl font-bold text-[#171717] mt-4 mb-2">
                Frame the challenge
              </h3>
              <p className="text-sm text-[#77756F] leading-relaxed font-light">
                Write down the exact question or challenge you want to solve. Clear, generative prompts like "How might we..." provide fertile ground for unexpected angles.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D8D6CE] text-xs font-mono text-[#77756F]">
              Step duration: 1–2 minutes
            </div>
          </div>

          {/* Step 02 */}
          <div className="border border-[#171717] bg-[#FAF9F5] p-8 flex flex-col justify-between ring-1 ring-[#171717]">
            <div>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#171717] pb-2 border-b border-[#171717] inline-block">
                02 — DIVERGE
              </span>
              <h3 className="font-editorial-heading text-2xl font-bold text-[#171717] mt-4 mb-2">
                Eight ideas in eight minutes
              </h3>
              <p className="text-sm text-[#77756F] leading-relaxed font-light">
                Divide your page into eight sections and sketch or describe a distinct idea in each one. Spend approximately one minute per idea. Do not polish — just get the thought out of your head.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#171717] text-xs font-mono text-[#171717] font-semibold">
              Step duration: 8 minutes (strict)
            </div>
          </div>

          {/* Step 03 */}
          <div className="border border-[#D8D6CE] bg-[#FAF9F5] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#171717] pb-2 border-b border-[#D8D6CE] inline-block">
                03 — REFLECT
              </span>
              <h3 className="font-editorial-heading text-2xl font-bold text-[#171717] mt-4 mb-2">
                Evaluate & select
              </h3>
              <p className="text-sm text-[#77756F] leading-relaxed font-light">
                Review your concepts, identify promising directions, star your top three favorites, and export your session as a clean architectural worksheet or PDF.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D8D6CE] text-xs font-mono text-[#77756F]">
              Step duration: 3–5 minutes
            </div>
          </div>
        </div>
      </section>

      {/* Deep-dive methodology section */}
      <section className="bg-[#F0EFE9] border-y border-[#D8D6CE] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#171717]" />
            <h3 className="font-editorial-heading text-3xl font-semibold text-[#171717]">
              The Philosophy Behind the Rapid Constraint
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#77756F] leading-relaxed">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] font-bold mb-2">
                1. Breaking past the obvious
              </h4>
              <p>
                Most creators stop after their first good idea. Usually, ideas 1 and 2 are the most familiar and conventional solutions. Ideas 4 through 8 force the brain to explore novel connections, invert assumptions, and innovate.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] font-bold mb-2">
                2. Rough beats beautiful
              </h4>
              <p>
                Crazy 8s is not an illustration contest. Stick figures, boxes, quick arrows, and 3-word titles are not just accepted — they are encouraged. Speed prevents perfectionism and self-censorship.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] font-bold mb-2">
                3. Sketch or write seamlessly
              </h4>
              <p>
                Not everyone thinks in drawings. EIGHT provides equal first-class support for sketching, writing, and structured bullet lists, allowing you to switch modalities without losing your flow.
              </p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] font-bold mb-2">
                4. Preserved and archivable
              </h4>
              <p>
                Every stroke and word is saved locally in your browser's private database. You can export complete high-res printable sheets, vector-grade PDFs, or JSON backups at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="font-editorial-heading text-4xl sm:text-6xl font-normal text-[#171717]">
          "Your first idea is only the beginning."
        </h2>

        <p className="text-base sm:text-lg text-[#77756F] font-light max-w-xl mx-auto">
          Give yourself eight uninterrupted minutes. See where your curiosity takes you.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onBeginSession}
            className="px-8 py-4 bg-[#171717] text-[#F8F7F2] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
          >
            <span>Start your first session</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <footer className="no-print mt-auto border-t border-[#D8D6CE] bg-[#FAF9F5] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div className="space-y-2">
            <span className="font-editorial-heading text-2xl font-bold text-[#171717]">
              EIGHT
            </span>
            <p className="text-xs text-[#77756F] max-w-md font-light leading-relaxed">
              A minimalist creative tool designed for rapid divergent brainstorming. Built with love for designers, writers, architects, and thinkers.
            </p>
          </div>

          <div className="text-xs font-mono text-[#77756F] space-y-1 md:text-right">
            <div>All data stays private in your browser.</div>
            <div>Designed with warm paper, deep ink, and classic typography.</div>
            <div className="pt-2 text-[11px] text-[#A09E96]">© EIGHT Brainstorming. Crafted for thoughtful work.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
