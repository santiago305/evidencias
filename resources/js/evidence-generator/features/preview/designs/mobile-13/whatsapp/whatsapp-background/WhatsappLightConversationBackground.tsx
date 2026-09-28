import fondoWhatsapp from '../../../../../../assets/voSdkk88H7C.svg';
import type { WhatsappColorProfile } from '../whatsappColorProfile';

export function WhatsappLightConversationBackground({ colors }: { colors?: WhatsappColorProfile }) {
    return (
        <div
            className={['absolute inset-0 overflow-hidden', colors ? '' : 'bg-[#F5F2ED]'].filter(Boolean).join(' ')}
            style={colors ? { backgroundColor: colors.conversationBackground } : undefined}
        >
            <div
                aria-hidden="true"
                className={['pointer-events-none absolute inset-0', colors ? '' : 'bg-[#eee6dd]'].filter(Boolean).join(' ')}
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
