// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { RequirementReportModel } from 'reports/assessment-report-model';
import { createCallChainExtensionPoint } from '../../common/extensibility/extension-point';

const defaultComponent = {
    alterRequirementReportModel: (model: RequirementReportModel) => {},
};

export const assessmentReportExtensionPoint = createCallChainExtensionPoint(
    'assessmentReportExtensionPoint',
    defaultComponent,
);
