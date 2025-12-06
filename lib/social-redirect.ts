'use client';

import { toast } from 'sonner';

export function handleSocialRedirect(url: string) {
  toast.info('Redirecting...', {
    description: '302 Found',
  });
  
  window.open(url, '_blank', 'noopener,noreferrer');
}
