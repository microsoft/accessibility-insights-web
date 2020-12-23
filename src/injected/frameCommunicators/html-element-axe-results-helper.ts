// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { forOwn } from 'lodash';
import { HTMLElementUtils } from '../../common/html-element-utils';
import { Logger } from '../../common/logging/logger';
import { DictionaryStringTo } from '../../types/common-types';
import { HtmlElementAxeResults } from '../scanner-utils';

export interface HTMLIFrameResult {
    frame: HTMLIFrameElement | null;
    elementResults: AssessmentVisualizationInstance[];
}

export interface AxeResultsWithFrameLevel extends HtmlElementAxeResults {
    targetIndex?: number;
}

export interface AssessmentVisualizationInstance extends AxeResultsWithFrameLevel {
    isFailure: boolean;
    isVisualizationEnabled: boolean;
    propertyBag?: any;
}

export class HtmlElementAxeResultsHelper {
    constructor(private htmlElementUtils: HTMLElementUtils, private logger: Logger) {}

    public splitResultsByFrame(elementResults: AxeResultsWithFrameLevel[]): HTMLIFrameResult[] {
        const frameSelectorToResultsMap = this.getFrameSelectorToResultMap(elementResults);
        const results = this.getFrameResultsFromSelectorMap(frameSelectorToResultsMap);
        this.addMissingFrameResults(results);

        return results;
    }

    private getFrameResultsFromSelectorMap(
        selectorMap: DictionaryStringTo<AxeResultsWithFrameLevel[]>,
    ): HTMLIFrameResult[] {
        const results: HTMLIFrameResult[] = [];
        forOwn(selectorMap, (frameResults, selectorKey) => {
            if (selectorKey) {
                const iframe = this.htmlElementUtils.querySelector(selectorKey);
                if (iframe != null) {
                    results.push({
                        elementResults: frameResults,
                        frame: iframe,
                    } as HTMLIFrameResult);
                } else {
                    this.logger.log('unable to find frame to highlight', selectorKey);
                }
            } else {
                results.push({
                    elementResults: frameResults,
                    frame: null,
                } as HTMLIFrameResult);
            }
        });

        return results;
    }

    private addMissingFrameResults(frameResults: HTMLIFrameResult[]): void {
        const missingFrames: HTMLIFrameElement[] = [];

        const allFramesIncludingCurrentFrames = Array.prototype.slice.call(
            this.htmlElementUtils.getAllElementsByTagName(
                'iframe',
            ) as HTMLCollectionOf<HTMLIFrameElement>,
        );
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

    private getFrameSelectorToResultMap(
        elementResults: AxeResultsWithFrameLevel[],
    ): DictionaryStringTo<AxeResultsWithFrameLevel[]> {
        const elementResultsByFrame: DictionaryStringTo<AxeResultsWithFrameLevel[]> = {};

        for (let i = 0; i < elementResults.length; i++) {
            const elementResult = elementResults[i];
            const targetLength = elementResult.target.length;

            if (elementResult.targetIndex == null) {
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
