<?php

namespace Database\Seeders;

use App\Models\Conversation;
use Illuminate\Database\Seeder;

class ConversationSeeder extends Seeder
{
    /**
     * Seed a five-day sample conversation with an even exchange between client and advisor.
     */
    public function run(): void
    {
        $conversation = Conversation::query()->updateOrCreate(
            ['code' => 'CONVERSACION-DEMO-001'],
            [
                'is_active' => true,
                'status' => 'production',
            ],
        );

        $conversation->messages()->delete();

        $messages = [
            ['side' => 'in', 'lines' => ['Hola, quisiera consultar sobre un crédito personal.']],
            ['side' => 'out', 'lines' => ['Hola, con mucho gusto. ¿Qué monto necesitas solicitar?']],
            ['side' => 'in', 'lines' => ['Estoy pensando solicitar S/ 8,000.']],
            ['side' => 'out', 'lines' => ['Perfecto. ¿En cuántas cuotas te gustaría pagarlo?']],
            ['side' => 'in', 'lines' => ['En 24 cuotas, para que la mensualidad sea manejable.']],
            ['side' => 'out', 'lines' => ['Entiendo. Revisaré una opción de financiamiento a 24 meses.']],
            ['side' => 'in', 'lines' => ['¿Qué documentos necesito presentar?']],
            ['side' => 'out', 'lines' => ['Necesitamos tu documento de identidad y sustento de ingresos.']],
            ['side' => 'in', 'lines' => ['¿Puedo enviar los documentos por este medio?']],
            ['side' => 'out', 'lines' => ['Sí, puedes adjuntarlos aquí para iniciar la evaluación.']],
            ['side' => 'in', 'lines' => ['¿Cuánto tiempo demora la respuesta?']],
            ['side' => 'out', 'lines' => ['La evaluación normalmente demora hasta 24 horas hábiles.']],
            ['side' => 'in', 'lines' => ['¿La tasa depende de mi historial crediticio?']],
            ['side' => 'out', 'lines' => ['Así es, la tasa final depende de tu perfil y evaluación crediticia.']],
            ['side' => 'in', 'lines' => ['De acuerdo, enviaré mis documentos hoy.']],
            ['side' => 'out', 'lines' => ['Excelente. Cuando los recibamos te confirmaremos la recepción.']],
            ['side' => 'in', 'lines' => ['También quisiera saber si puedo adelantar cuotas.']],
            ['side' => 'out', 'lines' => ['Sí, puedes realizar pagos anticipados según las condiciones del contrato.']],
            ['side' => 'in', 'lines' => ['Muchas gracias por la información.']],
            ['side' => 'out', 'lines' => ['Gracias a ti. Quedamos atentos a tus documentos.']],
        ];

        $dayStartPositions = [5, 9, 13, 17];

        $conversation->messages()->createMany(
            collect($messages)->values()->map(fn (array $message, int $index): array => [
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
