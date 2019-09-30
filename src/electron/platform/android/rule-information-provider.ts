// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { RuleInformation } from './rule-information';
import { RuleResultsData } from './scan-results';

export class RuleInformationProvider {
    private supportedRules: RuleInformation[];

    constructor() {
        this.supportedRules = [];
        this.supportedRules.push(
            new RuleInformation(
                'ColorContrast',
                'Text elements must have sufficient contrast against the background.',
                this.getColorContrastHowToFix,
            ),
        );
        this.supportedRules.push(
            new RuleInformation('TouchSizeWcag', 'Touch inputs must have a sufficient target size.', this.getTouchSizeHowToFix),
        );
        this.supportedRules.push(
            new RuleInformation(
                'ActiveViewName',
                "Active views must have a name that's available to assistive technologies.",
                () =>
                    'The view is active but has no name available to assistive technologies. Provide a name for the view using its contentDescription, hint, labelFor, or text attribute (depending on the view type)',
            ),
        );
        this.supportedRules.push(
            new RuleInformation(
                'ImageViewName',
                'Meaningful images must have alternate text.',
                () =>
                    'The image has no alternate text and is not identified as decorative. If the image conveys meaningful content, provide alternate text using the contentDescription attribute. If the image is decorative, give it an empty contentDescription, or set its isImportantForAccessibility attribute to false.',
            ),
        );
        this.supportedRules.push(
            new RuleInformation(
                'EditTextValue',
                'EditText elements must expose their entered text value to assistive technologies',
                () =>
                    "The element's contentDescription overrides the text value required by assistive technologies. Remove the element’s contentDescription attribute.",
            ),
        );
    }

    private getColorContrastHowToFix(ruleResultsData: RuleResultsData): string {
        const ratio = ruleResultsData.props['Color Contrast Ratio'] as string;
        const foreground = (ruleResultsData.props['Foreground Color'] as string).substring(2);
        const background = (ruleResultsData.props['Background Color'] as string).substring(2);

        return `The text element has insufficient contrast of ${ratio}. Foreground color: #${foreground}, background color: #${background}). Modify the text foreground and/or background colors to provide a contrast ratio of at least 4.5:1 for regular text, or 3:1 for large text (at least 18pt, or 14pt+bold).`;
    }

    private getTouchSizeHowToFix(ruleResultsData: RuleResultsData): string {
        const dpi = ruleResultsData.props['Screen Dots Per Inch'] as number;
        const physicalWidth = ruleResultsData.props['width'] as number;
        const physicalHeight = ruleResultsData.props['height'] as number;
        const logicalWidth = physicalWidth / dpi;
        const logicalHeight = physicalHeight / dpi;

        return `The element has an insufficient target size (width: ${logicalWidth}dp, height: ${logicalHeight}dp). Set the element's minWidth and minHeight attributes to at least 48dp.`;
    }

    public getRuleInformation(ruleId: string): RuleInformation {
        for (const ruleInformation of this.supportedRules) {
            if (ruleId === ruleInformation.ruleId) {
                return ruleInformation;
            }
        }

        return null;
    }
}
