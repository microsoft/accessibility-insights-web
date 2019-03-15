// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IRequirementReportModel } from '../reports/assessment-report-model';
import { assessmentReportExtensionPoint } from './assessment-report-extension-point';

function alterRequirementReportModel(model: IRequirementReportModel): void {
    model.showPassingInstances = false;
}

export const excludePassingInstancesFromAssessmentReport = assessmentReportExtensionPoint.define({
    alterRequirementReportModel,
});
