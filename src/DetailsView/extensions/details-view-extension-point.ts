// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    createCallChainExtensionPoint,
    ExtensionPoint,
} from '../../common/extensibility/extension-point';
import { AssessmentViewProps } from '../components/assessment-view';

const defaultComponent = {
    onAssessmentViewUpdate: (prevProps: AssessmentViewProps, curProps: AssessmentViewProps) => {},
};

export type DetailsViewExtensionPoint = ExtensionPoint<
    'CallChain',
    'detailsViewExtensionPoint',
    typeof defaultComponent,
    typeof defaultComponent
>;

export const detailsViewExtensionPoint: DetailsViewExtensionPoint = createCallChainExtensionPoint(
    'detailsViewExtensionPoint',
    defaultComponent,
);
