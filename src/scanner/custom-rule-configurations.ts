// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { headersAttributeRuleConfiguration } from 'scanner/custom-rules/headers-attribute-rule';
import { autocompleteRuleConfiguration } from './custom-rules/autocomplete-rule';
import { colorConfiguration } from './custom-rules/color-rule';
import { cssContentConfiguration } from './custom-rules/css-content-rule';
import { cssPositioningConfiguration } from './custom-rules/css-positioning-rule';
import { cuesConfiguration } from './custom-rules/cues-rule';
import { customWidgetConfiguration } from './custom-rules/custom-widget';
import { frameTitleConfiguration } from './custom-rules/frame-title';
import { headerRuleConfiguration } from './custom-rules/header-rule';
import { headingConfiguration } from './custom-rules/heading-rule';
import { imageConfiguration } from './custom-rules/image-rule';
import { linkFunctionConfiguration } from './custom-rules/link-function';
import { linkPurposeConfiguration } from './custom-rules/link-purpose';
import { nativeWidgetsDefaultConfiguration } from './custom-rules/native-widgets-default';
import { pageConfiguration } from './custom-rules/page-title';
import { textAlternativeConfiguration } from './custom-rules/text-alternative';
import { textContrastConfiguration } from './custom-rules/text-contrast';
import { textSpacingConfiguration } from './custom-rules/text-spacing-rule';
import { uniqueLandmarkConfiguration } from './custom-rules/unique-landmark';
import { widgetFunctionConfiguration } from './custom-rules/widget-function';
import { RuleConfiguration } from './iruleresults';

export const configuration: RuleConfiguration[] = [
    headingConfiguration,
    colorConfiguration,
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
    autocompleteRuleConfiguration,
    headerRuleConfiguration,
    textSpacingConfiguration,
    headersAttributeRuleConfiguration,
];
