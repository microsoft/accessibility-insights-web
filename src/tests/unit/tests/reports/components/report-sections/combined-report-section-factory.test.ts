// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CombinedReportSectionFactory } from 'reports/components/report-sections/combined-report-section-factory';
import { IncompleteChecksSection } from 'reports/components/report-sections/incomplete-checks-section';

describe('CombinedReportSectionFactory', () => {
    it("should include 'incomplete' in resultSectionsOrder", () => {
        expect(CombinedReportSectionFactory.resultSectionsOrder).toContain('incomplete');
    });
});