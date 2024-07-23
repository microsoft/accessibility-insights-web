// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HtmlElementAxeResults } from 'common/types/store-data/visualization-scan-result-data';
import { DialogRenderer } from 'injected/dialog-renderer';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerConfiguration, Formatter } from 'injected/visualization/formatter';
import { HeadingStyleConfiguration } from 'injected/visualization/heading-formatter';

export class AccessibleNamesFormatter implements Formatter {
    public getDialogRenderer(): DialogRenderer | null {
        return null;
    }

    public static style: HeadingStyleConfiguration = {
        outlineColor: '#8D4DFF',
        fontColor: '#FFFFFF',
    };

    private accessibleNameFromCheck(data: HtmlElementAxeResults | null): string | null {
        const ruleResult = data?.ruleResults['display-accessible-names'];
        const checkResult = ruleResult?.any?.find(check => check.id === 'display-accessible-names');

        return checkResult?.data?.accessibleName ?? null;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance | null,
    ): DrawerConfiguration {
        const accessibleName = this.accessibleNameFromCheck(data);
        if (accessibleName == null) {
            return { showVisualization: false };
        }

        const formattedAccessibleName = this.formatAccessibleName(accessibleName);
        const config: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: AccessibleNamesFormatter.style.fontColor,
                background: AccessibleNamesFormatter.style.outlineColor,
                text: formattedAccessibleName,
                fontWeight: '400',
                fontSize: '10px',
            },
            outlineColor: AccessibleNamesFormatter.style.outlineColor,
            outlineStyle: 'dashed',
            showVisualization: true,
        };
        return config;
    }

    private formatAccessibleName(accessibleName: string): string {
        const allowedNameMaxLength = 40;
        if (accessibleName.length <= allowedNameMaxLength) {
            return accessibleName;
        } else {
            return `${accessibleName.substring(0, allowedNameMaxLength)}...`;
        }
    }
}
