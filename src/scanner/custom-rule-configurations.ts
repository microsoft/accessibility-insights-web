// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { textContrastConfiguration } from './text-contrast';
import { textAlternativeConfiguration } from './text-alternative';
import { colorConfiguration } from './color-rule';
import { headingConfiguration } from './heading-rule';
import { RuleConfiguration } from './iruleresults';
import { uniqueLandmarkConfiguration } from './unique-landmark';
import { imageConfiguration } from './image-rule';
import { landmarkConfiguration } from './landmark-rule';
import { linkPurposeConfiguration } from './link-purpose';
import { linkFunctionConfiguration } from './link-function';
import { frameTitleConfiguration } from './frame-title';
import { pageConfiguration } from './page-title';
import { widgetFunctionConfiguration } from './widget-function';
import { nativeWidgetsDefaultConfiguration } from './native-widgets-default';
import { cuesConfiguration } from './cues-rule';
import { customWidgetConfiguration } from './custom-widget';

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
];
