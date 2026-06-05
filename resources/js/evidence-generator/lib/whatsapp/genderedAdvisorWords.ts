const feminineAdvisorWords: Record<string, string> = {
    asesor: 'asesora',
    senor: 'senorita',
    señor: 'señorita',
    sr: 'srta',
    estimado: 'estimada',
    querido: 'querida',
    bienvenido: 'bienvenida',
    interesado: 'interesada',
    aprobado: 'aprobada',
    registrado: 'registrada',
    afiliado: 'afiliada',
    el: 'ella',
    él: 'ella',
    lo: 'la',
    suyo: 'suya',
    mismo: 'misma',
};

export function uppercaseFirstLetter(text: string) {
    return text.replace(/\p{L}/u, (letter) => letter.toLocaleUpperCase('es-PE'));
}

function matchWordCase(source: string, value: string) {
    if (source.toLocaleUpperCase('es-PE') === source) {
        return value.toLocaleUpperCase('es-PE');
    }

    if (source[0]?.toLocaleUpperCase('es-PE') === source[0]) {
        return uppercaseFirstLetter(value);
    }

    return value;
}

export function genderAdvisorWord(word: string, sexualidadAsesor: string) {
    if (sexualidadAsesor !== 'F') {
        return word;
    }

    const lowerWord = word.toLocaleLowerCase('es-PE');
    const feminineWord = feminineAdvisorWords[lowerWord] ?? (lowerWord.endsWith('o') ? `${lowerWord.slice(0, -1)}a` : null);

    return feminineWord ? matchWordCase(word, feminineWord) : word;
}

export function interpolateGenderedAdvisorWords(text: string, sexualidadAsesor: string) {
    return text.replace(/\{s_asesor\(([^{}()]*)\)\}/gu, (_, word: string) => {
        return genderAdvisorWord(word.trim(), sexualidadAsesor);
    });
}
