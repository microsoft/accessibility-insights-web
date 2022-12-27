// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DialogRenderer } from '../dialog-renderer';
import { AssessmentVisualizationInstance } from '../frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from './failure-instance-formatter';
import { DrawerConfiguration } from './formatter';

export interface FrameStyleConfiguration {
    outlineColor: string;
    fontColor: string;
    contentText: string;
}

export class FrameFormatter extends FailureInstanceFormatter {
    public static frameStyles: { [frameType: string]: FrameStyleConfiguration } = {
        frame: {
            outlineColor: '#0066CC',
            fontColor: '#FFFFFF',
            contentText: 'F',
        },
        iframe: {
            outlineColor: '#00CC00',
            fontColor: '#FFFFFF',
            contentText: 'I',
        },
        default: {
            outlineColor: '#C00000',
            fontColor: '#FFFFFF',
            contentText: '',
        },
    };

    public getDialogRenderer(): DialogRenderer | null {
        return null;
    }

    public getDrawerConfiguration(
        element: HTMLElement,
        data: AssessmentVisualizationInstance,
    ): DrawerConfiguration {
        const frameType = element.tagName.toLowerCase();
        const style = FrameFormatter.frameStyles[frameType] || FrameFormatter.frameStyles.default;

        const drawerConfig: DrawerConfiguration = {
            textBoxConfig: {
                fontColor: style.fontColor,
                text: style.contentText,
                background: style.outlineColor,
            },
            outlineColor: style.outlineColor,
            outlineStyle: 'solid',
            showVisualization: true,
            textAlign: 'center',
        };

        drawerConfig.showVisualization = true;

        drawerConfig.failureBoxConfig = this.getFailureBoxConfig(data);

        return drawerConfig;
    }
}
