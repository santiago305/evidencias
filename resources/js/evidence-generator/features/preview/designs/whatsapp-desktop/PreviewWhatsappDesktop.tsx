import type { PreviewProps, WhatsappDesktopScaleProps } from '../../../../types';
import { PreviewBlockWhatsapp } from './PreviewBlockWhatsapp';
import type { WhatsappTypographyPlatform } from '../whatsappTypography';

type PreviewWhatsappDesktopProps = PreviewProps & WhatsappDesktopScaleProps;

export function PreviewWhatsappDesktop({ data, whatsappDesktopScale, themeMode }: PreviewWhatsappDesktopProps) {
    const whatsappTypographyPlatform: WhatsappTypographyPlatform = 'windows';
    return (
        <div data-whatsapp-platform={whatsappTypographyPlatform} className="h-full w-full flex flex-col items-end">
            <PreviewBlockWhatsapp data={data} whatsappDesktopScale={whatsappDesktopScale} themeMode={themeMode} />
        </div>
    );
}
