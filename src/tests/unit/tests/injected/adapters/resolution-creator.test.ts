// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import {
    getCheckResolution,
    getFixResolution,
    ResolutionCreatorData,
} from 'injected/adapters/resolution-creator';

describe('ResolutionCreator', () => {
    it('outputs correct fix resolution with no data', () => {
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            id: 'test id',
            nodeResult: {
                any: [],
                all: [],
                none: [],
                html: 'test html',
                target: ['test target'],
            },
        };

        const expected = {
            'how-to-fix-web': {
                any: [],
                none: [],
                all: [],
            },
        };

        const actual = getFixResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });

    it('outputs correct fix resolution with data', () => {
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            id: 'test id',
            nodeResult: {
                any: [
                    { id: null, message: 'any 1 message', data: null },
                    { id: null, message: 'any 2 message', data: null },
                ],
                all: [{ id: null, message: 'all 1 message', data: null }],
                none: [{ id: null, message: 'none 1 message', data: null }],
                html: 'test html',
                target: ['test target'],
            },
        };

        const expected = {
            'how-to-fix-web': {
                all: ['all 1 message'],
                any: ['any 1 message', 'any 2 message'],
                none: ['none 1 message'],
            },
        };

        const actual = getFixResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });

    it.each`
        testId                     | expectedText
        ${'aria-input-field-name'} | ${"Inspect the element using the Accessibility pane in the browser Developer Tools to verify that the field's accessible name is complete without its associated <label>."}
        ${'color-contrast'}        | ${"If the text is intended to be invisible, it passes.\nIf the text is intended to be visible, use Accessibility Insights for Windows (or the Colour Contrast Analyser if you're testing on a Mac) to manually verify that it has sufficient contrast compared to the background. If the background is an image or gradient, test an area where contrast appears to be lowest.\nFor detailed test instructions, see Assessment > Adaptable content > Contrast."}
        ${'link-in-text-block'}    | ${"Manually verify that the link text EITHER has a contrast ratio of at least 3:1 compared to surrounding text OR has a distinct visual style (such as underlined, bolded, or italicized). To measure contrast, use Accessibility Insights for Windows (or the Colour Contrast Analyser if you're testing on a Mac)."}
        ${'th-has-data-cells'}     | ${'Examine the header cell in the context of the table to verify that it has no data cells.'}
        ${'bogus test id'}         | ${"No 'How to check' guidance has been supplied.  Please contact the Accessibility Insights team."}
    `('outputs correct check resolution with id=$testId', ({ testId, expectedText }) => {
        const resolutionCreatorDataStub: ResolutionCreatorData = {
            id: testId,
            nodeResult: {
                any: [],
                all: [],
                none: [],
                html: 'test html',
                target: ['test target'],
            },
        };

        const expected = {
            'how-to-check-web': expectedText,
        };

        const actual = getCheckResolution(resolutionCreatorDataStub);
        expect(actual).toEqual(expected);
    });
});
