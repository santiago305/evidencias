import { resolveContactPhoneDisplay } from '../../../../../lib/contactHeaderIdentity.ts';
import type { SmsData } from './smsTypes';

export function resolveSmsPhoneDisplay(data: Pick<SmsData, 'telefono'>, formatPhone?: (phone: string) => string): string {
    return resolveContactPhoneDisplay(data, formatPhone ? { formatPhone } : {});
}
