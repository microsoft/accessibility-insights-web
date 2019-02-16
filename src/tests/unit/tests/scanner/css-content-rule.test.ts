// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It, MockBehavior } from 'typemoq';

import { IDictionaryStringTo } from '../../../../scanner/dictionary-types';
import { cssContentConfiguration } from './../../../../scanner/css-content-rule';

describe('meaningful sequence', () => {
    describe('verify meaningful sequence configs', () => {
        it('should have correct props', () => {
            expect(cssContentConfiguration.rule.id).toBe('css-content');
            expect(cssContentConfiguration.rule.selector).toBe('*');
            expect(cssContentConfiguration.rule.any[0]).toBe('css-content');
            expect(cssContentConfiguration.rule.any.length).toBe(1);
            expect(cssContentConfiguration.checks[0].id).toBe('css-content');
            expect(cssContentConfiguration.checks[0].evaluate(null, null, null, null)).toBe(true);
        });
    });

    describe('verify evaluate', () => {
        const windowMock = GlobalMock.ofInstance(window.getComputedStyle, 'getComputedStyle', window, MockBehavior.Strict);
        beforeEach(() => {
            windowMock.reset();
        });

        it('position absolute', () => {
            const node = {
                position: 'absolute',
                float: 'none',
            };

            testMeaningfulSequence(node, windowMock, true);
        });

        it('float right', () => {
            const node = {
                position: 'none',
                float: 'right',
            };

            testMeaningfulSequence(node, windowMock, true);
        });

        it('does not match', () => {
            const node = {
                position: 'none',
                float: 'none',
            };

            testMeaningfulSequence(node, windowMock, false);
        });
    });

    function testMeaningfulSequence(
        node: IDictionaryStringTo<string>,
        windowMock: IGlobalMock<typeof window.getComputedStyle>,
        expectedResult: boolean,
    ): void {
        windowMock.setup(m => m(It.isAny())).returns(style => ({ getPropertyValue: property => style[property] } as CSSStyleDeclaration));

        let result: boolean;
        GlobalScope.using(windowMock).with(() => {
            result = cssContentConfiguration.rule.matches(node, null);
        });
        expect(result).toBe(expectedResult);
    }
});
