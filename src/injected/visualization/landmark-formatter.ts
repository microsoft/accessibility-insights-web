// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FormattedCheckResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { DialogRenderer } from '../dialog-renderer';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';
import { HeadingStyleConfiguration } from './heading-formatter';

interface ElemData {
    role: string;
    label: string;
}

export class LandmarkFormatter extends FailureInstanceFormatter {
    private static readonly landmarkStyles: { [role: string]: HeadingStyleConfiguration } = {
        banner: {
            borderColor: '#d08311',
            fontColor: '#ffffff',
        },
        complementary: {
            borderColor: '#6b9d1a',
            fontColor: '#ffffff',
        },
        contentinfo: {
            borderColor: '#00a88c',
            fontColor: '#ffffff',
        },
        form: {
            borderColor: '#0298c7',
            fontColor: '#ffffff',
        },
        main: {
            borderColor: '#cb2e6d',
            fontColor: '#ffffff',
        },
        navigation: {
            borderColor: '#9b38e6',
            fontColor: '#ffffff',
        },
        region: {
            borderColor: '#2560e0',
            fontColor: '#ffffff',
        },
        search: {
            borderColor: '#d363d8',
            fontColor: '#ffffff',
        },
    };

    private static readonly invalidLandmarkStyle: HeadingStyleConfiguration = {
        borderColor: '#C00000',
        fontColor: '#FFFFFF',
    };

    public static getStyleForLandmarkRole(role: string): HeadingStyleConfiguration {
        return LandmarkFormatter.landmarkStyles[role] || LandmarkFormatter.invalidLandmarkStyle;
    }

    public getDialogRenderer(): DialogRenderer {
        return null;
    }

    public getDrawerConfiguration(
        element: Node,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        // parse down the IHtmlElementAxeResult to see if it is contained in the map
        const elemData = this.decorateLabelText(data.propertyBag || this.getLandmarkInfo(data));

        const style = LandmarkFormatter.getStyleForLandmarkRole(elemData.role);

        const drawerConfig: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: style.fontColor,
                background: style.borderColor,
                text: elemData.label,
                fontSize: '14pt !important',
                fontWeight: '600',
                outline: `3px dashed ${style.borderColor}`,
            },
            borderColor: style.borderColor,
            outlineStyle: 'dashed',
            outlineWidth: '3px',
            showVisualization: true,
        };

        drawerConfig.failureBoxConfig = this.getFailureBoxConfig(data);

        return drawerConfig;
    }

    private getLandmarkInfo(data: HtmlElementAxeResults): ElemData {
        for (const idx in data.ruleResults) {
            if (data.ruleResults[idx].ruleId === 'unique-landmark') {
                return this.getData(data.ruleResults[idx].any);
            }
        }
        return undefined;
    }

    private getData(nodes: FormattedCheckResult[]): ElemData {
        for (const check of nodes) {
            if (check.id === 'unique-landmark') {
                return {
                    role: check.data.role,
                    label: check.data.label,
                };
            }
        }
    }

    private decorateLabelText(elemData: ElemData): ElemData {
        if (elemData == null) {
            return null;
        }

        let labelToAssign;

        if (elemData.label != null) {
            labelToAssign = `"${elemData.label}" ${elemData.role} LM`;
        } else {
            labelToAssign = `${elemData.role} LM`;
        }
        return {
            role: elemData.role,
            label: labelToAssign,
        };
    }
}
