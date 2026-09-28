import { resolveContactHeaderIdentity } from '../../../../../lib/contactHeaderIdentity.ts';
import type { SmsData } from './smsTypes';

export function resolveSmsHeaderIdentity(data: SmsData, formatPhone?: (phone: string) => string): string {
    return resolveContactHeaderIdentity(data, { formatPhone }).title;
}
