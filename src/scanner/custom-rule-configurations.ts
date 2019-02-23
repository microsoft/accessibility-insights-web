// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { colorConfiguration } from './color-rule';
import { cssPositioningConfiguration } from './css-positioning-rule';
import { cuesConfiguration } from './cues-rule';
import { customWidgetConfiguration } from './custom-widget';
import { frameTitleConfiguration } from './frame-title';
import { headingConfiguration } from './heading-rule';
import { imageConfiguration } from './image-rule';
import { RuleConfiguration } from './iruleresults';
import { landmarkConfiguration } from './landmark-rule';
import { linkFunctionConfiguration } from './link-function';
import { linkPurposeConfiguration } from './link-purpose';
import { nativeWidgetsDefaultConfiguration } from './native-widgets-default';
import { pageConfiguration } from './page-title';
import { textAlternativeConfiguration } from './text-alternative';
import { textContrastConfiguration } from './text-contrast';
import { uniqueLandmarkConfiguration } from './unique-landmark';
import { widgetFunctionConfiguration } from './widget-function';
import { cssContentConfiguration } from './css-content-rule';

export const configuration: RuleConfiguration[] = [
    headingConfiguration,
    colorConfiguration,
    landmarkConfiguration,
    uniqueLandmarkConfiguration,
    imageConfiguration,
    textAlternativeConfiguration,
    textContrastConfiguration,
    linkPurposeConfiguration,
    linkFunctionConfiguration,
    frameTitleConfiguration,
    pageConfiguration,
    widgetFunctionConfiguration,
    nativeWidgetsDefaultConfiguration,
    cuesConfiguration,
    customWidgetConfiguration,
    cssPositioningConfiguration,
    cssContentConfiguration,
];
