// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { PromiseFactory } from 'common/promises/promise-factory';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { TabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';

export class FocusTrapsHandler {
    protected lastFocusedElement: Element | null = null;

    constructor(
        private readonly tabStopsRequirementEvaluator: TabStopsRequirementEvaluator,
        private readonly promiseFactory: PromiseFactory,
        private readonly keyboardTrapTimeout: number = 500,
    ) {}

    public initialize(): void {
        this.lastFocusedElement = null;
    }

    public handleTabPressed = async (
        dom: Document,
    ): Promise<AutomatedTabStopRequirementResult | null> => {
        if (dom.activeElement === dom.body) {
            return null;
        }

        const elementFocusedBeforeTab = this.lastFocusedElement;
        this.lastFocusedElement = dom.activeElement;

        await this.promiseFactory.delay(null, this.keyboardTrapTimeout);

        const currentFocusedElement = dom.activeElement;

        let result: AutomatedTabStopRequirementResult | null = null;
        if (currentFocusedElement != null && elementFocusedBeforeTab != null) {
            result = this.tabStopsRequirementEvaluator.getKeyboardTrapResults(
                elementFocusedBeforeTab,
                currentFocusedElement,
            );
        }
        this.lastFocusedElement = currentFocusedElement;

        return result;
    };
}
