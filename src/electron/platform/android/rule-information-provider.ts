// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InstanceResultStatus,
    UnifiedResolution,
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
                () => ({
                    howToFixSummary: `If the text is intended to be invisible, it passes. If the text is intended to be visible, use Accessibility Insights for Windows (or the Colour Contrast Analyzer if you're testing on a Mac) to manually verify that it has sufficient contrast compared to the background. If the background is an image or gradient, test an area where contrast appears to be lowest.`,
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/ColorContrast',
                    },
                }),
                this.getColorContrastResultStatus,
            ),
            TouchSizeWcag: new RuleInformation(
                'TouchSizeWcag',
                `${this.ruleLinkBaseUrl}/touch-size-wcag/`,
                'Touch inputs must have a sufficient target size.',
                [link.WCAG_2_5_5],
                this.getTouchSizeUnifiedResolution,
                this.getStandardResultStatus,
            ),
            ActiveViewName: new RuleInformation(
                'ActiveViewName',
                `${this.ruleLinkBaseUrl}/active-view-name/`,
                "Active views must have a name that's available to assistive technologies.",
                [link.WCAG_1_3_1, link.WCAG_3_3_2],
                () => ({
                    howToFixSummary:
                        'The view is active but has no name available to assistive technologies. Provide a name for the view using its contentDescription, hint, labelFor, or text attribute (depending on the view type)',
                    richResolution: {
                        labelType: 'fix',
                        contentId: 'android/ActiveViewName',
                    },
                }),
                this.getStandardResultStatus,
            ),
            ImageViewName: new RuleInformation(
                'ImageViewName',
                `${this.ruleLinkBaseUrl}/image-view-name/`,
                'Meaningful images must have alternate text.',
                [link.WCAG_1_1_1],
                () => ({
                    howToFixSummary:
                        'The image has no alternate text and is not identified as decorative. If the image conveys meaningful content, provide alternate text using the contentDescription attribute. If the image is decorative, give it an empty contentDescription, or set its isImportantForAccessibility attribute to false.',
                    richResolution: {
                        labelType: 'fix',
                        contentId: 'android/ImageViewName',
                    },
                }),
                this.getStandardResultStatus,
            ),
            EditTextValue: new RuleInformation(
                'EditTextValue',
                `${this.ruleLinkBaseUrl}/edit-text-value/`,
                'EditText elements must expose their entered text value to assistive technologies',
                [link.WCAG_4_1_2],
                () => ({
                    howToFixSummary:
                        "The element's contentDescription overrides the text value required by assistive technologies. Remove the element’s contentDescription attribute.",
                    richResolution: {
                        labelType: 'fix',
                        contentId: 'android/EditTextValue',
                    },
                }),
                this.getStandardResultStatus,
            ),
        };
    }

    private getTouchSizeUnifiedResolution = (
        ruleResultsData: RuleResultsData,
    ): UnifiedResolution => {
        const dpi: number = ruleResultsData.props['Screen Dots Per Inch'];
        const boundingRect = ruleResultsData.props['boundsInScreen'];
        const physicalWidth: number = boundingRect['right'] - boundingRect['left'];
        const physicalHeight: number = boundingRect['bottom'] - boundingRect['top'];
        const logicalWidth = this.floorTo3Decimal(physicalWidth / dpi).toString();
        const logicalHeight = this.floorTo3Decimal(physicalHeight / dpi).toString();

        return {
            howToFixSummary: `The element has an insufficient target size (width: ${logicalWidth}dp, height: ${logicalHeight}dp). Set the element's minWidth and minHeight attributes to at least 44dp.`,
            richResolution: {
                labelType: 'fix',
                contentId: 'android/TouchSizeWcag',
                contentVariables: {
                    logicalWidth,
                    logicalHeight,
                },
            },
        };
    };

    private getColorContrastResultStatus = (
        ruleResultsData: RuleResultsData,
    ): InstanceResultStatus => {
        if (
            ruleResultsData.status === 'FAIL' &&
            ruleResultsData.props['Confidence in Color Detection'] === 'High'
        )
            return 'unknown';

        return 'pass';
    };

    private getStandardResultStatus = (ruleResultsData: RuleResultsData): InstanceResultStatus => {
        switch (ruleResultsData.status) {
            case 'ERROR':
            case 'WARNING':
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
