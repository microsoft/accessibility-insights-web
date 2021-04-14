// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScreenshotViewProps } from 'electron/views/screenshot/screenshot-view';
import {
    VirtualKeyboardViewProps,
    VirtualKeyboardViewDeps,
} from 'electron/views/tab-stops/virtual-keyboard-view';

export type VisualHelperSectionProps = ScreenshotViewProps &
    VirtualKeyboardViewProps & {
        deps: VirtualKeyboardViewDeps;
    };

export type VisualHelperSectionDeps = VirtualKeyboardViewDeps;

export type VisualHelperSection = ReactFCWithDisplayName<VisualHelperSectionProps>;
