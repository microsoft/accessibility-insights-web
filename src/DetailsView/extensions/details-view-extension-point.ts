// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createCallChainExtensionPoint } from '../../common/extensibility/extension-point';
import { AssessmentViewProps } from '../components/assessment-view';

const defaultComponent = {
    onAssessmentViewUpdate: (
        prevProps: AssessmentViewProps,
        curProps: AssessmentViewProps,
    ) => {},
};

export const detailsViewExtensionPoint = createCallChainExtensionPoint(
    'detailsViewExtensionPoint',
    defaultComponent,
);
