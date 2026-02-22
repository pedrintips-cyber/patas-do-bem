import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const usePageTracking = () => {
  const location = useLocation();

  useEffect(() => {
    const affiliateCode = new URLSearchParams(location.search).get('ref') || null;
    
    // Store affiliate code in sessionStorage if present
    if (affiliateCode) {
      sessionStorage.setItem('affiliate_code', affiliateCode);
    }

    const campaignMatch = location.pathname.match(/\/vaquinhas\/([^/]+)/);
    const campaignId = campaignMatch ? campaignMatch[1] : null;

    supabase.from('page_views').insert({
      page: location.pathname,
      campaign_id: campaignId,
      referrer: document.referrer || null,
      affiliate_code: affiliateCode || sessionStorage.getItem('affiliate_code') || null,
    }).then(() => {});
  }, [location.pathname]);
};
