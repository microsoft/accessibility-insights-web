// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@fluentui/utilities';
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { FixInstructionProcessor } from 'common/components/fix-instruction-processor';
import { NewTabLink } from 'common/components/new-tab-link';
import { RecommendColor } from 'common/components/recommend-color';
import { HTMLElementUtils } from 'common/html-element-utils';
import { NavigatorUtils } from 'common/navigator-utils';
import { getPlatform } from 'common/platform';
import { TargetHelper } from 'common/target-helper';
import {
    DecoratedAxeNodeResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { WindowUtils } from 'common/window-utils';
import { extractRelatedSelectors } from 'injected/adapters/extract-related-selectors';
import { DialogRenderer } from 'injected/dialog-renderer';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { createIssueDetailsBuilder } from 'issue-filing/common/create-issue-details-builder';
import { IssueFilingUrlStringUtils } from 'issue-filing/common/issue-filing-url-string-utils';
import { PlainTextFormatter } from 'issue-filing/common/markup/plain-text-formatter';
import { AxeResultToIssueFilingDataConverter } from 'issue-filing/rule-result-to-issue-filing-data';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Target } from 'scanner/iruleresults';
import { DictionaryStringTo } from 'types/common-types';
import { rootContainerId } from './constants';
import { DetailsDialogHandler } from './details-dialog-handler';
import { SingleFrameMessenger } from './frameCommunicators/single-frame-messenger';
import {
    LayeredDetailsDialogComponent,
    LayeredDetailsDialogDeps,
} from './layered-details-dialog-component';
import { MainWindowContext } from './main-window-context';

export class DialogRendererImpl implements DialogRenderer {
    private static readonly renderDetailsDialogCommand = 'insights.detailsDialog';

    constructor(
        private readonly dom: Document,
        private readonly renderer: typeof ReactDOM.render,
        private readonly frameMessenger: SingleFrameMessenger,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly windowUtils: WindowUtils,
        private readonly navigatorUtils: NavigatorUtils,
        private readonly browserAdapter: BrowserAdapter,
        private readonly getRTLFunc: typeof getRTL,
        private readonly detailsDialogHandler: DetailsDialogHandler,
    ) {
        if (this.windowUtils.isTopWindow()) {
            this.frameMessenger.addMessageListener(
                DialogRendererImpl.renderDetailsDialogCommand,
                this.processRequest,
            );
        }
    }

    public render = async (data: HtmlElementAxeResults): Promise<CommandMessageResponse | null> => {
        if (this.windowUtils.isTopWindow()) {
            const mainWindowContext = MainWindowContext.fromWindow(this.windowUtils.getWindow());
            mainWindowContext.getTargetPageActionMessageCreator().openIssuesDialog();

            const elementSelector: string = this.getElementSelector(data);
            const failedRules: DictionaryStringTo<DecoratedAxeNodeResult> =
                this.getFailedRules(data);
            const target: Target = this.getTarget(data);
            const dialogContainer: HTMLDivElement = this.appendDialogContainer();

            const issueDetailsTextGenerator = new IssueDetailsTextGenerator(
                IssueFilingUrlStringUtils,
                createIssueDetailsBuilder(PlainTextFormatter),
            );

            const fixInstructionProcessor = new FixInstructionProcessor();
            const recommendColor = new RecommendColor();
            const axeResultToIssueFilingDataConverter = new AxeResultToIssueFilingDataConverter(
                IssueFilingUrlStringUtils.getSelectorLastPart,
                extractRelatedSelectors,
            );

            const deps: LayeredDetailsDialogDeps = {
                axeResultToIssueFilingDataConverter,
                fixInstructionProcessor,
                recommendColor,
                issueDetailsTextGenerator,
                windowUtils: this.windowUtils,
                navigatorUtils: this.navigatorUtils,
                targetPageActionMessageCreator:
                    mainWindowContext.getTargetPageActionMessageCreator(),
                issueFilingActionMessageCreator:
                    mainWindowContext.getIssueFilingActionMessageCreator(),
                browserAdapter: this.browserAdapter,
                getRTL: this.getRTLFunc,
                toolData: mainWindowContext.getToolData(),
                issueFilingServiceProvider: mainWindowContext.getIssueFilingServiceProvider(),
                userConfigMessageCreator: mainWindowContext.getUserConfigMessageCreator(),
                LinkComponent: NewTabLink,
            };

            this.renderer(
                <LayeredDetailsDialogComponent
                    deps={deps}
                    failedRules={failedRules}
                    elementSelector={elementSelector}
                    target={target}
                    dialogHandler={this.detailsDialogHandler}
                    devToolStore={mainWindowContext.getDevToolStore()}
                    userConfigStore={mainWindowContext.getUserConfigStore()}
                    devToolsShortcut={getPlatform(this.windowUtils).devToolsShortcut}
                    devToolActionMessageCreator={mainWindowContext.getDevToolActionMessageCreator()}
                />,
                dialogContainer,
            );
            return null;
        } else {
            const topWindow = this.windowUtils.getTopWindow();
            if (topWindow == null) {
                // This is only expected if this frame's window has been detached from the
                // corresponding browser navigable entity, eg because it is in the process of
                // unloading. Particularly, topWindow will *not* be null merely if the top window
                // is across an origin boundary. If we're in this state, we intentionally abandon
                // rendering.
                return null;
            }

            const message: CommandMessage = {
                command: DialogRendererImpl.renderDetailsDialogCommand,
                payload: { data: data },
            };
            return await this.frameMessenger.sendMessageToWindow(topWindow, message);
        }
    };

    private processRequest = async (
        commandMessage: CommandMessage,
        sourceWindow: Window,
    ): Promise<CommandMessageResponse | null> => {
        const detailsDialogWindowMessage = commandMessage.payload;
        await this.render(detailsDialogWindowMessage.data);
        return null;
    };

    private appendDialogContainer(): HTMLDivElement {
        this.htmlElementUtils.deleteAllElements('.insights-dialog-container');

        const dialogContainer = this.dom.createElement('div');
        dialogContainer.setAttribute('class', 'insights-dialog-container');
        const rootContainer = this.dom.querySelector(`#${rootContainerId}`);
        if (rootContainer == null) {
            throw new Error(`Could not find #${rootContainerId} element to inject dialog into`);
        }
        rootContainer.appendChild(dialogContainer);
        return dialogContainer;
    }

    private getFailedRules(
        data: HtmlElementAxeResults,
    ): DictionaryStringTo<DecoratedAxeNodeResult> {
        return data.ruleResults;
    }

    private getTarget(data: HtmlElementAxeResults): Target {
        return data.target;
    }

    private getElementSelector(data: HtmlElementAxeResults): string {
        return TargetHelper.getSelectorFromTarget(data.target);
    }
}
