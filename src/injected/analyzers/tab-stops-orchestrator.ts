// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AllFrameRunnerTarget } from 'injected/all-frame-runner';
import { FocusTrapsHandler } from 'injected/analyzers/focus-traps-handler';
import { TabStopsHandler } from 'injected/analyzers/tab-stops-handler';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';

export class TabStopRequirementOrchestrator
    implements AllFrameRunnerTarget<AutomatedTabStopRequirementResult[]>
{
    public readonly commandSuffix: string = 'TabStopRequirementOrchestrator';
    public static readonly keyboardTrapTimeout: number = 500;
    private reportResults: (payload: AutomatedTabStopRequirementResult[]) => Promise<void>;

    constructor(
        private readonly dom: Document,
        private readonly tabStopsHandler: TabStopsHandler,
        private readonly focusTrapsHandler: FocusTrapsHandler,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
    ) {}

    public start = async () => {
        this.tabStopsHandler.initialize();
        this.focusTrapsHandler.initialize();

        this.dom.addEventListener('keydown', this.onKeydown);
        this.dom.addEventListener('focusin', this.onFocusIn);

        const tabbableFocusOrderResults = this.tabStopsHandler.getTabbableFocusOrderResults();
        await this.reportResults(tabbableFocusOrderResults);
    };

    public stop = async () => {
        this.dom.removeEventListener('keydown', this.onKeydown);
        this.dom.removeEventListener('focusin', this.onFocusIn);

        const keyboardNavigationResults = this.tabStopsHandler.getKeyboardNavigationResults();
        await this.reportResults(keyboardNavigationResults);
    };

    public setResultCallback = (
        reportResultCallback: (payload: AutomatedTabStopRequirementResult[]) => Promise<void>,
    ) => {
        this.reportResults = reportResultCallback;
    };

    public transformChildResultForParent = (
        results: AutomatedTabStopRequirementResult[],
        messageSourceFrame: HTMLIFrameElement,
    ): AutomatedTabStopRequirementResult[] => {
        const frameSelector = this.getUniqueSelector(messageSourceFrame);
        results.forEach(result => {
            result.selector = [frameSelector, ...result.selector];
        });
        return results;
    };

    private onFocusIn = async (focusEvent: FocusEvent) => {
        const result = await this.tabStopsHandler.handleNewTabStop(
            focusEvent.target as HTMLElement,
        );

        if (result == null) {
            return;
        }
        await this.reportResults([result]);
    };

    private onKeydown = async (e: KeyboardEvent) => {
        if (e.key !== 'Tab') {
            return;
        }

        const result = await this.focusTrapsHandler.handleTabPressed(this.dom);

        if (result == null) {
            return;
        }
        await this.reportResults([result]);
    };
}
