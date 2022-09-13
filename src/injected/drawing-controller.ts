// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { SingleFrameMessenger } from 'injected/frameCommunicators/single-frame-messenger';
import { forOwn } from 'lodash';
import { HTMLElementUtils } from '../common/html-element-utils';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryNumberTo } from '../types/common-types';
import {
    AssessmentVisualizationInstance,
    HtmlElementAxeResultsHelper,
    HTMLIFrameResult,
} from './frameCommunicators/html-element-axe-results-helper';
import { Drawer } from './visualization/drawer';

export interface VisualizationWindowMessage {
    visualizationType?: VisualizationType;
    isEnabled: boolean;
    configId: string;
    elementResults?: AssessmentVisualizationInstance[];
    featureFlagStoreData?: FeatureFlagStoreData;
}

export class DrawingController {
    public static readonly triggerVisualizationCommand = 'insights.draw';

    private drawers: DictionaryNumberTo<Drawer> = {};
    private featureFlagStoreData: FeatureFlagStoreData;

    constructor(
        private readonly frameMessenger: SingleFrameMessenger,
        private readonly axeResultsHelper: HtmlElementAxeResultsHelper,
        private readonly htmlElementUtils: HTMLElementUtils,
    ) {}

    public initialize(): void {
        this.frameMessenger.addMessageListener(
            DrawingController.triggerVisualizationCommand,
            this.onTriggerVisualization,
        );
    }

    public registerDrawer = (id: string, drawer: Drawer) => {
        if (this.drawers[id]) {
            throw new Error(`Drawer already registered to id: ${id}`);
        }
        this.drawers[id] = drawer;
    };

    public processRequest = async (message: VisualizationWindowMessage): Promise<void> => {
        this.featureFlagStoreData = message.featureFlagStoreData;
        if (message.isEnabled) {
            await this.enableVisualization(message.elementResults, message.configId);
        } else {
            await this.disableVisualization(message.configId);
        }
    };

    private onTriggerVisualization = async (
        message: CommandMessage,
    ): Promise<CommandMessageResponse> => {
        const response = await this.processRequest(message.payload);
        return { payload: response };
    };

    private async enableVisualization(
        elementResults: AssessmentVisualizationInstance[] | undefined,
        configId: string,
    ): Promise<void> {
        if (elementResults) {
            const elementResultsByFrame = this.axeResultsHelper.splitResultsByFrame(elementResults);

            await Promise.all(
                elementResultsByFrame.map(
                    async frameResults =>
                        await this.enableVisualizationForFrameResults(frameResults, configId),
                ),
            );
        } else {
            await this.enableVisualizationInCurrentFrame(null, configId);

            const childFrames = this.getChildFrames();
            await Promise.all(
                childFrames.map(
                    async iframe =>
                        await this.enableVisualizationInChildFrame(iframe, null, configId),
                ),
            );
        }
    }

    private enableVisualizationForFrameResults = async (
        frameResults: HTMLIFrameResult,
        configId: string,
    ): Promise<void> => {
        if (frameResults.frame == null) {
            await this.enableVisualizationInCurrentFrame(frameResults.elementResults, configId);
        } else {
            await this.enableVisualizationInChildFrame(
                frameResults.frame,
                frameResults.elementResults,
                configId,
            );
        }
    };

    private enableVisualizationInCurrentFrame = async (
        currentFrameResults: AssessmentVisualizationInstance[],
        configId: string,
    ): Promise<void> => {
        const drawer = this.getDrawer(configId);
        drawer.initialize({
            data: this.getInitialElements(currentFrameResults),
            featureFlagStoreData: this.featureFlagStoreData,
        });
        await drawer.drawLayout();
    };

    private enableVisualizationInChildFrame = async (
        frame: HTMLIFrameElement,
        frameResults: AssessmentVisualizationInstance[],
        configId: string,
    ): Promise<void> => {
        const message: VisualizationWindowMessage = {
            elementResults: frameResults,
            isEnabled: true,
            featureFlagStoreData: this.featureFlagStoreData,
            configId: configId,
        };

        await this.frameMessenger.sendMessageToFrame(
            frame,
            this.createFrameRequestMessage(message),
        );
    };

    private async disableVisualization(configId: string): Promise<void> {
        this.disableVisualizationInCurrentFrame(configId);
        await this.disableVisualizationInChildFrames(configId);
    }

    private createFrameRequestMessage(message: VisualizationWindowMessage): CommandMessage {
        return {
            command: DrawingController.triggerVisualizationCommand,
            payload: message,
        };
    }

    private disableVisualizationInChildFrames = async (configId: string): Promise<void> => {
        const iframes = this.getChildFrames();

        await Promise.all(
            iframes.map(async iframe => {
                await this.disableVisualizationInChildFrame(configId, iframe);
            }),
        );
    };

    private disableVisualizationInChildFrame = async (
        configId: string,
        iframe: HTMLIFrameElement,
    ): Promise<void> => {
        const message: VisualizationWindowMessage = {
            isEnabled: false,
            configId: configId,
        };

        await this.frameMessenger.sendMessageToFrame(
            iframe,
            this.createFrameRequestMessage(message),
        );
    };

    private disableVisualizationInCurrentFrame(configId: string): void {
        const drawer = this.getDrawer(configId);
        drawer.eraseLayout();
    }

    private getChildFrames(): HTMLIFrameElement[] {
        return Array.from(
            this.htmlElementUtils.getAllElementsByTagName(
                'iframe',
            ) as HTMLCollectionOf<HTMLIFrameElement>,
        );
    }

    private getDrawer(configId: string): Drawer {
        return this.drawers[configId];
    }

    private getInitialElements(
        currentFrameResults: AssessmentVisualizationInstance[],
    ): AssessmentVisualizationInstance[] {
        if (currentFrameResults == null) {
            return null;
        }

        return currentFrameResults.filter(result => {
            return result.isVisualizationEnabled !== false;
        });
    }

    public dispose(): void {
        forOwn(this.drawers, currentDrawer => {
            currentDrawer.eraseLayout();
        });
    }
}
