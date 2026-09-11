import type { PreviewBlockProps } from '../../../../../types';

export type WhatsappData = NonNullable<PreviewBlockProps['data']>;

export type WhatsappMessageStatus = 'sent' | 'delivered' | 'read';

export type WhatsappBehaviorProfile = 'mobile-1' | 'standard';

export type WhatsappDesignVariant = 'mobile-1' | 'mobile-2' | 'mobile-3' | 'mobile-4' | 'mobile-5' | 'mobile-6' | 'mobile-7';
