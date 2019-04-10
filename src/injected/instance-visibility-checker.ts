// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { UpdateInstanceVisibilityPayload } from '../background/actions/action-payloads';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { HTMLElementUtils } from '../common/html-element-utils';
import { Message } from '../common/message';
import { Messages } from '../common/messages';
import { VisualizationType } from '../common/types/visualization-type';
import { WindowUtils } from '../common/window-utils';
import { DictionaryNumberTo } from '../types/common-types';
import { AssessmentVisualizationInstance } from './frameCommunicators/html-element-axe-results-helper';

export class InstanceVisibilityChecker {
    private sendMessage: (message) => void;
    private _windowUtils: WindowUtils;
    private _htmlElementUtils: HTMLElementUtils;
    public static recalculationTimeInterval = 1500;
    private identifierToIntervalMap: DictionaryNumberTo<string> = {};
    private configurationFactory: VisualizationConfigurationFactory;

    constructor(
        sendMessage: (message) => void,
        windowUtils: WindowUtils,
        htmlElementUtils: HTMLElementUtils,
        configurationFactory: VisualizationConfigurationFactory,
    ) {
        this.sendMessage = sendMessage;
        this._windowUtils = windowUtils;
        this._htmlElementUtils = htmlElementUtils;
        this.configurationFactory = configurationFactory;
    }

    public createVisibilityCheckerInterval(
        drawerIdentifier: string,
        visualizationType: VisualizationType,
        currentFrameResults: AssessmentVisualizationInstance[],
    ): void {
        const skipVisibilityCheck = !this.configurationFactory.getConfiguration(visualizationType).getUpdateVisibility(drawerIdentifier);
        if (skipVisibilityCheck) {
            return;
        }

        this.clearVisibilityCheck(drawerIdentifier, visualizationType);
        const checkVisibilityFunction = this.generateCheckVisibilityFunction(drawerIdentifier, visualizationType, currentFrameResults);
        this.identifierToIntervalMap[drawerIdentifier] = this._windowUtils.setInterval(
            checkVisibilityFunction,
            InstanceVisibilityChecker.recalculationTimeInterval,
        );
    }

    public clearVisibilityCheck(drawerIdentifier: string, test: VisualizationType): void {
        const intervalId = this.identifierToIntervalMap[drawerIdentifier];
        if (intervalId != null) {
            this._windowUtils.clearInterval(intervalId);
            this.identifierToIntervalMap[drawerIdentifier] = null;
        }
    }

    private generateCheckVisibilityFunction(
        drawerIdentifier: string,
        visualizationType: VisualizationType,
        currentFrameResults: AssessmentVisualizationInstance[],
    ): Function {
        return () => {
            const payloadBatch: UpdateInstanceVisibilityPayload[] = currentFrameResults.map(elementResult => {
                const element = this._htmlElementUtils.querySelector(elementResult.target[elementResult.targetIndex]) as HTMLElement;
                const elementFoundMatchesStoredInstance =
                    this.elementIsVisible(element) && this.identifiersMatch(visualizationType, drawerIdentifier, elementResult, element);

                return {
                    test: visualizationType,
                    selector: elementResult.identifier,
                    isVisible: elementFoundMatchesStoredInstance,
                };
            });

            const message: Message = {
                type: Messages.Assessment.UpdateInstanceVisibility,
                payload: { payloadBatch },
            };

            this.sendMessage(message);
        };
    }

    private elementIsVisible(element: HTMLElement): boolean {
        return element != null && !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    }

    private identifiersMatch(
        visualizationType: VisualizationType,
        drawerIdentifier: string,
        currentElement: AssessmentVisualizationInstance,
        foundElement: HTMLElement,
    ): boolean {
        const identifierGenerator = this.configurationFactory
            .getConfiguration(visualizationType)
            .getInstanceIdentiferGenerator(drawerIdentifier);
        const newIdentifier = identifierGenerator({ target: currentElement.target, html: foundElement.outerHTML });
        return currentElement.identifier === newIdentifier;
    }
}
