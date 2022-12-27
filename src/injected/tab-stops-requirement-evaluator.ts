// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HTMLElementUtils } from 'common/html-element-utils';
import { getAllUniqueSelectors, getUniqueSelector } from 'scanner/axe-utils';
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
    ): AutomatedTabStopRequirementResult | null;
    getTabbableFocusOrderResults(
        tabbableTabStops: FocusableElement[],
    ): AutomatedTabStopRequirementResult[];
    getKeyboardTrapResults(
        oldActiveElement: Element,
        newActiveElement: Element,
    ): AutomatedTabStopRequirementResult | null;
}

export class DefaultTabStopsRequirementEvaluator implements TabStopsRequirementEvaluator {
    private readonly automaticallyDetectedTag = '[Automatically detected, needs review]';
    private readonly keyboardNavigationDescription: (string) => string = selector =>
        `${this.automaticallyDetectedTag} Unreachable element: ${selector}.`;
    private readonly focusOrderDescription: (currSelector: string, lastSelector: string) => string =
        (currSelector, lastSelector) =>
            `${this.automaticallyDetectedTag} Inconsistent tab order between elements. Starts at ${lastSelector} and goes to ${currSelector}.`;
    private readonly focusTrapsDescription: (string) => string = selector =>
        `${this.automaticallyDetectedTag} Focus is still on element ${selector} 500ms after pressing tab`;

    constructor(
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly generateSelector: typeof getUniqueSelector,
        private readonly generateAllSelectors: typeof getAllUniqueSelectors,
    ) {}

    public getKeyboardNavigationResults(
        tabbableTabStops: HTMLElement[],
        actualTabStops: Set<HTMLElement>,
    ): AutomatedTabStopRequirementResult[] {
        if (!tabbableTabStops) {
            return [];
        }

        const selectors = this.generateAllSelectors(tabbableTabStops);
        const requirementResults: AutomatedTabStopRequirementResult[] = [];

        tabbableTabStops.forEach((expectedTabStop, index) => {
            if (actualTabStops.has(expectedTabStop)) {
                return;
            }
            const selector = selectors[index];
            requirementResults.push({
                description: this.keyboardNavigationDescription(selector),
                selector: [selector],
                html: expectedTabStop.outerHTML,
                requirementId: 'keyboard-navigation',
            });
        });

        return requirementResults;
    }

    public getFocusOrderResult(
        lastTabStop: HTMLElement,
        currentTabStop: HTMLElement,
    ): AutomatedTabStopRequirementResult | null {
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
    ): AutomatedTabStopRequirementResult | null {
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
