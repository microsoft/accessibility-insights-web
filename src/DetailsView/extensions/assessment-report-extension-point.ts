// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createCallChainExtensionPoint } from '../../common/extensibility/extension-point';
import { RequirementReportModel } from '../reports/assessment-report-model';

const defaultComponent = {
    alterRequirementReportModel: (model: RequirementReportModel) => {},
};

export const assessmentReportExtensionPoint = createCallChainExtensionPoint('assessmentReportExtensionPoint', defaultComponent);
