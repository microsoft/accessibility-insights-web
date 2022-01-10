// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { getUniqueSelector } from 'scanner/axe-utils';
import { FocusableElement } from 'tabbable';
import { TabStopRequirementId } from 'types/tab-stop-requirement-info';

export type TabStopRequirementResult = {
    description: string;
};

export type TabStopRequirementResults = Partial<
    Record<TabStopRequirementId, TabStopRequirementResult[]>
>;

export interface TabStopsRequirementEvaluator {
    getKeyboardNavigationResults(
        tabbableTabStops: FocusableElement[],
        actualTabStops: Set<HTMLElement>,
    ): TabStopRequirementResult[];
    getFocusOrderResult(
        lastTabStop: HTMLElement,
        currentTabStop: HTMLElement,
    ): TabStopRequirementResult[];
    getKeyboardTrapResults(
        oldActiveElement: Element,
        newActiveElement: Element,
    ): TabStopRequirementResult[];
}

export class DefaultTabStopsRequirementEvaluator implements TabStopsRequirementEvaluator {
    public readonly keyboardNavigationDescription: (string) => string = selector =>
        `Element ${selector} was expected, but not reached in tab order`;
    public readonly focusOrderDescription: (currSelector: string, lastSelector: string) => string =
        (currSelector, lastSelector) =>
            `Element ${currSelector} precedes ${lastSelector} but was visited first in tab order`;
    public readonly focusTrapsDescription: (string) => string = selector =>
        `Focus is still on element ${selector} 500ms after pressing tab`;

    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly generateSelector: typeof getUniqueSelector,
    ) {}

    public getKeyboardNavigationResults(
        tabbableTabStops: FocusableElement[],
        actualTabStops: Set<HTMLElement>,
    ): TabStopRequirementResult[] {
        const requirementResults: TabStopRequirementResult[] = [];
        (tabbableTabStops as HTMLElement[]).forEach(expectedTabStop => {
            if (!actualTabStops.has(expectedTabStop)) {
                const selector = this.generateSelector(expectedTabStop);
                requirementResults.push({
                    description: this.keyboardNavigationDescription(selector),
                });
            }
        });
        return requirementResults;
    }

    public getFocusOrderResult(
        lastTabStop: HTMLElement,
        currentTabStop: HTMLElement,
    ): TabStopRequirementResult[] {
        if (this.htmlElementUtils.precedesInDOM(currentTabStop, lastTabStop)) {
            const lastSelector = this.generateSelector(lastTabStop);
            const currSelector = this.generateSelector(currentTabStop);
            return [
                {
                    description: this.focusOrderDescription(currSelector, lastSelector),
                },
            ];
        }
        return [];
    }

    public getKeyboardTrapResults(
        oldActiveElement: Element,
        newActiveElement: Element,
    ): TabStopRequirementResult[] {
        if (oldActiveElement === newActiveElement) {
            const selector = this.generateSelector(oldActiveElement as HTMLElement);
            return [
                {
                    description: this.focusTrapsDescription(selector),
                },
            ];
        }
        return [];
    }
}
