import fondoWhatsapp from '../../../../../../assets/voSdkk88H7C.svg';

export function WhatsappDarkConversationBackground() {
    return (
        <div className="absolute inset-0 overflow-hidden bg-[#0B1014]">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[#252A2E]"
                style={{
                    maskImage: `url(${fondoWhatsapp})`,
                    maskPosition: 'left top',
                    maskRepeat: 'repeat',
                    maskSize: '467.5px 832.5px',
                    WebkitMaskImage: `url(${fondoWhatsapp})`,
                    WebkitMaskPosition: 'left top',
                    WebkitMaskRepeat: 'repeat',
                    WebkitMaskSize: '374px 666px',
                }}
            />
        </div>
    );
}
