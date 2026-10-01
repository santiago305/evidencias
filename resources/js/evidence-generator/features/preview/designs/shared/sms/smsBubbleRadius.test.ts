import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const designsDirectory = new URL('../../', import.meta.url);
const referenceSource = readFileSync(new URL('mobile-12/sms/sms-bubbles/SmsMobileTextBubble.tsx', designsDirectory), 'utf8');
const radiusPattern = /const radius = isOutgoing[\s\S]*?}\[groupPosition\];/;

function getRadiusClasses(source: string): string[] {
    const radiusMapping = source.match(radiusPattern)?.[0];

    assert.ok(radiusMapping, 'SMS bubble radius mapping was not found');

    return [...radiusMapping.matchAll(/(?:single|first|middle|last):\s*'([^']+)'/g)].map((match) => match[1]);
}

test('SMS bubble radius matches mobile 12 in every other supported design except mobile 13', () => {
    const referenceRadiusClasses = getRadiusClasses(referenceSource);

    assert.equal(referenceRadiusClasses.length, 8);

    const bubblePaths = [
        'shared/sms/sms-bubbles/SmsMobileTextBubble.tsx',
        ...[7, 8, 9, 10, 11].map((number) => `mobile-${number}/sms/sms-bubbles/SmsMobileTextBubble.tsx`),
    ];

    for (const bubblePath of bubblePaths) {
        const source = readFileSync(new URL(bubblePath, designsDirectory), 'utf8');

        assert.deepEqual(getRadiusClasses(source), referenceRadiusClasses, `${bubblePath} has a different SMS bubble radius mapping`);
    }
});
