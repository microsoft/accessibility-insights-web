// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AllFramesMessenger } from 'injected/frameCommunicators/all-frames-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { forOwn } from 'lodash';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../common/types/visualization-type';
import { DictionaryNumberTo } from '../types/common-types';
import {
    AssessmentVisualizationInstance,
    HtmlElementAxeResultsHelper,
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
        private readonly allFramesMessenger: AllFramesMessenger,
        private readonly axeResultsHelper: HtmlElementAxeResultsHelper,
    ) {}

    public initialize(): void {
        this.allFramesMessenger.addMessageListener(
            DrawingController.triggerVisualizationCommand,
            this.onTriggerVisualization,
        );
    }

    public async prepareVisualization(): Promise<void> {
        await this.allFramesMessenger.initializeAllFrames();
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
            await this.enableVisualizationWithElementResults(elementResults, configId);
        } else {
            await this.enableVisualizationForAllFrames(configId);
        }
    }

    private async enableVisualizationWithElementResults(
        elementResults: AssessmentVisualizationInstance[],
        configId: string,
    ): Promise<void> {
        const elementResultsByFrame = this.axeResultsHelper.splitResultsByFrame(elementResults);

        const currentFrameResults = elementResultsByFrame.find(results => results.frame == null);
        if (currentFrameResults != null) {
            await this.enableVisualizationInCurrentFrame(
                currentFrameResults.elementResults,
                configId,
            );
        }

        const childFrameResults = elementResultsByFrame.filter(results => results.frame != null);
        await this.allFramesMessenger.sendCommandToMultipleFrames(
            DrawingController.triggerVisualizationCommand,
            childFrameResults.map(results => results.frame),
            (_frame, index) =>
                this.createEnableVisualizationPayload(
                    configId,
                    childFrameResults[index].elementResults,
                ),
        );
    }

    private async enableVisualizationForAllFrames(configId: string): Promise<void> {
        await this.enableVisualizationInCurrentFrame(null, configId);

        await this.allFramesMessenger.sendCommandToAllFrames(
            DrawingController.triggerVisualizationCommand,
            this.createEnableVisualizationPayload(configId),
        );
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

    private createEnableVisualizationPayload(
        configId: string,
        frameResults?: AssessmentVisualizationInstance[],
    ): VisualizationWindowMessage {
        return {
            elementResults: frameResults ?? null,
            isEnabled: true,
            featureFlagStoreData: this.featureFlagStoreData,
            configId: configId,
        };
    }

    private async disableVisualization(configId: string): Promise<void> {
        this.disableVisualizationInCurrentFrame(configId);
        await this.disableVisualizationInChildFrames(configId);
    }

    private disableVisualizationInChildFrames = async (configId: string): Promise<void> => {
        const commandPayload = {
            isEnabled: false,
            configId: configId,
        };
        await this.allFramesMessenger.sendCommandToAllFrames(
            DrawingController.triggerVisualizationCommand,
            commandPayload,
        );
    };

    private disableVisualizationInCurrentFrame(configId: string): void {
        const drawer = this.getDrawer(configId);
        drawer.eraseLayout();
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
