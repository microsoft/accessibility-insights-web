// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { StartOverButtonSettings as StartOverButtonSettings } from 'electron/types/content-page-info';
import { ReflowCommandBarProps } from 'electron/views/results/components/reflow-command-bar';

export const tabStopsStartOverButtonSettings = (
    props: ReflowCommandBarProps,
): StartOverButtonSettings => {
    return {
        onClick: props.deps.tabStopsActionCreator.startOver,
        disabled: false,
    };
};
