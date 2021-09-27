// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { link } from '../../../../content/link';

describe('link', () => {
    test('guidanceLinkTo returns a valid GuidanceLink', () => {
        expect(link['WCAG_1_1_1']).toBeDefined();
    });

    test('guidanceLinkTo returns proper name', () => {
        expect(link['WCAG_1_1_1'].text).toBe('WCAG 1.1.1');
    });

    test('guidanceLinkTo returns proper link', () => {
        expect(link['WCAG_1_1_1'].href).toBe(
            'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html',
        );
    });

    test("guidanceLinkTo returns empty array for tags if they don't exist", () => {
        expect(link['WCAG_1_1_1'].tags.length).toEqual(0);
    });

    test('guidanceLinkTo returns tags if they exist', () => {
        expect(link['WCAG_1_3_4'].tags.length).toBeGreaterThan(0);
    });
});
