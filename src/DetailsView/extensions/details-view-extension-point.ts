// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createCallChainExtensionPoint } from '../../common/extensibility/extension-point';
import { IAssessmentViewProps } from '../components/assessment-view';

const defaultComponent = {
    onAssessmentViewUpdate: (prevProps: IAssessmentViewProps, curProps: IAssessmentViewProps) => {},
};

export const detailsViewExtensionPoint = createCallChainExtensionPoint('detailsViewExtensionPoint', defaultComponent);
