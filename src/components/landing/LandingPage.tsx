import React from 'react';
import type { Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { ArrowRight, BookOpen, Clock, Compass, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onBeginSession: () => void;
  lang?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onBeginSession, lang = 'en' }) => {
  const t = getTranslation(lang);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F7F2] dark:bg-[#141412] text-[#171717] dark:text-[#F8F7F2] transition-colors">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-12 pb-20 sm:pt-20 sm:pb-28 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Hero Left: Text & Editorial Typography */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 border-b border-[#D8D6CE] dark:border-[#33322D] pb-1">
              <span className="font-mono text-xs uppercase tracking-widest text-[#77756F] dark:text-[#88867F]">
                {t.eyebrow}
              </span>
            </div>

            <h1 className="font-editorial-heading text-5xl sm:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-tight text-[#171717] dark:text-[#F8F7F2]">
              {t.heroHeadline1}<br />
              {t.heroHeadline2}<br />
              <span className="italic font-light">{t.heroHeadline3}</span>
            </h1>

            <p className="font-editorial-body text-lg sm:text-xl text-[#77756F] dark:text-[#A09E94] max-w-xl font-light leading-relaxed">
              {t.heroSupporting}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBeginSession}
                className="group flex items-center gap-2 px-6 py-3.5 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs"
              >
                <span>{t.beginSession}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="px-6 py-3.5 bg-transparent border border-[#D8D6CE] dark:border-[#33322D] text-[#171717] dark:text-[#F8F7F2] text-xs font-mono uppercase tracking-widest hover:border-[#171717] dark:hover:border-[#F8F7F2] hover:bg-[#F0EFE9] dark:hover:bg-[#1E1E1C] transition-colors"
              >
                {t.howItWorks}
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs font-mono text-[#77756F] dark:text-[#88867F]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
                <span>{t.featureTime}</span>
              </div>
              <div className="h-3 w-[1px] bg-[#D8D6CE] dark:bg-[#33322D]" />
              <div className="flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
                <span>{t.featureAccount}</span>
              </div>
              <div className="h-3 w-[1px] bg-[#D8D6CE] dark:bg-[#33322D]" />
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#171717] dark:text-[#F8F7F2]" />
                <span>{t.featurePrivate}</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Architectural 8-panel Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md p-6 bg-[#FAF9F5] dark:bg-[#1C1C1A] border border-[#171717] dark:border-[#33322D] shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#D8D6CE] dark:border-[#33322D] mb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-[#77756F] dark:text-[#88867F]">
                  {t.sheetLabel}
                </span>
                <span className="font-mono text-[11px] text-[#171717] dark:text-[#F8F7F2]">{t.sheetDuration}</span>
              </div>

              {/* 8-panel hand-drawn architectural mockup */}
              <div className="grid grid-cols-4 gap-2 aspect-[4/2.6] w-full">
                {[
                  { num: '01', type: 'sketch', desc: lang === 'uz' ? 'Ilk tuyg\'u' : 'First instinct' },
                  { num: '02', type: 'text', desc: lang === 'uz' ? 'Teskari mantiq' : 'Inverted logic' },
                  { num: '03', type: 'sketch', desc: lang === 'uz' ? 'Karta' : 'Physical card' },
                  { num: '04', type: 'hybrid', desc: lang === 'uz' ? 'Ovozli imo' : 'Audio gesture' },
                  { num: '05', type: 'sketch', desc: lang === 'uz' ? 'Minimal' : 'Radical minimal' },
                  { num: '06', type: 'text', desc: lang === 'uz' ? 'Ekransiz' : 'No-screen flow' },
                  { num: '07', type: 'sketch', desc: lang === 'uz' ? 'Doira' : 'Social circle' },
                  { num: '08', type: 'sketch', desc: lang === 'uz' ? 'Kutilmagan' : 'Wildcard idea', starred: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className={`relative border flex flex-col justify-between p-1.5 bg-[#F8F7F2] dark:bg-[#252522] transition-transform hover:-translate-y-0.5 ${
                      item.starred
                        ? 'border-[#171717] dark:border-[#F8F7F2] ring-1 ring-[#171717] dark:ring-[#F8F7F2]'
                        : 'border-[#D8D6CE] dark:border-[#33322D]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[9px] font-mono text-[#77756F] dark:text-[#88867F]">
                      <span>{item.num}</span>
                      {item.starred && <span className="text-[#171717] dark:text-[#F8F7F2] font-bold">★</span>}
                    </div>

                    {/* Minimalist illustration lines */}
                    <div className="flex-1 flex items-center justify-center my-1">
                      {item.type === 'sketch' && (
                        <svg viewBox="0 0 40 24" className="w-full h-auto text-[#171717] dark:text-[#F8F7F2] stroke-current fill-none stroke-[1.2]">
                          <rect x="4" y="3" width="32" height="18" rx="1" />
                          <line x1="8" y1="8" x2="22" y2="8" />
                          <circle cx="28" cy="12" r="3" />
                        </svg>
                      )}
                      {item.type === 'text' && (
                        <div className="w-full space-y-1 px-1">
                          <div className="h-0.5 bg-[#171717] dark:bg-[#F8F7F2] w-3/4" />
                          <div className="h-0.5 bg-[#D8D6CE] dark:bg-[#44433E] w-full" />
                          <div className="h-0.5 bg-[#D8D6CE] dark:bg-[#44433E] w-1/2" />
                        </div>
                      )}
                      {item.type === 'hybrid' && (
                        <svg viewBox="0 0 40 24" className="w-full h-auto text-[#171717] dark:text-[#F8F7F2] stroke-current fill-none stroke-[1.2]">
                          <path d="M6 18 Q 14 4, 20 12 T 34 8" />
                          <circle cx="20" cy="12" r="2" fill="currentColor" />
                        </svg>
                      )}
                    </div>

                    <span className="text-[8px] font-mono uppercase text-[#77756F] dark:text-[#88867F] truncate">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-[#D8D6CE] dark:border-[#33322D] flex items-center justify-between text-[10px] font-mono text-[#77756F] dark:text-[#88867F]">
                <span>{t.sheetSub}</span>
                <span className="text-[#171717] dark:text-[#F8F7F2]">{t.crazy8Exercise}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thin line divider */}
      <div className="border-t border-[#D8D6CE] dark:border-[#33322D] max-w-7xl mx-auto w-full" />

      {/* How it Works Section */}
      <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-[#77756F] dark:text-[#88867F]">
            {t.frameworkTitle}
          </span>
          <h2 className="font-editorial-heading text-4xl sm:text-5xl font-normal text-[#171717] dark:text-[#F8F7F2] mt-2">
            {t.frameworkHeading}
          </h2>
          <p className="mt-3 text-base text-[#77756F] dark:text-[#A09E94] max-w-2xl font-light">
            {t.frameworkDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 01 */}
          <div className="border border-[#D8D6CE] dark:border-[#33322D] bg-[#FAF9F5] dark:bg-[#1C1C1A] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#171717] dark:text-[#F8F7F2] pb-2 border-b border-[#D8D6CE] dark:border-[#33322D] inline-block">
                {t.step1Num}
              </span>
              <h3 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2] mt-4 mb-2">
                {t.step1Title}
              </h3>
              <p className="text-sm text-[#77756F] dark:text-[#A09E94] leading-relaxed font-light">
                {t.step1Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D8D6CE] dark:border-[#33322D] text-xs font-mono text-[#77756F] dark:text-[#88867F]">
              {t.step1Duration}
            </div>
          </div>

          {/* Step 02 */}
          <div className="border border-[#171717] dark:border-[#EDECE6] bg-[#FAF9F5] dark:bg-[#1C1C1A] p-8 flex flex-col justify-between ring-1 ring-[#171717] dark:ring-[#EDECE6]">
            <div>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#171717] dark:text-[#F8F7F2] pb-2 border-b border-[#171717] dark:border-[#EDECE6] inline-block">
                {t.step2Num}
              </span>
              <h3 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2] mt-4 mb-2">
                {t.step2Title}
              </h3>
              <p className="text-sm text-[#77756F] dark:text-[#A09E94] leading-relaxed font-light">
                {t.step2Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#171717] dark:border-[#EDECE6] text-xs font-mono text-[#171717] dark:text-[#F8F7F2] font-semibold">
              {t.step2Duration}
            </div>
          </div>

          {/* Step 03 */}
          <div className="border border-[#D8D6CE] dark:border-[#33322D] bg-[#FAF9F5] dark:bg-[#1C1C1A] p-8 flex flex-col justify-between">
            <div>
              <span className="font-mono text-sm font-semibold tracking-wider text-[#171717] dark:text-[#F8F7F2] pb-2 border-b border-[#D8D6CE] dark:border-[#33322D] inline-block">
                {t.step3Num}
              </span>
              <h3 className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2] mt-4 mb-2">
                {t.step3Title}
              </h3>
              <p className="text-sm text-[#77756F] dark:text-[#A09E94] leading-relaxed font-light">
                {t.step3Desc}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D8D6CE] dark:border-[#33322D] text-xs font-mono text-[#77756F] dark:text-[#88867F]">
              {t.step3Duration}
            </div>
          </div>
        </div>
      </section>

      {/* Deep-dive methodology section */}
      <section className="bg-[#F0EFE9] dark:bg-[#1A1A18] border-y border-[#D8D6CE] dark:border-[#33322D] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-[#171717] dark:text-[#F8F7F2]" />
            <h3 className="font-editorial-heading text-3xl font-semibold text-[#171717] dark:text-[#F8F7F2]">
              {t.philosophyHeading}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#77756F] dark:text-[#A09E94] leading-relaxed">
            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] font-bold mb-2">
                {t.phil1Title}
              </h4>
              <p>{t.phil1Desc}</p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] font-bold mb-2">
                {t.phil2Title}
              </h4>
              <p>{t.phil2Desc}</p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] font-bold mb-2">
                {t.phil3Title}
              </h4>
              <p>{t.phil3Desc}</p>
            </div>

            <div>
              <h4 className="font-mono text-xs uppercase tracking-wider text-[#171717] dark:text-[#F8F7F2] font-bold mb-2">
                {t.phil4Title}
              </h4>
              <p>{t.phil4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA Banner */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 max-w-4xl mx-auto text-center space-y-6">
        <h2 className="font-editorial-heading text-4xl sm:text-6xl font-normal text-[#171717] dark:text-[#F8F7F2]">
          {t.closingQuote}
        </h2>

        <p className="text-base sm:text-lg text-[#77756F] dark:text-[#A09E94] font-light max-w-xl mx-auto">
          {t.closingSub}
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onBeginSession}
            className="px-8 py-4 bg-[#171717] text-[#F8F7F2] dark:bg-[#F8F7F2] dark:text-[#171717] text-xs font-mono uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
          >
            <span>{t.startFirstSession}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Minimal Editorial Footer */}
      <footer className="no-print mt-auto border-t border-[#D8D6CE] dark:border-[#33322D] bg-[#FAF9F5] dark:bg-[#1A1A18] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-6">
          <div className="space-y-2">
            <span className="font-editorial-heading text-2xl font-bold text-[#171717] dark:text-[#F8F7F2]">
              {t.brandName}
            </span>
            <p className="text-xs text-[#77756F] dark:text-[#88867F] max-w-md font-light leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          <div className="text-xs font-mono text-[#77756F] dark:text-[#88867F] space-y-1 md:text-right">
            <div>{t.footerPrivate}</div>
            <div>{t.footerCraft}</div>
            <div className="pt-2 text-[11px] text-[#A09E96] dark:text-[#66655E]">{t.copyright}</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
