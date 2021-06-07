// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import { IssueDetailsTextGenerator } from 'background/issue-details-text-generator';
import { NavigatorUtils } from 'common/navigator-utils';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { FixInstructionProcessor } from '../common/components/fix-instruction-processor';
import { RecommendColor } from 'common/components/recommend-color';
import { NewTabLink } from '../common/components/new-tab-link';
import { HTMLElementUtils } from '../common/html-element-utils';
import { getPlatform } from '../common/platform';
import { WindowUtils } from '../common/window-utils';
import { createIssueDetailsBuilder } from '../issue-filing/common/create-issue-details-builder';
import { IssueFilingUrlStringUtils } from '../issue-filing/common/issue-filing-url-string-utils';
import { PlainTextFormatter } from '../issue-filing/common/markup/plain-text-formatter';
import { AxeResultToIssueFilingDataConverter } from '../issue-filing/rule-result-to-issue-filing-data';
import { DictionaryStringTo } from '../types/common-types';
import { rootContainerId } from './constants';
import { DetailsDialogHandler } from './details-dialog-handler';
import { ErrorMessageContent } from './frameCommunicators/error-message-content';
import { FrameCommunicator, MessageRequest } from './frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from './frameCommunicators/window-message-handler';
import {
    LayeredDetailsDialogComponent,
    LayeredDetailsDialogDeps,
} from './layered-details-dialog-component';
import { MainWindowContext } from './main-window-context';
import { DecoratedAxeNodeResult, HtmlElementAxeResults } from './scanner-utils';

export interface DetailsDialogWindowMessage {
    data: HtmlElementAxeResults;
}

export type RenderDialog = (data: HtmlElementAxeResults) => void;

export class DialogRenderer {
    private static readonly renderDetailsDialogCommand = 'insights.detailsDialog';

    constructor(
        private readonly dom: Document,
        private readonly renderer: typeof ReactDOM.render,
        private readonly frameCommunicator: FrameCommunicator,
        private readonly htmlElementUtils: HTMLElementUtils,
        private readonly windowUtils: WindowUtils,
        private readonly navigatorUtils: NavigatorUtils,
        private readonly browserAdapter: BrowserAdapter,
        private readonly getRTLFunc: typeof getRTL,
        private readonly detailsDialogHandler: DetailsDialogHandler,
    ) {
        if (this.isInMainWindow()) {
            this.frameCommunicator.subscribe(
                DialogRenderer.renderDetailsDialogCommand,
                this.processRequest,
            );
        }
    }

    public render: RenderDialog = (data: HtmlElementAxeResults) => {
        if (this.isInMainWindow()) {
            const mainWindowContext = MainWindowContext.getMainWindowContext();
            mainWindowContext.getTargetPageActionMessageCreator().openIssuesDialog();

            const elementSelector: string = this.getElementSelector(data);
            const failedRules: DictionaryStringTo<DecoratedAxeNodeResult> = this.getFailedRules(
                data,
            );
            const target: string[] = this.getTarget(data);
            const dialogContainer: HTMLDivElement = this.appendDialogContainer();

            const issueDetailsTextGenerator = new IssueDetailsTextGenerator(
                IssueFilingUrlStringUtils,
                createIssueDetailsBuilder(PlainTextFormatter),
            );

            const fixInstructionProcessor = new FixInstructionProcessor();
            const recommendColor = new RecommendColor();

            const axeResultToIssueFilingDataConverter = new AxeResultToIssueFilingDataConverter(
                IssueFilingUrlStringUtils.getSelectorLastPart,
            );

            const deps: LayeredDetailsDialogDeps = {
                axeResultToIssueFilingDataConverter,
                fixInstructionProcessor,
                recommendColor,
                issueDetailsTextGenerator,
                windowUtils: this.windowUtils,
                navigatorUtils: this.navigatorUtils,
                targetPageActionMessageCreator: mainWindowContext.getTargetPageActionMessageCreator(),
                issueFilingActionMessageCreator: mainWindowContext.getIssueFilingActionMessageCreator(),
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
        } else {
            const windowMessageRequest: MessageRequest<DetailsDialogWindowMessage> = {
                win: this.windowUtils.getTopWindow(),
                command: DialogRenderer.renderDetailsDialogCommand,
                message: { data: data },
            };
            this.frameCommunicator.sendMessage(windowMessageRequest);
        }
    };

    private processRequest = (
        message: DetailsDialogWindowMessage,
        error: ErrorMessageContent,
        sourceWin: Window,
        responder?: FrameMessageResponseCallback,
    ): void => {
        this.render(message.data);
    };

    private appendDialogContainer(): HTMLDivElement {
        this.htmlElementUtils.deleteAllElements('.insights-dialog-container');

        const dialogContainer = this.dom.createElement('div');
        dialogContainer.setAttribute('class', 'insights-dialog-container');
        this.dom.querySelector(`#${rootContainerId}`).appendChild(dialogContainer);
        return dialogContainer;
    }

    private getFailedRules(
        data: HtmlElementAxeResults,
    ): DictionaryStringTo<DecoratedAxeNodeResult> {
        return data.ruleResults;
    }

    private getTarget(data: HtmlElementAxeResults): string[] {
        return data.target;
    }

    private getElementSelector(data: HtmlElementAxeResults): string {
        return data.target.join(';');
    }

    private isInMainWindow(): boolean {
        return this.windowUtils.getTopWindow() === this.windowUtils.getWindow();
    }
}
