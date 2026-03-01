'use client';

import { useEffect } from 'react';
import api from '@/lib/api';

/**
 * Lightweight client component that fires a page-view tracking
 * request. Extracted so the parent page can remain a Server Component
 * for SSR/SEO.
 */
export default function TrackPageView() {
  useEffect(() => {
    api
      .post('/track', {
        page: window.location.pathname,
        referrer: document.referrer || '',
      })
      .catch(() => {
        /* tracking is non-critical — fail silently */
      });
  }, []);

  return null;
}
