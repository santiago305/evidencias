import type { PreviewDevicePreference, PreviewThemeMode, WhatsappDesktopScale } from '@/evidence-generator/types';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    dni: string;
    sexualidad: 'M' | 'F';
    whatsapp_desktop_scale?: WhatsappDesktopScale | null;
    evidence_theme_mode?: PreviewThemeMode | null;
    evidence_device_mode?: PreviewDevicePreference | null;
    avatar?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
