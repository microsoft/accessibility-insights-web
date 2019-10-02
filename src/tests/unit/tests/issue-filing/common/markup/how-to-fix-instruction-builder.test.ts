// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HowToFixInstructions } from '../../../../../../injected/adapters/scan-results-to-unified-results';
import { buildHowToFixInstructions } from '../../../../../../issue-filing/common/markup/how-to-fix-instruction-builder';

describe('buildHowToFixInstructions', () => {
    const howToFixCombinations: HowToFixInstructions[] = [
        { oneOf: [], all: [], none: [] },
        { oneOf: [], all: ['all'], none: [] },
        { oneOf: [], all: ['all'], none: ['none'] },
        { oneOf: [], all: [], none: ['none'] },
        { oneOf: ['any'], all: [], none: [] },
        { oneOf: ['any'], all: ['all'], none: [] },
        { oneOf: ['any'], all: ['all'], none: ['none'] },
        { oneOf: ['any'], all: [], none: ['none'] },
        { oneOf: ['any-1', 'any-2'], all: ['all-1', 'all-2'], none: ['none-1', 'none-2'] },
    ];

    test.each(howToFixCombinations)('build instructions', instructions => {
        const result = buildHowToFixInstructions(instructions, (title, checks) => `${title}${checks.join('; ')}; `);
        expect(result).toMatchSnapshot();
    });
});
