// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import { cssPositioningConfiguration } from 'scanner/custom-rules/css-positioning-rule';

describe('verify meaningful sequence configs', () => {
    it('should have correct props', () => {
        expect(cssPositioningConfiguration.rule.id).toBe('css-positioning');
        expect(cssPositioningConfiguration.rule.selector).toBe('*');
        expect(cssPositioningConfiguration.rule.any[0]).toBe('css-positioning');
        expect(cssPositioningConfiguration.rule.any.length).toBe(1);
        expect(cssPositioningConfiguration.checks[0].id).toBe('css-positioning');
        expect(cssPositioningConfiguration.checks[0].evaluate(null, null, null, null)).toBe(true);
    });
});

describe('verify matches', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it.each`
        style                                                    | expectedResult
        ${'position: absolute; float: none'}                     | ${true}
        ${'position: none; float: right'}                        | ${true}
        ${'position: none; float: none'}                         | ${false}
        ${'position: none; float: right; display: none'}         | ${false}
        ${'position: absolute; float: none; visibility: hidden'} | ${false}
    `('returns $expectedResult for style $style', ({ style, expectedResult }) => {
        document.body.innerHTML = `
            <div id="element-under-test" style="${style}">text</div>
        `;
        const node = document.body.querySelector('#element-under-test');

        const result = withAxeSetup(() => cssPositioningConfiguration.rule.matches(node, null));

        expect(result).toBe(expectedResult);
    });
});
