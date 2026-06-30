import type {
    MobileDesignDefinition,
    MobileDesignKey,
    PreviewDevicePreference,
    PreviewThemeMode,
    WhatsappDesktopScale,
} from '@/evidence-generator/types';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

const whatsappDesktopScaleOptions: WhatsappDesktopScale[] = [80, 85, 90, 95, 100];

interface ProfilePageProps extends SharedData {
    availableMobileDesigns: MobileDesignDefinition[];
    selectedMobileDesignKey: MobileDesignKey | null;
}

export default function Profile() {
    const { auth, availableMobileDesigns, selectedMobileDesignKey } = usePage<ProfilePageProps>().props;

    const { data, setData, patch, transform, errors, processing, recentlySuccessful } = useForm<{
        name: string;
        dni: string;
        sexualidad: 'M' | 'F';
        mobile_design_key: MobileDesignKey | 'none' | null;
        whatsapp_desktop_scale: WhatsappDesktopScale;
        evidence_theme_mode: PreviewThemeMode;
        evidence_device_mode: PreviewDevicePreference;
    }>({
        name: auth.user.name,
        dni: auth.user.dni,
        sexualidad: auth.user.sexualidad ?? 'M',
        mobile_design_key: selectedMobileDesignKey ?? 'none',
        whatsapp_desktop_scale: auth.user.whatsapp_desktop_scale ?? 80,
        evidence_theme_mode: auth.user.evidence_theme_mode ?? 'light',
        evidence_device_mode: selectedMobileDesignKey ? (auth.user.evidence_device_mode ?? 'desktop') : 'desktop',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        transform((formData) => ({
            ...formData,
            mobile_design_key: formData.mobile_design_key === 'none' ? null : formData.mobile_design_key,
            evidence_device_mode: formData.mobile_design_key === 'none' ? 'desktop' : formData.evidence_device_mode,
        }));

        patch(route('profile.update'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Profile information" description="Update your name and DNI" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>

                            <Input
                                id="name"
                                className="mt-1 block w-full"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                                autoComplete="name"
                                placeholder="Full name"
                            />

                            <InputError className="mt-2" message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dni">DNI</Label>

                            <Input
                                id="dni"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="mt-1 block w-full"
                                value={data.dni}
                                onChange={(e) => setData('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                                required
                                autoComplete="off"
                                placeholder="DNI"
                            />

                            <InputError className="mt-2" message={errors.dni} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="sexualidad">Sexualidad</Label>

                            <Select value={data.sexualidad} onValueChange={(value) => setData('sexualidad', value === 'F' ? 'F' : 'M')}>
                                <SelectTrigger id="sexualidad" className="mt-1 w-full">
                                    <SelectValue placeholder="Selecciona una opcion" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M">Masculino</SelectItem>
                                    <SelectItem value="F">Femenino</SelectItem>
                                </SelectContent>
                            </Select>

                            <InputError className="mt-2" message={errors.sexualidad} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="mobile_design_key">Diseño móvil</Label>

                            <Select
                                value={data.mobile_design_key ?? 'none'}
                                onValueChange={(value) => {
                                    setData('mobile_design_key', value === 'none' ? 'none' : (value as MobileDesignKey));

                                    if (value === 'none') {
                                        setData('evidence_device_mode', 'desktop');
                                    }
                                }}
                            >
                                <SelectTrigger id="mobile_design_key" className="mt-1 w-full">
                                    <SelectValue placeholder="Selecciona un diseño móvil" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Sin diseño móvil</SelectItem>
                                    {availableMobileDesigns.map((design) => (
                                        <SelectItem key={design.key} value={design.key}>
                                            {design.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <InputError className="mt-2" message={errors.mobile_design_key} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="evidence_theme_mode">Tema de evidencia</Label>

                            <Select
                                value={data.evidence_theme_mode}
                                onValueChange={(value) => setData('evidence_theme_mode', value === 'dark' ? 'dark' : 'light')}
                            >
                                <SelectTrigger id="evidence_theme_mode" className="mt-1 w-full">
                                    <SelectValue placeholder="Selecciona un tema" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="light">Modo claro</SelectItem>
                                    <SelectItem value="dark">Modo oscuro</SelectItem>
                                </SelectContent>
                            </Select>

                            <InputError className="mt-2" message={errors.evidence_theme_mode} />
                        </div>

                        {data.mobile_design_key !== 'none' ? (
                            <div className="grid gap-2">
                                <Label htmlFor="evidence_device_mode">Vista para evidencias</Label>

                                <Select
                                    value={data.evidence_device_mode}
                                    onValueChange={(value) => {
                                        setData('evidence_device_mode', value === 'mobile' || value === 'mixed' ? value : 'desktop');
                                    }}
                                >
                                    <SelectTrigger id="evidence_device_mode" className="mt-1 w-full">
                                        <SelectValue placeholder="Selecciona una vista" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="desktop">PC</SelectItem>
                                        <SelectItem value="mobile">Celular</SelectItem>
                                        <SelectItem value="mixed">PC / Celular</SelectItem>
                                    </SelectContent>
                                </Select>

                                <InputError className="mt-2" message={errors.evidence_device_mode} />
                            </div>
                        ) : null}

                        <div className="grid gap-2">
                            <Label htmlFor="whatsapp_desktop_scale">Tamaño WhatsApp desktop</Label>

                            <Select
                                value={String(data.whatsapp_desktop_scale)}
                                onValueChange={(value) => setData('whatsapp_desktop_scale', Number(value) as WhatsappDesktopScale)}
                            >
                                <SelectTrigger id="whatsapp_desktop_scale" className="mt-1 w-full">
                                    <SelectValue placeholder="Selecciona un tamaño" />
                                </SelectTrigger>
                                <SelectContent>
                                    {whatsappDesktopScaleOptions.map((scale) => (
                                        <SelectItem key={scale} value={String(scale)}>
                                            {scale}%
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <InputError className="mt-2" message={errors.whatsapp_desktop_scale} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Save</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Saved</p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
