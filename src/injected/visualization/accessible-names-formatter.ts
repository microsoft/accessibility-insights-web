// Copyright (c) Microsoft Corporation. All rights reserved.
import {
    FormattedCheckResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { DialogRenderer } from 'injected/dialog-renderer';
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { DrawerConfiguration, Formatter } from 'injected/visualization/formatter';
import { HeadingStyleConfiguration } from 'injected/visualization/heading-formatter';

// Licensed under the MIT License.
interface AccessibleNameData {
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

    // get the dat from the check results
    public getData(nodes: FormattedCheckResult[]) {
        for (const check of nodes) {
            console.log(check);
            if (check?.id === 'display-accessible-names') {
                console.log('Access Name of node');
                console.log(check.data.accessibleName);
                return {
                    accessibleName: check.data.accessibleName,
                };
            }
        }
    }

    private getInfo(data: HtmlElementAxeResults): AccessibleNameData {
        for (const idx in data.ruleResults) {
            if (data.ruleResults[idx].ruleId === 'display-accessible-names') {
                // console.log('InGetInfo');
                return this.getData(data.ruleResults[idx].any); // returns something of the form {accessibleName: "Profile"}
            }
        }
        return undefined;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const accessName = this.formatText(this.getInfo(data)); // returns something of the form {accessibleName: "Profile"}
        const config: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: AccessibleNamesFormatter.style.fontColor,
                background: AccessibleNamesFormatter.style.borderColor,
                text: accessName.accessibleName,
                fontWeight: '400',
                fontSize: '10pt',
                outline: '3px dashed',
            },
            borderColor: AccessibleNamesFormatter.style.borderColor,
            outlineStyle: 'dashed',
            outlineWidth: '3px',
            showVisualization: true,
        };
        //console.log(config);
        return config;
    }

    private formatText(accessiblenameData: AccessibleNameData): AccessibleNameData {
        if (accessiblenameData == null) {
            return null;
        }
        let nameToDisplay;
        if (
            accessiblenameData.accessibleName != null &&
            accessiblenameData.accessibleName.length <= 40
        ) {
            nameToDisplay = accessiblenameData.accessibleName;
        } else if (accessiblenameData.accessibleName.length > 40) {
            nameToDisplay = `${accessiblenameData.accessibleName}...`;
        }
        return {
            accessibleName: nameToDisplay,
        };
    }
}
