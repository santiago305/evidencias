import fondoWhatsapp from '../../../../../assets/voSdkk88H7C.svg';

export function WhatsappDarkConversationBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-[#161717]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#252626]"
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
