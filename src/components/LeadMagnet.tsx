'use client';

const DISCOVERY_CALL_LINK =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ0Xyc4lpvhO6RukKP8lGyZqr7WxEPli1quFw85u0af0tk0qPr1Icy2uI0b8jJ9Z960dnnS4Y_pS';

function trackCtaClick() {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'lead_magnet_cta_click', {
      event_category: 'engagement',
      event_label: 'portal_tracker_cta',
    });
  }
}

export function LeadMagnet() {
  return (
    <div className="bg-[#0F172A] rounded-xl p-6 md:p-8 text-center">
      <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-3">
        Powered by AI
      </p>
      <p className="text-white text-lg md:text-xl font-bold mb-2">
        This tracker runs on AI agents that monitor dozens of sources automatically.
      </p>
      <p className="text-slate-300 text-sm mb-6 max-w-lg mx-auto">
        Built by{' '}
        <a
          href="https://morgantown.ai"
          className="text-[#FE5F55] hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Morgantown AI
        </a>
        {' '}— AI coaching and consulting for businesses in Morgantown, Pittsburgh, and beyond.
      </p>
      <a
        href={DISCOVERY_CALL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackCtaClick}
        className="inline-flex items-center gap-2 px-6 py-3 bg-[#FE5F55] hover:bg-[#E5453B] text-white font-bold rounded-lg transition-colors text-sm"
      >
        Book a Free Discovery Call
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  );
}
