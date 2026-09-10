import fondoWhatsapp from '../../../../../../assets/voSdkk88H7C.svg';
import type { WhatsappColorProfile } from '../../../shared/whatsapp/whatsappColorProfile';

export function WhatsappDarkConversationBackground({ colors }: { colors?: WhatsappColorProfile }) {
    return (
        <div
            className={['absolute inset-0 overflow-hidden', colors ? '' : 'bg-[#0B1014]'].filter(Boolean).join(' ')}
            style={colors ? { backgroundColor: colors.conversationBackground } : undefined}
        >
            <div
                aria-hidden="true"
                className={['pointer-events-none absolute inset-0', colors ? '' : 'bg-[#252626]'].filter(Boolean).join(' ')}
                style={{
                    ...(colors ? { backgroundColor: colors.wallpaperPattern } : {}),
                    maskImage: `url(${fondoWhatsapp})`,
                    maskPosition: 'left top',
                    maskRepeat: 'repeat',
                    maskSize: '467.5px 832.5px',
                    WebkitMaskImage: `url(${fondoWhatsapp})`,
                    WebkitMaskPosition: 'left top',
                    WebkitMaskRepeat: 'repeat',
                    WebkitMaskSize: '467.5px 832.5px',
                }}
            />
        </div>
    );
}
