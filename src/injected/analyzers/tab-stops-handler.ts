// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { TabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';
import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { FocusableElement } from 'tabbable';

export class TabStopsHandler {
    private tabbableTabStops: FocusableElement[];
    private visitedTabStops: Set<HTMLElement>;
    private latestVisitedTabStop: HTMLElement | null;

    constructor(
        private readonly tabStopsRequirementEvaluator: TabStopsRequirementEvaluator,
        private readonly tabbableElementGetter: TabbableElementGetter,
    ) {}

    public initialize(): void {
        this.visitedTabStops = new Set();
        this.latestVisitedTabStop = null;
        this.tabbableTabStops = this.tabbableElementGetter.getRawElements();
    }

    public handleNewTabStop = async (
        newTabStop: HTMLElement,
    ): Promise<AutomatedTabStopRequirementResult | null> => {
        if (this.latestVisitedTabStop == null) {
            this.visitedTabStops.add(newTabStop);
            this.latestVisitedTabStop = newTabStop;
            return null;
        }

        if (this.visitedTabStops.has(newTabStop)) {
            this.latestVisitedTabStop = newTabStop;
            return null;
        }

        this.visitedTabStops.add(newTabStop);
        const result = this.tabStopsRequirementEvaluator.getFocusOrderResult(
            this.latestVisitedTabStop,
            newTabStop,
        );
        this.latestVisitedTabStop = newTabStop;

        return result;
    };

    public getTabbableFocusOrderResults(): AutomatedTabStopRequirementResult[] {
        return this.tabStopsRequirementEvaluator.getTabbableFocusOrderResults(
            this.tabbableTabStops,
        );
    }

    public getKeyboardNavigationResults(): AutomatedTabStopRequirementResult[] {
        return this.tabStopsRequirementEvaluator.getKeyboardNavigationResults(
            this.tabbableTabStops,
            this.visitedTabStops,
        );
    }
}
