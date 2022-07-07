// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PromiseFactory } from 'common/promises/promise-factory';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { TabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';

export class FocusTrapsKeydownHandler {
    // TabStopsOrchestrator already stores latestVisitedTabStop,
    // but that may be modified by other event listeners before
    // this one runs, so we need to keep this state separate
    protected lastFocusedElement: Element | null = null;

    constructor(
        private readonly tabStopsRequirementEvaluator: TabStopsRequirementEvaluator,
        private readonly promiseFactory: PromiseFactory,
        private readonly keyboardTrapTimeout: number = 500,
    ) {}

    public reset(): void {
        this.lastFocusedElement = null;
    }

    public getResultOnKeydown = async (
        e: KeyboardEvent,
        dom: Document,
    ): Promise<AutomatedTabStopRequirementResult | null> => {
        if (e.key !== 'Tab' || dom.activeElement === dom.body) {
            return null;
        }

        await this.promiseFactory.delay(null, this.keyboardTrapTimeout);

        const currentFocusedElement = dom.activeElement;

        let result: AutomatedTabStopRequirementResult | null = null;
        if (currentFocusedElement != null && this.lastFocusedElement != null) {
            result = this.tabStopsRequirementEvaluator.getKeyboardTrapResults(
                this.lastFocusedElement,
                currentFocusedElement,
            );
        }
        this.lastFocusedElement = currentFocusedElement;

        return result;
    };
}
