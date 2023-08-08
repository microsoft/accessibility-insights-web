// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScanIncompleteWarningId } from 'common/types/store-data/scan-incomplete-warnings';
import { IframeSkippedWarning } from 'DetailsView/components/iframe-skipped-warning';
import {
    AssessmentIframeWarning,
    AssessmentIframeWarningDeps,
    AssessmentIframeWarningProps,
    FastPassIframeWarning,
    FastPassIframeWarningDeps,
    FastPassIframeWarningProps,
    QuickAssessIframeWarning,
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
    'frame-skipped': IframeSkippedWarning,
};

export const fastpassWarningConfiguration: WarningConfiguration = {
    'missing-required-cross-origin-permissions': FastPassIframeWarning,
    'frame-skipped': IframeSkippedWarning,
};

export const quickAssessWarningConfiguration: WarningConfiguration = {
    'missing-required-cross-origin-permissions': QuickAssessIframeWarning,
};
