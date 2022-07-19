// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import {
    AssessmentIframeWarning,
    AssessmentIframeWarningDeps,
    AssessmentIframeWarningProps,
    FastPassIframeWarning,
    FastPassIframeWarningDeps,
    FastPassIframeWarningProps,
} from 'DetailsView/components/iframe-warning';

export type ScanIncompleteWarningMessageBarProps =
    | FastPassIframeWarningProps
    | AssessmentIframeWarningProps;
export type ScanIncompleteWarningMessageBarDeps =
    | FastPassIframeWarningDeps
    | AssessmentIframeWarningDeps;

export type WarningConfiguration = {
    [key in ScanIncompleteWarningId]: ReactFCWithDisplayName<ScanIncompleteWarningMessageBarProps>;
};

export const assessmentWarningConfiguration: WarningConfiguration = {
    'missing-required-cross-origin-permissions': AssessmentIframeWarning,
};

export const fastpassWarningConfiguration: WarningConfiguration = {
    'missing-required-cross-origin-permissions': FastPassIframeWarning,
};
