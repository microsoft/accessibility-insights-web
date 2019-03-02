// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResultsWithFrameLevel, IAssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { IDrawerConfiguration, IFormatter } from './iformatter';

export interface IFrameStyleConfiguration {
    borderColor: string;
    fontColor: string;
    contentText: string;
}

export class FrameFormatter extends FailureInstanceFormatter {
    public static frameStyles: { [frameType: string]: IFrameStyleConfiguration } = {
        frame: {
            borderColor: '#0066CC',
            fontColor: '#FFFFFF',
            contentText: 'F',
        },
        iframe: {
            borderColor: '#00CC00',
            fontColor: '#FFFFFF',
            contentText: 'I',
        },
        default: {
            borderColor: '#C00000',
            fontColor: '#FFFFFF',
            contentText: '',
        },
    };

    public getDialogRenderer() {
        return null;
    }

    public getDrawerConfiguration(element: HTMLElement, data: IAssessmentVisualizationInstance): IDrawerConfiguration {
        const frameType = element.tagName.toLowerCase();
        const style = FrameFormatter.frameStyles[frameType] || FrameFormatter.frameStyles.default;

        const drawerConfig: IDrawerConfiguration = {
            textBoxConfig: {
                fontColor: style.fontColor,
                text: style.contentText,
                background: style.borderColor,
            },
            borderColor: style.borderColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
        };

        drawerConfig.showVisualization = true;

        drawerConfig.failureBoxConfig = this.getFailureBoxConfig(data);

        return drawerConfig;
    }
}
