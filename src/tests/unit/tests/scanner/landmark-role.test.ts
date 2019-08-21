// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { landmarkConfiguration } from '../../../../scanner/custom-rules/landmark-rule';

describe('landmarkRule', () => {
    describe('verify landmark configs', () => {
        it('should have correct props', () => {
            expect(landmarkConfiguration.rule.id).toBe('main-landmark');
            expect(landmarkConfiguration.rule.selector).toBe('[role=main], main');
            expect(landmarkConfiguration.rule.any[0]).toBe('unique-landmark');
            expect(landmarkConfiguration.checks.length).toBe(0);
        });
    });
});
