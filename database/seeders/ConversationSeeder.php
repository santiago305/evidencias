<?php

namespace Database\Seeders;

use App\Models\Conversation;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    public function run(): void
    {
        $scenarios = [
            ['code' => 'CONVERSACION-DEMO-001', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-002', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-003', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-004', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-005', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-006', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-007', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-008', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-009', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-010', 'type' => 'whatsapp'],
            ['code' => 'CONVERSACION-DEMO-011', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-012', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-013', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-014', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-015', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-016', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-017', 'type' => 'sms'],
            ['code' => 'CONVERSACION-DEMO-018', 'type' => 'sms'],
        ];

        $dayStartPositions = [5, 9, 13, 17];

        foreach ($scenarios as $scenario) {
            $conversation = Conversation::query()->updateOrCreate(
                ['code' => $scenario['code']],
                [
                    'type' => $scenario['type'],
                    'is_active' => true,
                    'status' => 'production',
                ],
            );

            $conversation->messages()->delete();

            $conversationLabel = strtoupper($scenario['type']);

            $messages = [
                ['side' => 'in', 'lines' => ["({$conversationLabel})-{$scenario['code']} {saludo}, soy {nombre_cliente}."]],
                ['side' => 'out', 'lines' => ['Hola {primer_nombre_cliente}, te atiende {nombre_asesor}.']],
                ['side' => 'in', 'lines' => ['Puedes contactarme al {telefono}; mi DNI es {dni_cliente}.']],
                ['side' => 'out', 'lines' => ['Claro, {s_asesor(asesor)} {primer_nombre_cliente}. Revisaremos tu solicitud.']],
                ['side' => 'in', 'lines' => ['Estoy interesado en solicitar S/ {monto}.']],
                ['side' => 'out', 'lines' => ['La tasa referencial es {tasa}% y el costo total TCEA es {TCEA}%.']],
                ['side' => 'in', 'lines' => ['Me gustaria pagarlo en {plazo} meses, con una cuota de S/ {cuota}.']],
                ['side' => 'out', 'lines' => ['Perfecto, {primer_nombre_asesor} registrara la alternativa de S/ {cuota} por {plazo} meses.']],
                ['side' => 'in', 'lines' => ['Que documentos necesito presentar para continuar?']],
                ['side' => 'out', 'lines' => ['Necesitamos tu DNI {dni_cliente} y sustento de ingresos.']],
                ['side' => 'in', 'lines' => ['Puedo enviar los documentos por este medio, {nombre_asesor}?']],
                ['side' => 'out', 'lines' => ['Si, {s_asesor(asesor)} puedes adjuntarlos aqui para iniciar la evaluacion.']],
                ['side' => 'in', 'lines' => ['Gracias, {primer_nombre_asesor}. Quedare atento a la respuesta.']],
                ['side' => 'out', 'lines' => ['Con gusto, {primer_nombre_cliente}. Te contactaremos al {telefono}.']],
                ['side' => 'in', 'lines' => ['Confirmo que acepto evaluar el monto de S/ {monto}.']],
                ['side' => 'out', 'lines' => ['Excelente, {nombre_cliente}. Tu cuota estimada seria S/ {cuota}.']],
                ['side' => 'in', 'lines' => ['Tambien quisiera saber si puedo adelantar cuotas.']],
                ['side' => 'out', 'lines' => ['Si, puedes realizar pagos anticipados segun las condiciones del contrato.']],
                ['side' => 'in', 'lines' => ['Muchas gracias por la informacion, {nombre_asesor}.']],
                ['side' => 'out', 'lines' => ['Gracias a ti, {primer_nombre_cliente}. Quedamos atentos a tus documentos.']],
            ];

            $conversation->messages()->createMany(
                collect($messages)->map(fn (array $message, int $index): array => [
                    'position' => $index + 1,
                    'side' => $message['side'],
                    'delay_minutes' => match (true) {
                        $index === 0 => 0,
                        in_array($index + 1, $dayStartPositions, true) => 1440,
                        default => 5,
                    },
                    'lines' => $message['lines'],
                ])->all(),
            );
        }
    }
}
