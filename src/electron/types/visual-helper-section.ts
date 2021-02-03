// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ReactFCWithDisplayName } from 'common/react/named-fc';
import { ScreenshotViewProps } from 'electron/views/screenshot/screenshot-view';

export type VisualHelperSectionProps = ScreenshotViewProps;

export type VisualHelperSection = ReactFCWithDisplayName<VisualHelperSectionProps>;
