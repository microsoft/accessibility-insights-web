// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScreenshotViewProps } from 'electron/views/screenshot/screenshot-view';
import { VirtualKeyboardViewProps } from 'electron/views/virtual-keyboard/virtual-keyboard-view';

export type VisualHelperSectionProps = ScreenshotViewProps & VirtualKeyboardViewProps;

export type VisualHelperSection = ReactFCWithDisplayName<VisualHelperSectionProps>;
