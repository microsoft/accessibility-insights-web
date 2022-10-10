// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AllFrameRunnerTarget } from 'injected/all-frame-runner';
import { FocusTrapsHandler } from 'injected/analyzers/focus-traps-handler';
import { TabStopsHandler } from 'injected/analyzers/tab-stops-handler';
import { ShadowDomFocusTracker } from 'injected/shadow-dom-focus-tracker';
import { AutomatedTabStopRequirementResult } from 'injected/tab-stop-requirement-result';

export class TabStopRequirementOrchestrator
    extends ShadowDomFocusTracker
    implements AllFrameRunnerTarget<AutomatedTabStopRequirementResult>
{
    public readonly commandSuffix: string = 'TabStopRequirementOrchestrator';
    public static readonly keyboardTrapTimeout: number = 500;
    private reportResults: (payload: AutomatedTabStopRequirementResult[]) => Promise<void>;

    constructor(
        dom: Document,
        private readonly tabStopsHandler: TabStopsHandler,
        private readonly focusTrapsHandler: FocusTrapsHandler,
        private readonly getUniqueSelector: (element: HTMLElement) => string,
    ) {
        super(dom);
    }

    public override start = async () => {
        this.tabStopsHandler.initialize();
        this.focusTrapsHandler.initialize();
        await super.start();
        this.dom.addEventListener('keydown', this.onKeydown);

        const tabbableFocusOrderResults = this.tabStopsHandler.getTabbableFocusOrderResults();
        if (tabbableFocusOrderResults.length > 0) {
            await this.reportResults(tabbableFocusOrderResults);
        }
    };

    public override stop = async () => {
        this.dom.removeEventListener('keydown', this.onKeydown);
        await super.stop();

        const keyboardNavigationResults = this.tabStopsHandler.getKeyboardNavigationResults();
        if (keyboardNavigationResults.length > 0) {
            await this.reportResults(keyboardNavigationResults);
        }
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

    protected override focusInCallback = async (target: HTMLElement): Promise<void> => {
        const result = await this.tabStopsHandler.handleNewTabStop(target as HTMLElement);

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
