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
            ClassNameCheck: new RuleInformation(
                'ClassNameCheck',
                `${this.ruleLinkBaseUrl}/unsupported-item-type/`,
                'View objects must have valid UI class names.',
                [link.WCAG_4_1_2],
                () => ({
                    howToFixSummary:
                        "Provide a className value within the element's AccessibilityNodeInfo that: 1. Closely describes the element's function, 2. Matches a class that extends android.view.View, 3. Is provided with the Android SDK or support libraries, and 4. Is as far down Android's class hierarchy as possible.",
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/ClassNameCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            ClickableSpanCheck: new RuleInformation(
                'ClickableSpanCheck',
                `${this.ruleLinkBaseUrl}/link-purpose-unclear/`,
                "A TextView widget must not contain ClickableSpan objects that aren't URLSpans with absolute URLs.",
                [link.WCAG_2_4_4, link.WCAG_4_1_2],
                () => ({
                    howToFixSummary:
                        'Implement the link using URLSpan or Linkify. If you use URLSpan, provide a non-null absolute URL (such as https://example.com/page.html), not a relative URL (such as /page.html).',
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/ClickableSpanCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            DuplicateClickableBoundsCheck: new RuleInformation(
                'DuplicateClickableBoundsCheck',
                `${this.ruleLinkBaseUrl}/duplicate-clickable-views/`,
                'Clickable View objects must not have identical boundaries.',
                [link.WCAG_4_1_2],
                () => ({
                    howToFixSummary:
                        'When clickable Views are nested, implement click handling so that only one View handles clicks for any single action. If a View that is clickable by default (such as a button) is not intended to be clickable, remove its OnClickListener, or set android:clickable="false".',
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/DuplicateClickableBoundsCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            DuplicateSpeakableTextCheck: new RuleInformation(
                'DuplicateSpeakableTextCheck',
                `${this.ruleLinkBaseUrl}/duplicate-descriptions/`,
                'Clickable View objects that do not perform the same function must not have the same speakable text.',
                [link.WCAG_4_1_2],
                () => ({
                    howToFixSummary:
                        'If clickable View objects perform the same function, they can have the same speakable text; no changes are needed. If two or more clickable View objects perform different functions, give them unique speakable text.',
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/DuplicateSpeakableTextCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            LinkPurposeUnclearCheck: new RuleInformation(
                'LinkPurposeUnclearCheck',
                `${this.ruleLinkBaseUrl}/link-purpose-unclear/`,
                "A link's purpose must be described by the link text alone, or by the link text together with the preceding page content.",
                [link.WCAG_2_4_4],
                () => ({
                    howToFixSummary:
                        'Describe the unique purpose of the link using any of the following: Good: Programmatically related context, or Better: Accessible name and/or accessible description, or Best: Link text',
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/LinkPurposeUnclearCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            RedundantDescriptionCheck: new RuleInformation(
                'RedundantDescriptionCheck',
                `${this.ruleLinkBaseUrl}/redundant-description/`,
                "A View object's description must not include its role, state, or available actions.",
                [link.WCAG_4_1_2],
                () => ({
                    howToFixSummary:
                        "Don't include an element's role (type), state, or available actions in the following attributes: android:contentDescription, android:text, android:hint.",
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/RedundantDescriptionCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            TextContrastCheck: new RuleInformation(
                'TextContrastCheck',
                `${this.ruleLinkBaseUrl}/color-contrast/`,
                'Text elements must have sufficient contrast against the background.',
                [link.WCAG_1_4_3],
                () => ({
                    howToFixSummary: `If the text is intended to be invisible, it passes. If the text is intended to be visible, use Accessibility Insights for Windows (or the Colour Contrast Analyzer if you're testing on a Mac) to manually verify that it has sufficient contrast compared to the background. If the background is an image or gradient, test an area where contrast appears to be lowest.`,
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/TextContrastCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            TraversalOrderCheck: new RuleInformation(
                'TraversalOrderCheck',
                `${this.ruleLinkBaseUrl}/traversal-order/`,
                'The accessibility traversal order must not include loops or traps.',
                [link.WCAG_2_4_3],
                () => ({
                    howToFixSummary:
                        "Good: If the app's view hierarchy doesn't create a logical traversal order with attributes. Better: Restructure the view hierarchy to create a logical traversal order that doesn't require attributes.",
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/TraversalOrderCheck',
                    },
                }),
                this.getStandardResultStatus,
            ),
            ImageContrastCheck: new RuleInformation(
                'ImageContrastCheck',
                `${this.ruleLinkBaseUrl}/image-contrast/`,
                'Meaningful graphics must have sufficient contrast.',
                [link.WCAG_1_4_11],
                () => ({
                    howToFixSummary: `Make sure the meaningful elements in a graphic have a contrast ratio ≥ 3:1.`,
                    richResolution: {
                        labelType: 'check',
                        contentId: 'android/atfa/ImageContrastCheck',
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
                return 'unknown';
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
