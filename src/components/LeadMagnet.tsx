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
    <div className="bg-[var(--surface-container)] rounded-lg border border-[var(--outline-variant)]/20 p-6">
      <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#FEBB21] mb-3">
        Powered by AI
      </p>
      <p className="text-[#E2E2E2] text-sm font-medium mb-2">
        This tracker runs on AI agents that monitor dozens of sources automatically.
      </p>
      <p className="text-[#8e909a] text-xs mb-5 leading-relaxed">
        Built by{' '}
        <a
          href="https://morgantown.ai"
          className="text-[#FE5F55] hover:underline font-medium"
          target="_blank"
          rel="noopener noreferrer"
        >
          Morgantown AI
        </a>
      </p>
      <a
        href={DISCOVERY_CALL_LINK}
        target="_blank"
        rel="noopener noreferrer"
        onClick={trackCtaClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FE5F55] hover:bg-[#E5453B] text-white font-bold rounded text-xs transition-colors"
      >
        Book a Free Discovery Call
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </a>
    </div>
  );
}
