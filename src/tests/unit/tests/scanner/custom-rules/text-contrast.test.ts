// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import axe from 'axe-core';
import { withAxeSetup } from 'scanner/axe-utils';
import { textContrastConfiguration } from 'scanner/custom-rules/text-contrast';
import { Mock } from 'typemoq';

describe('text contrast', () => {
    describe('verify text contrast configs', () => {
        it('should have correct props', () => {
            expect(textContrastConfiguration.rule.id).toBe('text-contrast');
            expect(textContrastConfiguration.rule.selector).toBe('*');
            expect(textContrastConfiguration.rule.any[0]).toBe('text-contrast');
            expect(textContrastConfiguration.rule.all).toEqual([]);
            expect(textContrastConfiguration.rule.all.length).toBe(0);
            expect(textContrastConfiguration.rule.any.length).toBe(1);
            expect(textContrastConfiguration.checks[0].id).toBe('text-contrast');
        });
    });

    describe('verify evaluate', () => {
        afterEach(() => {
            document.body.innerHTML = '';
        });

        it.each([true, false, undefined])(
            'propagates return value %p from color-contrast check',
            colorContrastResult => {
                document.body.innerHTML = `
                    <span id="element-under-test">hello</span>
                `;
                const node = document.querySelector('#element-under-test');

                const actualResult = withAxeSetup(() => {
                    axe._audit.checks['color-contrast'].evaluate = () => colorContrastResult;

                    return textContrastConfiguration.checks[0].evaluate.call(
                        { data: () => {} },
                        node,
                    );
                });
                expect(actualResult).toBe(colorContrastResult);
            },
        );

        it.each`
            fontSizePx | fontWeight | expectedSizeOutput
            ${26}      | ${700}     | ${'large'}
            ${26}      | ${200}     | ${'large'}
            ${15}      | ${700}     | ${'large'}
            ${15}      | ${200}     | ${'regular'}
        `(
            'infers size $expectedSizeOutput for fontSizePx=$fontSizePx fontWeight=$fontWeight',
            ({ fontSizePx, fontWeight, expectedSizeOutput }) => {
                document.body.innerHTML = `
                    <span id="element-under-test" style="font-size: ${fontSizePx}px; font-weight: ${fontWeight}">hello</span>
                `;
                const node = document.querySelector('#element-under-test');

                const expectedData = {
                    textString: 'hello',
                    size: expectedSizeOutput,
                };

                const dataSetterMock = Mock.ofInstance(data => {});
                dataSetterMock.setup(d => d(expectedData));

                withAxeSetup(() => {
                    axe._audit.checks['color-contrast'].evaluate = () => false;

                    return textContrastConfiguration.checks[0].evaluate.call(
                        { data: dataSetterMock.object },
                        node,
                    );
                });

                dataSetterMock.verifyAll();
            },
        );
    });
});
