import type { PreviewProps, WhatsappDesktopScaleProps } from '../../../../types';
import { PreviewBlockWhatsapp } from './PreviewBlockWhatsapp';

type PreviewWhatsappDesktopProps = PreviewProps & WhatsappDesktopScaleProps;

export function PreviewWhatsappDesktop({ data, whatsappDesktopScale, themeMode }: PreviewWhatsappDesktopProps) {
    return <PreviewBlockWhatsapp data={data} whatsappDesktopScale={whatsappDesktopScale} themeMode={themeMode} />;
}
