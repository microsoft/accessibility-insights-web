// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ScanStatus } from 'electron/flux/types/scan-status';
import { StartOverButtonSettings as StartOverButtonSettings } from 'electron/types/content-page-info';
import { ReflowCommandBarProps } from 'electron/views/results/components/reflow-command-bar';

export const sharedScanResultsStartOverButtonSettings = (
    props: ReflowCommandBarProps,
): StartOverButtonSettings => {
    return {
        onClick: () => props.deps.scanActionCreator.scan(props.scanPort),
        disabled: props.scanStoreData.status === ScanStatus.Scanning,
    };
};
