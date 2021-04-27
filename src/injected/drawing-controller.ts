// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
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
        private readonly frameMessenger: FrameMessenger,
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
            const elementResultsByFrames = message.elementResults
                ? this.axeResultsHelper.splitResultsByFrame(message.elementResults)
                : null;
            this.enableVisualization(elementResultsByFrames, message.configId);
        } else {
            this.disableVisualization(message.configId);
        }
    };

    private onTriggerVisualization = async (
        message: CommandMessage,
    ): Promise<CommandMessageResponse> => {
        const response = await this.processRequest(message.payload);
        return { payload: response };
    };

    private enableVisualization(
        elementResultsByFrames: HTMLIFrameResult[],
        configId: string,
    ): void {
        if (elementResultsByFrames) {
            for (let pos = 0; pos < elementResultsByFrames.length; pos++) {
                const resultsForFrame = elementResultsByFrames[pos];
                if (resultsForFrame.frame == null) {
                    this.enableVisualizationInCurrentFrame(
                        resultsForFrame.elementResults,
                        configId,
                    );
                } else {
                    this.enableVisualizationInIFrames(
                        resultsForFrame.frame,
                        resultsForFrame.elementResults,
                        configId,
                    );
                }
            }
        } else {
            this.enableVisualizationInCurrentFrame(null, configId);

            const iframes = this.getAllFrames();
            for (let pos = 0; pos < iframes.length; pos++) {
                this.enableVisualizationInIFrames(iframes[pos], null, configId);
            }
        }
    }

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

    private enableVisualizationInIFrames = async (
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

    private disableVisualization(configId: string): void {
        this.disableVisualizationInCurrentFrame(configId);
        this.disableVisualizationInIFrames(configId);
    }

    private createFrameRequestMessage(message: VisualizationWindowMessage): CommandMessage {
        return {
            command: DrawingController.triggerVisualizationCommand,
            payload: message,
        };
    }

    private disableVisualizationInIFrames = async (configId: string): Promise<void> => {
        const iframes = this.getAllFrames();

        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            if (iframe != null) {
                const message: VisualizationWindowMessage = {
                    isEnabled: false,
                    configId: configId,
                };

                await this.frameMessenger.sendMessageToFrame(
                    iframe,
                    this.createFrameRequestMessage(message),
                );
            }
        }
    };

    private disableVisualizationInCurrentFrame(configId: string): void {
        const drawer = this.getDrawer(configId);
        drawer.eraseLayout();
    }

    private getAllFrames(): HTMLCollectionOf<HTMLIFrameElement> {
        return this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as HTMLCollectionOf<HTMLIFrameElement>;
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
