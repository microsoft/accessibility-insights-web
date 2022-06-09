// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowUtils } from 'common/window-utils';
import { AllFrameRunnerTarget } from 'injected/all-frame-runner';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';
import { TabStopsRequirementEvaluator } from 'injected/tab-stops-requirement-evaluator';
import { TabbableElementGetter } from 'injected/tabbable-element-getter';
import { FocusableElement } from 'tabbable';

export class TabStopRequirementOrchestrator
    implements AllFrameRunnerTarget<AutomatedTabStopRequirementResult>
{
    public readonly commandSuffix: string = 'TabStopRequirementOrchestrator';
    public static readonly keyboardTrapTimeout: number = 500;
    private reportResults: (payload: AutomatedTabStopRequirementResult) => Promise<void>;

    private tabbableTabStops: FocusableElement[];
    private actualTabStops: Set<HTMLElement> = new Set();
    private latestVisitedTabStop: HTMLElement | null = null;

    constructor(
        private readonly dom: Document,
        private readonly tabbableElementGetter: TabbableElementGetter,
        private readonly windowUtils: WindowUtils,
        private readonly tabStopsRequirementEvaluator: TabStopsRequirementEvaluator,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
    ) {}

    private resetFields = () => {
        this.tabbableTabStops = [];
        this.actualTabStops = new Set();
        this.latestVisitedTabStop = null;
    };

    public start = async () => {
        this.dom.addEventListener('keydown', this.onKeydownForFocusTraps);
        this.dom.addEventListener('focusin', this.addNewTabStop);

        this.tabbableTabStops = this.tabbableElementGetter.getRawElements();
        const tabbableFocusOrderResults =
            this.tabStopsRequirementEvaluator.getTabbableFocusOrderResults(this.tabbableTabStops);
        await Promise.all(tabbableFocusOrderResults.map(result => this.reportResults(result)));
    };

    public stop = async () => {
        this.dom.removeEventListener('keydown', this.onKeydownForFocusTraps);
        this.dom.removeEventListener('focusin', this.addNewTabStop);

        const keyboardNavigationResults =
            this.tabStopsRequirementEvaluator.getKeyboardNavigationResults(
                this.tabbableTabStops,
                this.actualTabStops,
            );
        await Promise.all(keyboardNavigationResults.map(this.reportResults));
        this.resetFields();
    };

    public setResultCallback = (
        reportResultCallback: (payload: AutomatedTabStopRequirementResult) => Promise<void>,
    ) => {
        this.reportResults = reportResultCallback;
    };

    public transformChildResultForParent = (
        result: AutomatedTabStopRequirementResult,
        messageSourceFrame: HTMLIFrameElement,
    ): AutomatedTabStopRequirementResult => {
        const frameSelector = this.getUniqueSelector(messageSourceFrame);
        result.selector = [frameSelector, ...result.selector];
        return result;
    };

    private addNewTabStop = async (focusEvent: FocusEvent) => {
        const newTabStop = focusEvent.target as HTMLElement;

        if (this.latestVisitedTabStop == null) {
            this.actualTabStops.add(newTabStop);
            this.latestVisitedTabStop = newTabStop;
            return;
        }

        if (this.actualTabStops.has(newTabStop)) {
            this.latestVisitedTabStop = newTabStop;
            return;
        }

        this.actualTabStops.add(newTabStop);
        const result = this.tabStopsRequirementEvaluator.getFocusOrderResult(
            this.latestVisitedTabStop,
            newTabStop,
        );
        this.latestVisitedTabStop = newTabStop;

        if (result == null) {
            return;
        }
        await this.reportResults(result);
    };

    private onKeydownForFocusTraps = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || this.dom.activeElement === this.dom.body) {
            return;
        }

        const oldElement = this.dom.activeElement;
        this.windowUtils.setTimeout(async () => {
            const newElement = this.dom.activeElement;
            if (oldElement == null || newElement == null) {
                return;
            }
            const result = this.tabStopsRequirementEvaluator.getKeyboardTrapResults(
                newElement,
                oldElement,
            );
            if (result == null) {
                return;
            }
            await this.reportResults(result);
        }, TabStopRequirementOrchestrator.keyboardTrapTimeout);
    };
}
