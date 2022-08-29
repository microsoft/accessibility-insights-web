// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { doesResultHaveMainRole } from 'assessments/landmarks/does-result-have-main-role';
import {
    DecoratedAxeNodeResult,
    FormattedCheckResult,
} from 'common/types/store-data/visualization-scan-result-data';

describe('doesResultHaveMainRole', () => {
    it('returns false for results with no check results', () => {
        const input = { any: [], all: [] } as DecoratedAxeNodeResult;

        expect(doesResultHaveMainRole(input)).toBe(false);
    });

    it('returns false for results with check results without role data', () => {
        const input = {
            any: [makeCheckResultWithRole(undefined)],
            all: [makeCheckResultWithRole(undefined)],
        } as DecoratedAxeNodeResult;

        expect(doesResultHaveMainRole(input)).toBe(false);
    });

    it('returns false for results with check results with only non-main role data', () => {
        const input = {
            any: [makeCheckResultWithRole('complementary')],
            all: [makeCheckResultWithRole('banner')],
        } as DecoratedAxeNodeResult;

        expect(doesResultHaveMainRole(input)).toBe(false);
    });

    it('returns true for results with an "any" check result with "main" role data', () => {
        const input = {
            any: [makeCheckResultWithRole('main')],
            all: [],
        } as DecoratedAxeNodeResult;

        expect(doesResultHaveMainRole(input)).toBe(true);
    });

    it('returns true for results with an "all" check result with "main" role data', () => {
        const input = {
            any: [],
            all: [makeCheckResultWithRole('main')],
        } as DecoratedAxeNodeResult;

        expect(doesResultHaveMainRole(input)).toBe(true);
    });

    it('returns true for results with mixed check results', () => {
        const input = {
            any: [makeCheckResultWithRole('banner'), makeCheckResultWithRole(undefined)],
            all: [
                makeCheckResultWithRole('main'),
                makeCheckResultWithRole('banner'),
                makeCheckResultWithRole(undefined),
            ],
        } as DecoratedAxeNodeResult;

        expect(doesResultHaveMainRole(input)).toBe(true);
    });

    function makeCheckResultWithRole(role: string): FormattedCheckResult {
        return {
            id: 'test-check-id',
            message: 'test check message',
            data: {
                role,
            },
        };
    }
});
