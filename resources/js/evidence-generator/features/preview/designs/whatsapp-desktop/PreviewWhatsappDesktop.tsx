import type { PreviewProps } from '../../../../types';
import { PreviewBlockWhatsapp } from './PreviewBlockWhatsapp';

export function PreviewWhatsappDesktop({ data, themeMode }: PreviewProps) {
    return <PreviewBlockWhatsapp data={data} themeMode={themeMode} />;
}
