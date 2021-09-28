// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { colorConfiguration, isInTopWindow } from '../../../../../scanner/custom-rules/color-rule';

describe('ColorRule', () => {
    describe('verify color configs', () => {
        it('should have correct props', () => {
            expect(colorConfiguration.checks[0].evaluate(null, null, null, null)).toBeTruthy();
            expect(colorConfiguration.checks[0].id).toBe('select-document');
            expect(colorConfiguration.rule.id).toBe('select-document');
            expect(colorConfiguration.rule.selector).toBe('*');
            expect(colorConfiguration.rule.any[0]).toBe('select-document');
        });
    });

    describe('verify color configs', () => {
        it('should only return for root frame', () => {
            const windowStub = {};
            windowStub['top'] = windowStub;
            expect(isInTopWindow(windowStub)).toBeTruthy();

            windowStub['top'] = null;
            expect(isInTopWindow(windowStub)).toBeFalsy();
        });
    });
});
