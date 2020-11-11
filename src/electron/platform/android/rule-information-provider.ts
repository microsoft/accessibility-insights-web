// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceResultStatus,
    UnifiedFormattableResolution,
} from 'common/types/store-data/unified-data-interface';
import { link } from 'content/link';
import { DictionaryStringTo } from 'types/common-types';

import { RuleResultsData } from './android-scan-results';
import { RuleInformation } from './rule-information';

export class RuleInformationProvider {
    private supportedRules: DictionaryStringTo<RuleInformation>;
    private readonly ruleLinkBaseUrl = 'https://accessibilityinsights.io/info-examples/android';
    constructor() {
        this.supportedRules = {
            ColorContrast: new RuleInformation(
                'ColorContrast',
                `${this.ruleLinkBaseUrl}/color-contrast/`,
                'Text elements must have sufficient contrast against the background.',
                [link.WCAG_1_4_3],
                this.getColorContrastUnifiedFormattableResolution,
                this.getColorContrastResultStatus,
            ),
            TouchSizeWcag: new RuleInformation(
                'TouchSizeWcag',
                `${this.ruleLinkBaseUrl}/touch-size-wcag/`,
                'Touch inputs must have a sufficient target size.',
                [link.WCAG_2_5_5],
                this.getTouchSizeUnifiedFormattableResolution,
                this.getStandardResultStatus,
            ),
            ActiveViewName: new RuleInformation(
                'ActiveViewName',
                `${this.ruleLinkBaseUrl}/active-view-name/`,
                "Active views must have a name that's available to assistive technologies.",
                [link.WCAG_1_3_1, link.WCAG_3_3_2],
                () =>
                    this.buildUnifiedFormattableResolution(
                        'The view is active but has no name available to assistive technologies. Provide a name for the view using its contentDescription, hint, labelFor, or text attribute (depending on the view type)',
                        ['contentDescription', 'hint', 'labelFor', 'text'],
                    ),
                this.getStandardResultStatus,
            ),
            ImageViewName: new RuleInformation(
                'ImageViewName',
                `${this.ruleLinkBaseUrl}/image-view-name/`,
                'Meaningful images must have alternate text.',
                [link.WCAG_1_1_1],
                () =>
                    this.buildUnifiedFormattableResolution(
                        'The image has no alternate text and is not identified as decorative. If the image conveys meaningful content, provide alternate text using the contentDescription attribute. If the image is decorative, give it an empty contentDescription, or set its isImportantForAccessibility attribute to false.',
                        ['contentDescription', 'isImportantForAccessibility'],
                    ),
                this.getStandardResultStatus,
            ),
            EditTextValue: new RuleInformation(
                'EditTextValue',
                `${this.ruleLinkBaseUrl}/edit-text-value/`,
                'EditText elements must expose their entered text value to assistive technologies',
                [link.WCAG_4_1_2],
                () =>
                    this.buildUnifiedFormattableResolution(
                        "The element's contentDescription overrides the text value required by assistive technologies. Remove the element’s contentDescription attribute.",
                        ['contentDescription'],
                    ),
                this.getStandardResultStatus,
            ),
        };
    }

    private getColorContrastUnifiedFormattableResolution = (
        ruleResultsData: RuleResultsData,
    ): UnifiedFormattableResolution => {
        const ratio = this.floorTo3Decimal(ruleResultsData.props['Color Contrast Ratio'] as number);
        const foreground = this.getColorValue(ruleResultsData, 'Foreground Color');
        const background = this.getColorValue(ruleResultsData, 'Background Color');

        return this.buildUnifiedFormattableResolution(
            `The text element has insufficient contrast of ${ratio}. Foreground color: ${foreground}, background color: ${background}). Modify the text foreground and/or background colors to provide a contrast ratio of at least 4.5:1 for regular text, or 3:1 for large text (at least 18pt, or 14pt+bold).`,
        );
    };

    private getColorValue(ruleResultsData: RuleResultsData, propertyName: string): string {
        let result = 'NO VALUE AVAILABLE';
        const value = ruleResultsData.props[propertyName] as string;

        const prefixSize = 2;
        if (value) {
            result = `#${value.substring(prefixSize)}`;
        }

        return result;
    }

    private getTouchSizeUnifiedFormattableResolution = (
        ruleResultsData: RuleResultsData,
    ): UnifiedFormattableResolution => {
        const dpi: number = ruleResultsData.props['Screen Dots Per Inch'];
        const boundingRect = ruleResultsData.props['boundsInScreen'];
        const physicalWidth: number = boundingRect['right'] - boundingRect['left'];
        const physicalHeight: number = boundingRect['bottom'] - boundingRect['top'];
        const logicalWidth = this.floorTo3Decimal(physicalWidth / dpi);
        const logicalHeight = this.floorTo3Decimal(physicalHeight / dpi);

        return this.buildUnifiedFormattableResolution(
            `The element has an insufficient target size (width: ${logicalWidth}dp, height: ${logicalHeight}dp). Set the element's minWidth and minHeight attributes to at least 44dp.`,
            ['minWidth', 'minHeight'],
        );
    };

    private buildUnifiedFormattableResolution(
        unformattedText: string,
        codeStrings: string[] = null,
    ): UnifiedFormattableResolution {
        return {
            howToFixSummary: unformattedText,
            howToFixFormat: { howToFix: unformattedText, formatAsCode: codeStrings },
        };
    }

    private getColorContrastResultStatus = (
        ruleResultsData: RuleResultsData,
    ): InstanceResultStatus => {
        if (
            ruleResultsData.status == 'FAIL' &&
            ruleResultsData.props['Confidence in Color Detection'] === 'High'
        )
            return 'unknown';

        return 'pass';
    };

    private getStandardResultStatus = (ruleResultsData: RuleResultsData): InstanceResultStatus => {
        switch (ruleResultsData.status) {
            case 'FAIL':
                return 'fail';
            default:
                return 'pass';
        }
    };

    public getRuleInformation(ruleId: string): RuleInformation {
        const ruleInfo = this.supportedRules[ruleId];
        return ruleInfo || null;
    }

    private floorTo3Decimal(num: number): number {
        return Math.floor(num * 1000) / 1000;
    }
}
