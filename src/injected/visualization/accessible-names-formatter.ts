// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FormattedCheckResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { DialogRenderer } from 'injected/dialog-renderer';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerConfiguration, Formatter } from 'injected/visualization/formatter';
import { HeadingStyleConfiguration } from 'injected/visualization/heading-formatter';
interface DisplayAccessibleNameData {
    accessibleName: string;
}
export class AccessibleNamesFormatter implements Formatter {
    public getDialogRenderer(): DialogRenderer {
        return null;
    }

    public static style: HeadingStyleConfiguration = {
        borderColor: '#8D4DFF',
        fontColor: '#FFFFFF',
    };

    public getData(nodes: FormattedCheckResult[]) {
        for (const check of nodes) {
            if (check.id === 'display-accessible-names') {
                return {
                    accessibleName: check.data.accessibleName,
                };
            }
        }
    }

    private getInfo(data: HtmlElementAxeResults): DisplayAccessibleNameData {
        for (const idx in data.ruleResults) {
            if (data.ruleResults[idx].ruleId === 'display-accessible-names') {
                return this.getData(data.ruleResults[idx].any);
            }
        }
        return undefined;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const accessibleNameToDisplay = this.formatText(this.getInfo(data));
        const config: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: AccessibleNamesFormatter.style.fontColor,
                background: AccessibleNamesFormatter.style.borderColor,
                text: accessibleNameToDisplay?.accessibleName,
                fontWeight: '400',
                fontSize: '10px',
                outline: '3px dashed',
            },
            borderColor: AccessibleNamesFormatter.style.borderColor,
            outlineStyle: 'dashed',
            outlineWidth: '3px',
            showVisualization: true,
        };
        return config;
    }

    private formatText(accessibleNameData: DisplayAccessibleNameData): DisplayAccessibleNameData {
        const ElmtAccessibleName = accessibleNameData?.accessibleName;
        let nameToDisplay;
        const allowedNameMaxLength = 40;
        if (ElmtAccessibleName === undefined) {
            nameToDisplay = undefined;
        } else {
            if (ElmtAccessibleName.length <= allowedNameMaxLength) {
                nameToDisplay = ElmtAccessibleName;
            } else if (ElmtAccessibleName.length > allowedNameMaxLength) {
                nameToDisplay = `${ElmtAccessibleName.substring(0, allowedNameMaxLength)}...`;
            }
        }
        return {
            accessibleName: nameToDisplay,
        };
    }
}
