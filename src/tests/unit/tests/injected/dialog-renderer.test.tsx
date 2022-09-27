// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@fluentui/utilities';
import { DevToolStore } from 'background/stores/dev-tools-store';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { HTMLElementUtils } from 'common/html-element-utils';
import { DevToolActionMessageCreator } from 'common/message-creators/dev-tool-action-message-creator';
import { IssueFilingActionMessageCreator } from 'common/message-creators/issue-filing-action-message-creator';
import { UserConfigMessageCreator } from 'common/message-creators/user-config-message-creator';
import { NavigatorUtils } from 'common/navigator-utils';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import {
    DecoratedAxeNodeResult,
    HtmlElementAxeResults,
} from 'common/types/store-data/visualization-scan-result-data';
import { WindowUtils } from 'common/window-utils';
import { rootContainerId } from 'injected/constants';
import { DetailsDialogHandler } from 'injected/details-dialog-handler';
import { DialogRenderer } from 'injected/dialog-renderer';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { SingleFrameMessenger } from 'injected/frameCommunicators/single-frame-messenger';
import { LayeredDetailsDialogComponent } from 'injected/layered-details-dialog-component';
import { MainWindowContext } from 'injected/main-window-context';
import { TargetPageActionMessageCreator } from 'injected/target-page-action-message-creator';
import { IssueFilingServiceProvider } from 'issue-filing/issue-filing-service-provider';
import * as ReactDOM from 'react-dom';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe(DialogRenderer, () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let windowUtilsMock: IMock<WindowUtils>;
    let navigatorUtilsMock: IMock<NavigatorUtils>;
    let frameMessenger: IMock<SingleFrameMessenger>;
    let mainWindowContext: MainWindowContext;
    let browserAdapter: IMock<BrowserAdapter>;
    let domMock: IMock<Document>;
    let getRTLMock: IMock<typeof getRTL>;
    let renderMock: IMock<typeof ReactDOM.render>;
    let detailsDialogHandlerMock: IMock<DetailsDialogHandler>;
    let windowStub: Window;

    let addMessageListenerCallback = async (
        commandMessage: CommandMessage,
        sourceWindow: Window,
    ): Promise<CommandMessageResponse | null> => {
        return null;
    };
    let rootContainerMock: IMock<HTMLElement>;

    const toolData = {} as ToolData;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        windowUtilsMock = Mock.ofType(WindowUtils);
        navigatorUtilsMock = Mock.ofType(NavigatorUtils);
        browserAdapter = Mock.ofType<BrowserAdapter>();
        detailsDialogHandlerMock = Mock.ofType<DetailsDialogHandler>();

        frameMessenger = Mock.ofType(SingleFrameMessenger);
        domMock = Mock.ofInstance({
            createElement: selector => null,
            body: {
                appendChild: selector => null,
            },
            querySelector: selector => null,
            querySelectorAll: selector => null,
            appendChild: node => {},
        } as any);

        renderMock = Mock.ofInstance(() => null);
        getRTLMock = Mock.ofInstance(() => null);
        rootContainerMock = Mock.ofType<HTMLElement>();

        const devToolStoreStrictMock = Mock.ofType<DevToolStore>(null, MockBehavior.Strict);
        const userConfigStoreStrictMock = Mock.ofType<UserConfigurationStore>(
            null,
            MockBehavior.Strict,
        );
        const devToolActionMessageCreatorMock = Mock.ofType(DevToolActionMessageCreator);
        const targetActionPageMessageCreatorMock = Mock.ofType(TargetPageActionMessageCreator);
        const issueFilingActionMessageCreatorMock = Mock.ofType(IssueFilingActionMessageCreator);
        const issueFilingServiceProviderMock = Mock.ofType(IssueFilingServiceProvider);
        const userConfigMessageCreatorMock = Mock.ofType(UserConfigMessageCreator);

        mainWindowContext = new MainWindowContext(
            devToolStoreStrictMock.object,
            userConfigStoreStrictMock.object,
            devToolActionMessageCreatorMock.object,
            targetActionPageMessageCreatorMock.object,
            issueFilingActionMessageCreatorMock.object,
            userConfigMessageCreatorMock.object,
            toolData,
            issueFilingServiceProviderMock.object,
        );

        windowStub = { mainWindowContext } as Window;
        windowUtilsMock.setup(m => m.getWindow()).returns(() => windowStub);
    });

    test('test render if dialog already exists', async () => {
        const ruleId = 'ruleId';
        const nodeResult: DecoratedAxeNodeResult = {
            any: [],
            all: [],
            none: [],
            status: false,
            ruleId: ruleId,
            selector: 'selector',
            html: 'html',
            failureSummary: 'failureSummary',
            help: 'help',
            id: 'id',
            guidanceLinks: [],
            helpUrl: 'help',
        };
        const expectedFailedRules: DictionaryStringTo<DecoratedAxeNodeResult> = {};
        expectedFailedRules[ruleId] = nodeResult;
        const testData: HtmlElementAxeResults = {
            ruleResults: expectedFailedRules,
            target: [ruleId],
        };

        setupDomMockForMainWindow();
        setupWindowUtilsMockAndFrameCommunicatorInMainWindow();
        setupRenderMockForVerifiable();
        const testObject = createDialogRenderer();

        expect(await testObject.render(testData)).toBeNull();

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
    });

    test('test render in main window', async () => {
        const ruleId = 'ruleId';
        const nodeResult: DecoratedAxeNodeResult = {
            any: [],
            all: [],
            none: [],
            status: false,
            ruleId: ruleId,
            selector: 'selector',
            html: 'html',
            failureSummary: 'failureSummary',
            help: 'help',
            id: 'id1',
            guidanceLinks: [],
            helpUrl: 'help',
        };
        const expectedFailedRules: DictionaryStringTo<DecoratedAxeNodeResult> = {};
        expectedFailedRules[ruleId] = nodeResult;
        const testData: HtmlElementAxeResults = {
            ruleResults: expectedFailedRules,
            target: [ruleId],
        };

        setupDomMockForMainWindow();
        setupWindowUtilsMockAndFrameCommunicatorInMainWindow();
        setupRenderMockForVerifiable();

        const testObject = createDialogRenderer();
        await testObject.render(testData);

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
    });

    test('test render in iframe', async () => {
        const testData: HtmlElementAxeResults = {
            ruleResults: null,
            target: [],
        };

        const commandMessage: CommandMessage = {
            command: 'insights.detailsDialog',
            payload: { data: testData },
        };

        setupWindowUtilsMockAndFrameCommunicatorInIframe(commandMessage);
        setupRenderMockForNeverVisited();

        const testObject = createDialogRenderer();
        await testObject.render(testData);

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
    });

    test('test main window subsribe and processRequest', async () => {
        const testData: HtmlElementAxeResults = {
            ruleResults: null,
            target: ['test string'],
        };

        const commandMessage: CommandMessage = {
            command: 'insights.detailsDialog',
            payload: {
                data: testData,
            },
        };

        setupDomMockForMainWindow();
        setupWindowUtilsMockAndFrameCommunicatorInMainWindow();
        setupRenderMockForVerifiable();

        createDialogRenderer();

        await addMessageListenerCallback(commandMessage, undefined);

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
    });

    test('test for getInstanceSelector', () => {
        const testData = {
            target: ['test string 1', 'test string 2'],
        };

        setupWindowUtilsMockAndFrameCommunicatorInMainWindow();

        const testObject = createDialogRenderer();
        const result = (testObject as any).getElementSelector(testData);

        expect(result).toBe(testData.target.join(';'));
        setupWindowUtilsMockAndFrameCommunicatorVerify();
    });

    function setupRenderMockForVerifiable(): void {
        renderMock
            .setup(render =>
                render(
                    It.is((detailsDialog: any) => {
                        return detailsDialog.type === LayeredDetailsDialogComponent;
                    }),
                    It.is((container: any) => container != null),
                ),
            )
            .verifiable(Times.once());
    }

    function setupRenderMockForNeverVisited(): void {
        renderMock
            .setup(it =>
                it(
                    It.is((detailsDialog: any) => detailsDialog != null),
                    It.is((container: any) => container != null),
                ),
            )
            .verifiable(Times.never());
    }

    function setupRenderMockVerify(): void {
        renderMock.verifyAll();
    }

    function setupWindowUtilsMockAndFrameCommunicatorInMainWindow(): void {
        windowUtilsMock
            .setup(wum => wum.getTopWindow())
            .returns(() => {
                return windowStub;
            })
            .verifiable(Times.atLeastOnce());
        windowUtilsMock.setup(wum => wum.getPlatform()).returns(() => 'Win32');
        frameMessenger
            .setup(fm => fm.addMessageListener(It.isValue('insights.detailsDialog'), It.isAny()))
            .callback(async (command, processMessage) => {
                addMessageListenerCallback = processMessage;
            })
            .verifiable(Times.once());
        frameMessenger
            .setup(fm => fm.sendMessageToWindow(windowStub, It.isAny()))
            .verifiable(Times.never());
    }

    function setupWindowUtilsMockAndFrameCommunicatorVerify(): void {
        windowUtilsMock.verifyAll();
        frameMessenger.verifyAll();
    }

    function setupWindowUtilsMockAndFrameCommunicatorInIframe(
        commandMessage: CommandMessage,
    ): void {
        const topWindowStub = {
            id: 'this is a different window than windowStub',
        } as unknown as Window;

        windowUtilsMock
            .setup(wum => wum.getTopWindow())
            .returns(() => topWindowStub)
            .verifiable(Times.atLeastOnce());

        frameMessenger
            .setup(fm => fm.addMessageListener(It.isValue(commandMessage.command), It.isAny()))
            .verifiable(Times.never());

        frameMessenger
            .setup(fm => fm.sendMessageToWindow(It.isAny(), It.isValue(commandMessage)))
            .verifiable(Times.once());
    }

    function setupDomMockForMainWindow(): void {
        htmlElementUtilsMock
            .setup(h => h.deleteAllElements('.insights-dialog-container'))
            .verifiable(Times.once());

        domMock
            .setup(dom => dom.querySelector(`#${rootContainerId}`))
            .returns(() => rootContainerMock.object)
            .verifiable(Times.once());

        rootContainerMock.setup(r => r.appendChild(It.isAny())).verifiable(Times.once());

        domMock
            .setup(dom => dom.createElement('div'))
            .returns(selector => document.createElement(selector))
            .verifiable(Times.once());
    }

    function setupDomMockVerify(): void {
        domMock.verifyAll();
        rootContainerMock.verifyAll();
    }

    function createDialogRenderer(): DialogRenderer {
        return new DialogRenderer(
            domMock.object,
            renderMock.object,
            frameMessenger.object,
            htmlElementUtilsMock.object,
            windowUtilsMock.object,
            navigatorUtilsMock.object,
            browserAdapter.object,
            getRTLMock.object,
            detailsDialogHandlerMock.object,
        );
    }
});
