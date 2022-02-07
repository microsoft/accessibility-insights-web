// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { HTMLElementUtils } from 'common/html-element-utils';
import { getUniqueSelector } from 'scanner/axe-utils';
import { FocusableElement } from 'tabbable';
import { AutomatedTabStopRequirementResult } from './tab-stop-requirement-result';

export interface TabStopsRequirementEvaluator {
    getKeyboardNavigationResults(
        tabbableTabStops: FocusableElement[],
        actualTabStops: Set<HTMLElement>,
    ): AutomatedTabStopRequirementResult[];
    getFocusOrderResult(
        lastTabStop: HTMLElement,
        currentTabStop: HTMLElement,
    ): AutomatedTabStopRequirementResult;
    getTabbableFocusOrderResults(
        tabbableTabStops: FocusableElement[],
    ): AutomatedTabStopRequirementResult[];
    getKeyboardTrapResults(
        oldActiveElement: Element,
        newActiveElement: Element,
    ): AutomatedTabStopRequirementResult;
}

export class DefaultTabStopsRequirementEvaluator implements TabStopsRequirementEvaluator {
    private readonly keyboardNavigationDescription: (string) => string = selector =>
        `Element ${selector} was expected, but not reached in tab order`;
    private readonly focusOrderDescription: (currSelector: string, lastSelector: string) => string =
        (currSelector, lastSelector) =>
            `Element ${currSelector} precedes ${lastSelector} but ${lastSelector} was visited first in tab order`;
    private readonly focusTrapsDescription: (string) => string = selector =>
        `Focus is still on element ${selector} 500ms after pressing tab`;

    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly generateSelector: typeof getUniqueSelector,
    ) {}

    public getKeyboardNavigationResults(
        tabbableTabStops: FocusableElement[],
        actualTabStops: Set<HTMLElement>,
    ): AutomatedTabStopRequirementResult[] {
        const requirementResults: AutomatedTabStopRequirementResult[] = [];
        (tabbableTabStops as HTMLElement[]).forEach(expectedTabStop => {
            if (!actualTabStops.has(expectedTabStop)) {
                const selector = this.generateSelector(expectedTabStop);
                requirementResults.push({
                    description: this.keyboardNavigationDescription(selector),
                    selector: [selector],
                    html: expectedTabStop.outerHTML,
                    requirementId: 'keyboard-navigation',
                });
            }
        });
        return requirementResults;
    }

    public getFocusOrderResult(
        lastTabStop: HTMLElement,
        currentTabStop: HTMLElement,
    ): AutomatedTabStopRequirementResult {
        if (this.htmlElementUtils.precedesInDOM(currentTabStop, lastTabStop)) {
            const lastSelector = this.generateSelector(lastTabStop);
            const currSelector = this.generateSelector(currentTabStop);
            return {
                description: this.focusOrderDescription(currSelector, lastSelector),
                selector: [currSelector],
                html: currentTabStop.outerHTML,
                requirementId: 'tab-order',
            };
        }
        return null;
    }

    public getTabbableFocusOrderResults(
        tabbableTabStops: FocusableElement[],
    ): AutomatedTabStopRequirementResult[] {
        const requirementResults: AutomatedTabStopRequirementResult[] = [];
        const tabStops = tabbableTabStops as HTMLElement[];
        tabStops.forEach((expectedTabStop, index) => {
            if (index > 0) {
                const comparisonResult = this.getFocusOrderResult(
                    tabStops[index - 1],
                    expectedTabStop,
                );
                if (comparisonResult) {
                    requirementResults.push(comparisonResult);
                }
            }
        });
        return requirementResults;
    }

    public getKeyboardTrapResults(
        oldActiveElement: Element,
        newActiveElement: Element,
    ): AutomatedTabStopRequirementResult {
        if (oldActiveElement === newActiveElement) {
            const selector = this.generateSelector(oldActiveElement as HTMLElement);
            return {
                description: this.focusTrapsDescription(selector),
                selector: [selector],
                html: oldActiveElement.outerHTML,
                requirementId: 'keyboard-traps',
            };
        }
        return null;
    }
}
