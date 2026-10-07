<?php

namespace App\Services\Conversation;

class SpanishGenderInflector
{
    /** Mirrors the linguistic data in resources/js/lib/spanishGenderExceptions.ts and spanishGenderRules.ts. */
    private const EXCEPTION_PAIRS = [
        'actor' => 'actriz',
        'rey' => 'reina',
        'héroe' => 'heroína',
        'emperador' => 'emperatriz',
        'príncipe' => 'princesa',
        'hombre' => 'mujer',
        'padre' => 'madre',
        'papá' => 'mamá',
        'macho' => 'hembra',
        'yerno' => 'nuera',
        'caballo' => 'yegua',
        'toro' => 'vaca',
        'carnero' => 'oveja',
        'patriarca' => 'matriarca',
        'gallo' => 'gallina',
        'padrino' => 'madrina',
        'padrastro' => 'madrastra',
        'monje' => 'monja',
        'abad' => 'abadesa',
        'alcalde' => 'alcaldesa',
        'barón' => 'baronesa',
        'conde' => 'condesa',
        'duque' => 'duquesa',
        'jeque' => 'jequesa',
        'zar' => 'zarina',
    ];

    private const BLOCKED_NOUNS = [
        'dinero', 'agujero', 'sombrero', 'florero', 'llavero',
        'motor', 'sector', 'tractor', 'factor', 'vector', 'reactor', 'sensor',
        'neón', 'padrón', 'arnés', 'revés', 'interés', 'cortés', 'descortés',
        'volcán', 'jardín', 'botín', 'cojín', 'calcetín', 'acordeón', 'panteón',
        'balcón', 'melón', 'camión', 'avión', 'sillón', 'jabón', 'corazón',
        'sudor', 'ardor', 'color', 'valor', 'calor', 'dolor', 'tambor',
        'libro', 'carro', 'casa', 'hora', 'mesa', 'ventana', 'semana',
        'pingüino', 'caso', 'madero', 'madera', 'corona', 'zona',
        'testigo', 'modelo', 'soldado', 'persona', 'víctima', 'criatura',
        'lechuza', 'ruiseñor', 'gerenta', 'atleta', 'astronauta', 'colega',
        'guía', 'pediatra', 'poeta', 'profeta',
    ];

    private const RESTRICTED_RULES = [
        ['masculineEnding' => 'nte', 'feminineEnding' => 'nta', 'minimumStemLength' => 2, 'licensedMasculines' => ['cliente', 'presidente', 'dependiente', 'sirviente']],
        ['masculineEnding' => 'e', 'feminineEnding' => 'a', 'minimumStemLength' => 2, 'licensedMasculines' => ['jefe', 'infante', 'nene', 'alcahuete']],
        ['masculineEnding' => 'l', 'feminineEnding' => 'la', 'minimumStemLength' => 2, 'licensedMasculines' => ['español', 'zagal', 'colegial']],
        ['masculineEnding' => 'z', 'feminineEnding' => 'za', 'minimumStemLength' => 2, 'licensedMasculines' => ['andaluz']],
    ];

    private const PRODUCTIVE_RULES = [
        ['masculineEnding' => 'or', 'feminineEnding' => 'ora', 'minimumStemLength' => 3],
        ['masculineEnding' => 'ón', 'feminineEnding' => 'ona', 'minimumStemLength' => 2],
        ['masculineEnding' => 'án', 'feminineEnding' => 'ana', 'minimumStemLength' => 2, 'licensedFeminineSources' => ['capitán', 'alemán', 'catalán', 'guardián', 'musulmán', 'charlatán']],
        ['masculineEnding' => 'ín', 'feminineEnding' => 'ina', 'minimumStemLength' => 2, 'licensedFeminineSources' => ['bailarín', 'danzarín']],
        ['masculineEnding' => 'és', 'feminineEnding' => 'esa', 'minimumStemLength' => 2, 'licensedFeminineSources' => ['francés', 'inglés', 'japonés', 'marqués', 'portugués', 'holandés', 'irlandés', 'burgués', 'feligrés', 'burgalés']],
        ['masculineEnding' => 'o', 'feminineEnding' => 'a', 'minimumStemLength' => 2],
    ];

    public function inflect(string $word, ?string $sex): string
    {
        if ($sex === null || $sex === '') {
            return $this->dualForm($word);
        }

        if ($sex !== 'M' && $sex !== 'F') {
            return $word;
        }

        $normalized = class_exists(\Normalizer::class)
            ? (\Normalizer::normalize($word, \Normalizer::FORM_C) ?: $word)
            : $word;

        if (preg_match('/^(\s*)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)(\s*)$/u', $normalized, $parts) !== 1) {
            return $word;
        }

        $lowerWord = mb_strtolower($parts[2], 'UTF-8');
        if (in_array($lowerWord, self::BLOCKED_NOUNS, true)) {
            return $word;
        }

        $exception = $this->exceptionForms($lowerWord);
        $inflected = $exception[$sex] ?? $this->inflectByMorphology($lowerWord, $sex);
        if ($inflected === null || $inflected === $lowerWord || in_array($inflected, self::BLOCKED_NOUNS, true)) {
            return $word;
        }

        $cased = $this->restoreCase($parts[2], $inflected);

        return $cased === null ? $word : $parts[1].$cased.$parts[3];
    }

