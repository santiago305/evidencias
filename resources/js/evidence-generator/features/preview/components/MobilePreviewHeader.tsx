import { MobilePreviewDefaultHeader } from './mobile-preview-header';

interface MobilePreviewHeaderProps {
    title: string;
    subtitle?: string;
    themeMode: 'light' | 'dark';
}

export function MobilePreviewHeader({ themeMode }: MobilePreviewHeaderProps) {
    return <MobilePreviewDefaultHeader themeMode={themeMode} />;
}
