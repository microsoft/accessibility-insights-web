// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';

import { HTMLElementUtils } from '../common/html-element-utils';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryNumberTo } from '../types/common-types';
import { ErrorMessageContent } from './frameCommunicators/error-message-content';
import { FrameCommunicator, MessageRequest } from './frameCommunicators/frame-communicator';
import {
    AssessmentVisualizationInstance,
    HtmlElementAxeResultsHelper,
    HTMLIFrameResult,
} from './frameCommunicators/html-element-axe-results-helper';
import { FrameMessageResponseCallback } from './frameCommunicators/window-message-handler';
import { Drawer } from './visualization/drawer';

export type RegisterDrawer = (id: string, drawer: Drawer) => void;

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
        private frameCommunicator: FrameCommunicator,
        private axeResultsHelper: HtmlElementAxeResultsHelper,
        private htmlElementUtils: HTMLElementUtils,
    ) {}

    public initialize(): void {
        this.frameCommunicator.subscribe(
            DrawingController.triggerVisualizationCommand,
            this.onTriggerVisualization,
        );
    }

    public registerDrawer: RegisterDrawer = (id: string, drawer: Drawer) => {
        if (this.drawers[id]) {
            throw new Error(`Drawer already registered to id: ${id}`);
        }
        this.drawers[id] = drawer;
    };

    public processRequest = (message: VisualizationWindowMessage): void => {
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

    private onTriggerVisualization = (
        result: VisualizationWindowMessage,
        error: ErrorMessageContent,
        sourceWindow: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        this.processRequest(result);
        this.invokeMethodIfExists(responder, null);
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

    private enableVisualizationInCurrentFrame(
        currentFrameResults: AssessmentVisualizationInstance[],
        configId: string,
    ): void {
        const drawer = this.getDrawer(configId);
        drawer.initialize({
            data: this.getInitialElements(currentFrameResults),
            featureFlagStoreData: this.featureFlagStoreData,
        });
        drawer.drawLayout();
    }

    private enableVisualizationInIFrames(
        frame: HTMLIFrameElement,
        frameResults: AssessmentVisualizationInstance[],
        configId: string,
    ): void {
        const message: VisualizationWindowMessage = {
            elementResults: frameResults,
            isEnabled: true,
            featureFlagStoreData: this.featureFlagStoreData,
            configId: configId,
        };

        this.frameCommunicator.sendMessage(this.createFrameRequestMessage(frame, message));
    }

    private disableVisualization(configId: string): void {
        this.disableVisualizationInCurrentFrame(configId);
        this.disableVisualizationInIFrames(configId);
    }

    private createFrameRequestMessage(
        frame: HTMLIFrameElement,
        message: VisualizationWindowMessage,
    ): MessageRequest<VisualizationWindowMessage> {
        return {
            command: DrawingController.triggerVisualizationCommand,
            frame: frame,
            message: message,
        } as MessageRequest<VisualizationWindowMessage>;
    }

    private disableVisualizationInIFrames(configId: string): void {
        const iframes = this.getAllFrames();

        for (let i = 0; i < iframes.length; i++) {
            const iframe = iframes[i];
            if (iframe != null) {
                const message: VisualizationWindowMessage = {
                    isEnabled: false,
                    configId: configId,
                };

                this.frameCommunicator.sendMessage(this.createFrameRequestMessage(iframe, message));
            }
        }
    }

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

    private invokeMethodIfExists(method: Function, data: any): void {
        if (method) {
            method(data);
        }
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
