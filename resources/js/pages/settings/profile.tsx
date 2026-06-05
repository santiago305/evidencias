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

export default function Profile() {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
        name: string;
        dni: string;
        sexualidad: 'M' | 'F';
    }>({
        name: auth.user.name,
        dni: auth.user.dni,
        sexualidad: auth.user.sexualidad ?? 'M',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

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
