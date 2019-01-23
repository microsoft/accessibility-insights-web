// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
/// <reference path="./iformatter.d.ts" />
/// <reference path="./heading-formatter.ts" />
/// <reference path="../scanner-utils.ts" />
import { IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { IHtmlElementAxeResults } from '../scanner-utils';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { IHeadingStyleConfiguration } from './heading-formatter';
import { IDrawerConfiguration } from './iformatter';

interface ElemData {
    role: string;
    label: string;
}

export class LandmarkFormatter extends FailureInstanceFormatter {
    public static landmarkStyles: { [role: string]: IHeadingStyleConfiguration } = {
        'banner': {
            borderColor: '#ff9900',
            fontColor: '#000000',
        },
        'complementary': {
            borderColor: '#00cccc',
            fontColor: '#000000',
        },
        'contentinfo': {
            borderColor: '#00cc00',
            fontColor: '#000000',
        },
        'form': {
            borderColor: '#999999',
            fontColor: '#000000',
        },
        'main': {
            borderColor: '#ff66ff',
            fontColor: '#000000',
        },
        'navigation': {
            borderColor: '#ffcc00',
            fontColor: '#000000',
        },
        'region': {
            borderColor: '#3399ff',
            fontColor: '#000000',
        },
        'header': {
            borderColor: '#ff9900',
            fontColor: '#000000',
        },
        'aside': {
            borderColor: '#00cccc',
            fontColor: '#000000',
        },
        'search': {
            borderColor: '#9955ff',
            fontColor: '#000000',
        },
        'footer': {
            borderColor: '#00cc00',
            fontColor: '#000000',
        },
        'blank': {
            borderColor: '#C00000',
            fontColor: '#FFFFFF',
        },
    };

    public getDialogRenderer() { return null; }

    public getDrawerConfiguration(element: Node, data: IAssessmentVisualizationInstance): IDrawerConfiguration {
        // parse down the IHtmlElementAxeResult to see if it is contained in the map
        const elemData = this.decorateLabelText(data.propertyBag || this.getLandmarkInfo(data));

        const style = LandmarkFormatter.landmarkStyles[elemData.role] || LandmarkFormatter.landmarkStyles.blank;

        const drawerConfig: IDrawerConfiguration = {
            textBoxConfig: {
                fontColor: style.fontColor,
                background: style.borderColor,
                text: elemData.label,
            },
            borderColor: style.borderColor,
            outlineStyle: 'dashed',
            showVisualization: true,
        };

        drawerConfig.failureBoxConfig = this.getFailureBoxConfig(data);

        return drawerConfig;
    }

    private getLandmarkInfo(data: IHtmlElementAxeResults): ElemData {
        let elemData;
        for (const idx in data.ruleResults) {
            if (data.ruleResults[idx].ruleId === 'unique-landmark') {
                return this.getData(data.ruleResults[idx].any);
            }
        }
        return elemData;
    }

    private getData(nodes: FormattedCheckResult[]): ElemData {
        for (const idx in nodes) {
            const check = nodes[idx];
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
        }
        else {
            labelToAssign = `${elemData.role} LM`;
        }
        return {
            role: elemData.role,
            label: labelToAssign,
        };
    }
}