    private function dualForm(string $word): string
    {
        $normalized = class_exists(\Normalizer::class)
            ? (\Normalizer::normalize($word, \Normalizer::FORM_C) ?: $word)
            : $word;

        if (preg_match('/^(\s*)([A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)(\s*)$/u', $normalized, $parts) !== 1) {
            return $word;
        }

        $masculine = $this->inflect($parts[2], 'M');
        $feminine = $this->inflect($parts[2], 'F');
        if ($masculine === $feminine) {
            return $word;
        }

        return $parts[1].$this->representGenderPair($masculine, $feminine).$parts[3];
    }

    private function representGenderPair(string $masculine, string $feminine): string
    {
        $masculineLength = mb_strlen($masculine, 'UTF-8');
        $feminineLength = mb_strlen($feminine, 'UTF-8');
        $feminineLast = mb_substr($feminine, -1, 1, 'UTF-8');
        $isFeminineA = $feminineLast === 'a' || $feminineLast === 'A';

        if ($isFeminineA && $feminineLength === $masculineLength + 1
            && mb_substr($feminine, 0, $masculineLength, 'UTF-8') === $masculine) {
            return $masculine.'('.$feminineLast.')';
        }

        $masculineLast = mb_substr($masculine, -1, 1, 'UTF-8');
        if ($isFeminineA && $feminineLength === $masculineLength
            && in_array($masculineLast, ['o', 'O', 'e', 'E'], true)
            && mb_substr($masculine, 0, $masculineLength - 1, 'UTF-8')
                === mb_substr($feminine, 0, $feminineLength - 1, 'UTF-8')) {
            return $masculine.'('.$feminineLast.')';
        }

        return $masculine.'/'.$feminine;
    }

    /**
     * @return array{M: string, F: string}|null
     */
    private function exceptionForms(string $word): ?array
    {
        foreach (self::EXCEPTION_PAIRS as $masculine => $feminine) {
            if ($word === $masculine || $word === $feminine) {
                return ['M' => $masculine, 'F' => $feminine];
            }
        }

        return null;
    }

    private function inflectByMorphology(string $word, string $sex): ?string
    {
        foreach (self::RESTRICTED_RULES as $rule) {
            $inflected = $this->applyRule($word, $sex, $rule);
            if ($inflected !== null) {
                return $inflected;
            }
        }

        if (str_ends_with($word, 'ista') || str_ends_with($word, 'ante') || str_ends_with($word, 'ente')) {
            return null;
        }

        foreach (self::PRODUCTIVE_RULES as $rule) {
            $inflected = $this->applyRule($word, $sex, $rule);
            if ($inflected !== null) {
                return $inflected;
            }
        }

        return null;
    }

    /**
     * @param  array{masculineEnding: string, feminineEnding: string, minimumStemLength: int, licensedMasculines?: list<string>, licensedFeminineSources?: list<string>}  $rule
     */
    private function applyRule(string $word, string $sex, array $rule): ?string
    {
        $sourceEnding = $sex === 'F' ? $rule['masculineEnding'] : $rule['feminineEnding'];
        $targetEnding = $sex === 'F' ? $rule['feminineEnding'] : $rule['masculineEnding'];
        if (! str_ends_with($word, $sourceEnding)) {
            return null;
        }

        $stem = mb_substr($word, 0, mb_strlen($word, 'UTF-8') - mb_strlen($sourceEnding, 'UTF-8'), 'UTF-8');
        if (mb_strlen($stem, 'UTF-8') < $rule['minimumStemLength']) {
            return null;
        }

        $masculineCandidate = $sex === 'F' ? $word : $stem.$rule['masculineEnding'];
        if (isset($rule['licensedMasculines']) && ! in_array($masculineCandidate, $rule['licensedMasculines'], true)) {
            return null;
        }

        if ($sex === 'M' && isset($rule['licensedFeminineSources'])
            && ! in_array($masculineCandidate, $rule['licensedFeminineSources'], true)) {
            return null;
        }

        return $stem.$targetEnding;
    }

    private function restoreCase(string $original, string $transformed): ?string
    {
        if ($original === mb_strtolower($original, 'UTF-8')) {
            return $transformed;
        }

        if ($original === mb_strtoupper($original, 'UTF-8')) {
            return mb_strtoupper($transformed, 'UTF-8');
        }

        $firstLetter = mb_substr($original, 0, 1, 'UTF-8');
        $rest = mb_substr($original, 1, null, 'UTF-8');
        if ($firstLetter === mb_strtoupper($firstLetter, 'UTF-8') && $rest === mb_strtolower($rest, 'UTF-8')) {
            return mb_strtoupper(mb_substr($transformed, 0, 1, 'UTF-8'), 'UTF-8').mb_substr($transformed, 1, null, 'UTF-8');
        }

        return null;
    }
}
