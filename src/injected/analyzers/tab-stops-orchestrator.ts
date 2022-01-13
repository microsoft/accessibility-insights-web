// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowUtils } from 'common/window-utils';
import { AllFrameRunnerTarget } from 'injected/all-frame-runner';
import {
    TabStopRequirementResult,
    TabStopsRequirementEvaluator,
} from 'injected/tab-stops-requirement-evaluator';
import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { FocusableElement } from 'tabbable';

export class TabStopRequirementOrchestrator
    implements AllFrameRunnerTarget<TabStopRequirementResult>
{
    public readonly name: string = 'TabStopRequirementOrchestrator';
    private tabbableTabStops: FocusableElement[];
    private actualTabStops: Set<HTMLElement> = new Set();
    private latestVisitedTabStop: HTMLElement = null;
    private reportResults: (payload: TabStopRequirementResult) => Promise<void>;

    constructor(
        private readonly dom: Document,
        private readonly tabbableElementGetter: TabbableElementGetter,
        private readonly windowUtils: WindowUtils,
        private readonly tabStopsRequirementEvaluator: TabStopsRequirementEvaluator,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
    ) {}

    public start = () => {
        this.dom.addEventListener('keydown', this.onKeydownForFocusTraps);
        this.dom.addEventListener('focusin', this.addNewTabStop);
        this.tabbableTabStops = this.tabbableElementGetter.getRawElements();
        const tabbableFocusOrderResults =
            this.tabStopsRequirementEvaluator.getTabbableFocusOrderResults(this.tabbableTabStops);
        tabbableFocusOrderResults.forEach(result => {
            this.reportResults(result);
        });
    };

    public stop = () => {
        this.dom.removeEventListener('keydown', this.onKeydownForFocusTraps);
        this.dom.removeEventListener('focusin', this.addNewTabStop);
        const keyboardNavigationResults =
            this.tabStopsRequirementEvaluator.getKeyboardNavigationResults(
                this.tabbableTabStops,
                this.actualTabStops,
            );
        keyboardNavigationResults.forEach(this.reportResults);
    };

    public setResultCallback = (
        reportResultCallback: (payload: TabStopRequirementResult) => Promise<void>,
    ) => {
        this.reportResults = reportResultCallback;
    };

    public transformChildResultForParent = (
        result: TabStopRequirementResult,
        messageSourceFrame: HTMLIFrameElement,
    ): TabStopRequirementResult => {
        const frameSelector = this.getUniqueSelector(messageSourceFrame);
        result.selector = [frameSelector, ...result.selector];
        return result;
    };

    private addNewTabStop = (focusEvent: FocusEvent) => {
        const newTabStop = focusEvent.target as HTMLElement;
        if (this.actualTabStops.size > 0 && this.actualTabStops.has(newTabStop)) {
            return;
        }

        this.actualTabStops.add(newTabStop);
        this.latestVisitedTabStop = newTabStop;

        const result = this.tabStopsRequirementEvaluator.getFocusOrderResult(
            this.latestVisitedTabStop,
            newTabStop,
        );

        if (result == null) {
            return;
        }
        this.reportResults(result);
    };

    private onKeydownForFocusTraps = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') {
            return;
        }

        const oldElement = this.dom.activeElement;
        this.windowUtils.setTimeout(() => {
            const result = this.tabStopsRequirementEvaluator.getKeyboardTrapResults(
                this.dom.activeElement,
                oldElement,
            );
            if (result == null) {
                return;
            }
            this.reportResults(result);
        }, 500);
    };
}
