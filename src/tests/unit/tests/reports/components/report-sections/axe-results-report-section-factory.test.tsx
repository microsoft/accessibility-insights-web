import { AxeResultsReportSectionFactory } from 'reports/components/report-sections/axe-results-report-section-factory';
import { IncompleteChecksSection } from 'reports/components/report-sections/incomplete-checks-section';

describe('AxeResultsReportSectionFactory', () => {
    it("should include 'incomplete' in resultSectionsOrder in the correct order", () => {
        expect(AxeResultsReportSectionFactory.resultSectionsOrder).toEqual([
            'failed',
            'passed',
            'incomplete',
            'notApplicable',
        ]);
    });

    it('should have IncompleteChecksSection present', () => {
        expect(AxeResultsReportSectionFactory.IncompleteChecksSection).toBe(IncompleteChecksSection);
    });
});