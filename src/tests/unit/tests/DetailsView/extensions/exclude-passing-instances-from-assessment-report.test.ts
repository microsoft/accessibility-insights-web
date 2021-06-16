// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RequirementReportModel } from 'reports/assessment-report-model';
import { excludePassingInstancesFromAssessmentReport } from '../../../../../DetailsView/extensions/exclude-passing-instances-from-assessment-report';

describe('excludePassingInstancesFromAssessmentReport', () => {
    function makeModel(showPassingInstances): RequirementReportModel {
        return {
            showPassingInstances,
        } as Partial<RequirementReportModel> as RequirementReportModel;
    }

    it('changes showPassingInstances from true to false', () => {
        const model = makeModel(true);
        excludePassingInstancesFromAssessmentReport.component.alterRequirementReportModel(model);
        expect(model.showPassingInstances).toEqual(false);
    });

    it('does not change showPassingInstances if already false', () => {
        const model = makeModel(false);
        excludePassingInstancesFromAssessmentReport.component.alterRequirementReportModel(model);
        expect(model.showPassingInstances).toEqual(false);
    });
});
