// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createConsoleLogger } from '../../common/logging/console-logger';
import { Logger } from '../../common/logging/logger';
import { IHtmlElementAxeResults } from '../scanner-utils';
import { HTMLElementUtils } from './../../common/html-element-utils';

export interface IFrameResult {
    frame: HTMLIFrameElement;
    elementResults: IAssessmentVisualizationInstance[];
}

export interface AxeResultsWithFrameLevel extends IHtmlElementAxeResults {
    targetIndex?: number;
}

export interface IAssessmentVisualizationInstance extends AxeResultsWithFrameLevel {
    isFailure: boolean;
    isVisualizationEnabled: boolean;
    html: string;
    propertyBag?: any;
    identifier: string;
}

export class HtmlElementAxeResultsHelper {
    constructor(private htmlElementUtils: HTMLElementUtils, private logger: Logger = createConsoleLogger()) {}

    public splitResultsByFrame(elementResults: AxeResultsWithFrameLevel[]): IFrameResult[] {
        const frameSelectorToResultsMap = this.getFrameSelectorToResultMap(elementResults);
        const results = this.getFrameResultsFromSelectorMap(frameSelectorToResultsMap);
        this.addMissingFrameResults(results);

        return results;
    }

    private getFrameResultsFromSelectorMap(selectorMap: IDictionaryStringTo<AxeResultsWithFrameLevel[]>): IFrameResult[] {
        const results: IFrameResult[] = [];

        for (const selectorKey in selectorMap) {
            const frameResults = selectorMap[selectorKey];

            if (selectorKey) {
                const iframe = this.htmlElementUtils.querySelector(selectorKey);
                if (iframe != null) {
                    results.push({
                        elementResults: frameResults,
                        frame: iframe,
                    } as IFrameResult);
                } else {
                    this.logger.log('unable to find frame to highlight', selectorKey);
                }
            } else {
                results.push({
                    elementResults: frameResults,
                    frame: null,
                } as IFrameResult);
            }
        }

        return results;
    }

    private addMissingFrameResults(frameResults: IFrameResult[]): void {
        const missingFrames: HTMLIFrameElement[] = [];

        const allFramesIncludingCurrentFrames = Array.prototype.slice.call(this.htmlElementUtils.getAllElementsByTagName(
            'iframe',
        ) as NodeListOf<HTMLIFrameElement>);
        allFramesIncludingCurrentFrames.push(null); // current frame

        for (let framePos = 0; framePos < allFramesIncludingCurrentFrames.length; framePos++) {
            const frame = allFramesIncludingCurrentFrames[framePos];
            let isMissing = true;

            for (let resultPos = 0; resultPos < frameResults.length; resultPos++) {
                if (frameResults[resultPos].frame === frame) {
                    isMissing = false;
                }
            }
            if (isMissing) {
                missingFrames.push(frame);
            }
        }

        missingFrames.forEach(frame => {
            frameResults.push({
                elementResults: [],
                frame: frame,
            });
        });
    }

    private getFrameSelectorToResultMap(elementResults: AxeResultsWithFrameLevel[]) {
        const elementResultsByFrame: IDictionaryStringTo<AxeResultsWithFrameLevel[]> = {};

        for (let i = 0; i < elementResults.length; i++) {
            const elementResult = elementResults[i];
            const targetLength = elementResult.target.length;

            if (elementResult.targetIndex == undefined) {
                elementResult.targetIndex = 0;
            }
            if (targetLength === elementResult.targetIndex + 1) {
                // current frame
                elementResultsByFrame[''] = elementResultsByFrame[''] || [];
                elementResultsByFrame[''].push(elementResult);
            } else if (targetLength > elementResult.targetIndex + 1) {
                const frameSelector = elementResult.target[elementResult.targetIndex++];
                elementResultsByFrame[frameSelector] = elementResultsByFrame[frameSelector] || [];
                elementResultsByFrame[frameSelector].push(elementResult);
            } else {
                this.logger.log('Unable to find selector for result ', elementResult);
            }
        }

        return elementResultsByFrame;
    }
}
