import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

interface LoginForm {
    dni: string;
}

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm<LoginForm>({
        dni: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout title="Ingreso por DNI" description="Ingresa tu DNI para entrar al sistema">
            <Head title="Ingresar" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="dni">DNI</Label>
                        <Input
                            id="dni"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="off"
                            value={data.dni}
                            onChange={(e) => setData('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                            placeholder="Ej: 10000001"
                        />
                        <InputError message={errors.dni} />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={2} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Ingresar
                    </Button>
                </div>
            </form>

            <div className="text-muted-foreground text-center text-sm">
                ¿No tienes registro?{' '}
                <Link href={route('register')} className="font-medium text-slate-900 hover:underline">
                    Regístrate con tu DNI
                </Link>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
