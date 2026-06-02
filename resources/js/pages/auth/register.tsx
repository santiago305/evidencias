import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface RegisterForm {
    name: string;
    dni: string;
}

export default function Register() {
    const { data, setData, post, processing, errors } = useForm<RegisterForm>({
        name: '',
        dni: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <AuthLayout title="Registro por nombre y DNI" description="Crea tu acceso ingresando tu nombre y tu DNI">
            <Head title="Registro" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Ej: Ana Lopez"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            tabIndex={2}
                            autoComplete="off"
                            value={data.dni}
                            onChange={(e) => setData('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                            placeholder="Ej: 12345678"
                        />
                        <InputError message={errors.dni} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={3} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Registrarme
                    </Button>
                </div>
            </form>

            <div className="text-muted-foreground text-center text-sm">
                ¿Ya tienes registro?{' '}
                <Link href={route('login')} className="font-medium text-slate-900 hover:underline">
                    Ingresa aquí
                </Link>
            </div>
        </AuthLayout>
    );
}
