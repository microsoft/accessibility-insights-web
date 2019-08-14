// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DictionaryStringTo } from '../types/common-types';

interface ScanResults {
    errorCount: number;
    errors: ScanResult[];
    // omitting outputFile as we might not need that
}

interface ScanResult {
    ruleInformation: RuleInfo;
    elementInformation: ElementInfo;
}

interface RuleInfo {
    id: RuleIDEnum; // todo: think about expanding this better
    description: string;
    howToFix: string;
    propertyID: number; // This property is used to link elements with rule violations to relevant documentation.
    condition: string; // not sure about this one
}

interface ElementInfo {
    elementPropertyBag: DictionaryStringTo<string>; // key is a UI Automation property name and the value is the corresponding UI Automation property value.
    patterns: string[];
}

enum RuleIDEnum {}

/** Axe Android */

interface AndroidScanResult {
    // axeConfigurationInfo: AxeAndroidConf; - not sure about this one if its needed or not
    axeContextInfo: AxeContext;
    axeRuleResults: AxeRuleResults[];
}

interface AxeContext {
    deviceInformation: AxeDevice;
    viewInformation: AxeView;
    screenshot: Blob;
}

interface AxeDevice {
    dpi: number;
    name: string;
    osVersion: string;
    screenHeight: number;
    screenWidth: number;
}

interface AxeView {
    viewId: number;
    className: string;
    contentDescription: string;
    isAccessibilityFocusable: boolean;
    isClickable: boolean;
    isEnabled: boolean;
    isImportantForAccessibility: boolean;
    labeledBy: string;
    text: string;
    boundsInScreen: AxeBoundInfo;
    children: AxeView[];
}

interface AxeBoundInfo {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

interface AxeRuleResults {
    axeViewId: number;
    propertyBags: AxeRuleResultProps;
    ruleId: string;
    ruleSummary: string;
    status: string;
}

enum AndroidPropertyBagNames {
    CLASS_NAME = 'className',
    CONTENT_DESCRIPTION = 'contentDescription',
    DPI = 'Screen Dots Per Inch',
    FRAME = 'boundsInScreen',
    HEIGHT = 'height',
    IMPORTANT = 'isImportantForAccessibility',
    IS_CLICKABLE = 'isActive',
    IS_ENABLED = 'isEnabled',
    LABELED_BY = 'labeledBy',
    SPEAKABLE_TEXT = 'Speakable Text',
    WIDTH = 'width',
    EXCEPTION = 'Exception',
    STACK_TRACE = 'Stack Trace',
    EVENT_STREAM = 'Applicable Event Stream',
    ACCESSIBILITY_EVENT = 'AccessibilityEvent',
    IS_TOUCH_STARTED = 'Touch Interaction Started',
    IS_FOCUS_CHANGE_OK = 'Is Focus Change Acceptable',
    IS_TOUCH_EXPLORATION_GESTURE = 'Touch Exploration Started',
    VISIBLE_TEXT = 'Visible Text',
    COLOR_FOREGROUND = 'Foreground Color',
    COLOR_BACKGROUND = 'Background Color',
    COLOR_CONTRAST = 'Color Contrast Ratio',
    CONFIDENCE = 'Confidence in Color Detection',
    SCREEN_HEIGHT = 'Screen Height',
    SCREEN_WIDTH = 'Screen Width',
}

type AxeRuleResultProps = { [key in AndroidPropertyBagNames]: string };
