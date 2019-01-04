// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { IssueDetailsTextGenerator } from '../background/issue-details-text-generator';
import { FeatureFlags } from '../common/feature-flags';
import { HTMLElementUtils } from '../common/html-element-utils';
import { NavigatorUtils } from '../common/navigator-utils';
import { FeatureFlagStoreData } from '../common/types/store-data/feature-flag-store-data';
import { WindowUtils } from '../common/window-utils';
import { DetailsDialog } from './components/details-dialog';
import { DetailsDialogHandler } from './details-dialog-handler';
import { FrameCommunicator, IMessageRequest } from './frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from './frameCommunicators/window-message-handler';
import { IErrorMessageContent } from './frameCommunicators/window-message-marshaller';
import { MainWindowContext } from './main-window-context';
import { DecoratedAxeNodeResult, IHtmlElementAxeResults } from './scanner-utils';
import { ShadowUtils } from './shadow-utils';
import { getPlatform } from '../common/platform';

export interface DetailsDialogWindowMessage {
    data: IHtmlElementAxeResults;
    featureFlagStoreData: FeatureFlagStoreData;
}

export class DialogRenderer {
    private static readonly renderDetailsDialogCommand = 'insights.detailsDialog';
    private dom: Document;
    private renderer: typeof ReactDOM.render;
    private frameCommunicator: FrameCommunicator;
    private windowUtils: WindowUtils;
    private shadowUtils: ShadowUtils;

    constructor(
        dom: Document,
        renderer: typeof ReactDOM.render,
        frameCommunicator: FrameCommunicator,
        windowUtils: WindowUtils,
        shadowUtils: ShadowUtils,
    ) {
        this.dom = dom;
        this.renderer = renderer;
        this.frameCommunicator = frameCommunicator;
        this.windowUtils = windowUtils;
        this.shadowUtils = shadowUtils;

        if (this.isInMainWindow()) {
            this.frameCommunicator.subscribe(
                DialogRenderer.renderDetailsDialogCommand,
                this.processRequest,
            );
        }
    }

    public render(data: IHtmlElementAxeResults, featureFlagStoreData: FeatureFlagStoreData): void {
        if (!featureFlagStoreData[FeatureFlags.shadowDialog]) {
            if (this.dom.querySelector('.insights-dialog-container span') != null) {
                return;
            }
        } else {
            if (this.dom.querySelector('#insights-shadow-host').shadowRoot.querySelector('.insights-shadow-dialog-container') != null) {
                return;
            }
        }

        if (this.isInMainWindow()) {
            const mainWindowContext = MainWindowContext.get();
            mainWindowContext.getTargetPageActionMessageCreator().openIssuesDialog();

            const elementSelector: string = this.getElementSelector(data);
            const failedRules: IDictionaryStringTo<DecoratedAxeNodeResult> = this.getFailedRules(data);
            const target: string[] = this.getTarget(data);
            const dialogContainer: HTMLDivElement = featureFlagStoreData[FeatureFlags.shadowDialog] ? this.initializeDialogContainerInShadowDom() : this.appendDialogContainer();

            const deps = {
                issueDetailsTextGenerator: new IssueDetailsTextGenerator(new NavigatorUtils(window.navigator).getBrowserSpec()),
                windowUtils: this.windowUtils,
                targetPageActionMessageCreator: mainWindowContext.getTargetPageActionMessageCreator(),
            };

            this.renderer(
                <DetailsDialog
                    deps={deps}
                    failedRules={failedRules}
                    elementSelector={elementSelector}
                    target={target}
                    dialogHandler={new DetailsDialogHandler(new HTMLElementUtils())}
                    devToolStore={mainWindowContext.getDevToolStore()}
                    devToolsShortcut={getPlatform(this.windowUtils).devToolsShortcut}
                    devToolActionMessageCreator={mainWindowContext.getDevToolActionMessageCreator()}
                    featureFlagStoreData={featureFlagStoreData}
                />,
                dialogContainer,
            );
        } else {
            const windowMessageRequest: IMessageRequest<DetailsDialogWindowMessage> = {
                win: this.windowUtils.getTopWindow(),
                command: DialogRenderer.renderDetailsDialogCommand,
                message: { data: data, featureFlagStoreData: featureFlagStoreData },
            };
            this.frameCommunicator.sendMessage(windowMessageRequest);
        }
    }

    @autobind
    private processRequest(message: DetailsDialogWindowMessage, error: IErrorMessageContent, sourceWin: Window, responder?: FrameMessageResponseCallback): void {
        this.render(message.data, message.featureFlagStoreData);
    }

    private initializeDialogContainerInShadowDom(): HTMLDivElement {
        const shadowContainer = this.shadowUtils.getShadowContainer();
        const dialogContainer = this.dom.createElement('div');
        dialogContainer.className = 'insights-shadow-dialog-container';
        shadowContainer.appendChild(dialogContainer);
        return dialogContainer;
    }

    private appendDialogContainer(): HTMLDivElement {
        const dialogContainer = this.dom.createElement('div');
        dialogContainer.setAttribute('class', 'insights-dialog-container');
        this.dom.body.appendChild(dialogContainer);
        return dialogContainer;
    }

    private getFailedRules(data: IHtmlElementAxeResults): IDictionaryStringTo<DecoratedAxeNodeResult> {
        return data.ruleResults;
    }

    private getTarget(data: IHtmlElementAxeResults): string[] {
        return data.target;
    }

    private getElementSelector(data: IHtmlElementAxeResults): string {
        return data.target.join(';');
    }

    private isInMainWindow(): boolean {
        return this.windowUtils.getTopWindow() === this.windowUtils.getWindow();
    }
}
