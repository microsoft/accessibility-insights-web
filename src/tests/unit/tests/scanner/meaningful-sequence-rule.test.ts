// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, IGlobalMock, It, MockBehavior } from 'typemoq';

import { IDictionaryStringTo } from '../../../../scanner/dictionary-types';
import { meaningfulSequenceConfiguration } from './../../../../scanner/meaningful-sequence-rule';

describe('meaningful sequence', () => {
    describe('verify meaningful sequence configs', () => {
        it('should have correct props', () => {
            expect(meaningfulSequenceConfiguration.rule.id).toBe('meaningful-sequence');
            expect(meaningfulSequenceConfiguration.rule.selector).toBe('*');
            expect(meaningfulSequenceConfiguration.rule.any[0]).toBe('meaningful-sequence');
            expect(meaningfulSequenceConfiguration.rule.any.length).toBe(1);
            expect(meaningfulSequenceConfiguration.checks[0].id).toBe('meaningful-sequence');
            expect(meaningfulSequenceConfiguration.checks[0].evaluate(null, null, null, null)).toBe(true);
        });
    });

    describe('verify evaluate', () => {
        const windowMock = GlobalMock.ofInstance(window.getComputedStyle, 'getComputedStyle', window, MockBehavior.Strict);

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

        let result;
        GlobalScope.using(windowMock).with(() => {
            result = meaningfulSequenceConfiguration.rule.matches(node, null);
        });
        expect(result).toBe(expectedResult);
    }
});
