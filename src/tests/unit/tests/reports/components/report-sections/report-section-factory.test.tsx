// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultSectionTypes } from 'reports/components/report-sections/report-section-factory';

test('ResultSectionTypes includes incomplete', () => {
    expect(ResultSectionTypes.incomplete).toBe('IncompleteChecksSection');
});