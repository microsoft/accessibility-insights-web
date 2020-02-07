// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, IMock, It, Mock, MockBehavior } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';
import { textContrastConfiguration } from '../../../../../scanner/custom-rules/text-contrast';
import { DictionaryStringTo } from '../../../../../types/common-types';

function testTextContrast(
    node: DictionaryStringTo<string>,
    expectedData: any,
    axeUtilsMock: IGlobalMock<typeof AxeUtils.getEvaluateFromCheck>,
    windowMock: IGlobalMock<typeof window.getComputedStyle>,
    dataSetterMock: IMock<(data) => void>,
): void {
    windowMock
        .setup(m => m(It.isAny()))
        .returns(
            currentNode =>
                ({ getPropertyValue: property => currentNode[property] } as CSSStyleDeclaration),
        );

    dataSetterMock.setup(d => d(expectedData));

    let result;
    GlobalScope.using(windowMock, axeUtilsMock).with(() => {
        result = textContrastConfiguration.checks[0].evaluate.call(
            { data: dataSetterMock.object },
            node,
        );
    });
    expect(result).toBe(false);

    dataSetterMock.verifyAll();
}

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
        let dataSetterMock: IMock<(data) => void>;
        const axeUtilsMock = GlobalMock.ofInstance(
            AxeUtils.getEvaluateFromCheck,
            'getEvaluateFromCheck',
            AxeUtils,
            MockBehavior.Strict,
        );
        const windowMock = GlobalMock.ofInstance(
            window.getComputedStyle,
            'getComputedStyle',
            window,
            MockBehavior.Strict,
        );

        beforeEach(() => {
            dataSetterMock = Mock.ofInstance(data => {});
            axeUtilsMock
                .setup(m => m(It.isAnyString()))
                .returns(_ => (node, options, virtualNode, context) => false);
        });

        it('large font size / regular font weight', () => {
            const node = {
                innerText: 'hello',
                'font-size': '26px',
                'font-weight': '200',
            };
            const expectedData = {
                textString: 'hello',
                size: 'large',
            };
            testTextContrast(node, expectedData, axeUtilsMock, windowMock, dataSetterMock);
        });

        it('set size to be large for font size >= 14pt bold text', () => {
            const node = {
                innerText: 'hello',
                'font-size': '20px',
                'font-weight': '700',
            };
            const expectedData = {
                textString: 'hello',
                size: 'large',
            };
            testTextContrast(node, expectedData, axeUtilsMock, windowMock, dataSetterMock);
        });

        it('set size to be regular for font size < 18pt non bold text', () => {
            const node = {
                innerText: 'hello',
                'font-size': '15px',
                'font-weight': '200',
            };
            const expectedData = {
                textString: 'hello',
                size: 'regular',
            };
            testTextContrast(node, expectedData, axeUtilsMock, windowMock, dataSetterMock);
        });
    });
});
