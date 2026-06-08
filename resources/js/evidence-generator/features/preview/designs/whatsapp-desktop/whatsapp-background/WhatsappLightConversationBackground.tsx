import fondoWhatsapp from '../../../../../assets/voSdkk88H7C.svg';

export function WhatsappLightConversationBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-[#F5F1EB]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#EEE6DD]"
                style={{
                    maskImage: `url(${fondoWhatsapp})`,
                    maskPosition: 'left top',
                    maskRepeat: 'repeat',
                    maskSize: '374px 666px',
                    WebkitMaskImage: `url(${fondoWhatsapp})`,
                    WebkitMaskPosition: 'left top',
                    WebkitMaskRepeat: 'repeat',
                    WebkitMaskSize: '374px 666px',
                }}
            />
        </div>
    );
}
