// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createCallChainExtensionPoint } from '../../common/extensibility/extension-point';
import { IRequirementReportModel } from '../reports/assessment-report-model';

const defaultComponent = {
    alterRequirementReportModel: (model: IRequirementReportModel) => { },
};

export const assessmentReportExtensionPoint = createCallChainExtensionPoint('assessmentReportExtensionPoint', defaultComponent);
