// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';

import { DevToolStore } from 'background/stores/dev-tools-store';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { NavigatorUtils } from 'common/navigator-utils';
import { ToolData } from 'common/types/store-data/unified-data-interface';
import * as ReactDOM from 'react-dom';
import {
    GlobalMock,
    GlobalScope,
    IGlobalMock,
    IMock,
    It,
    Mock,
    MockBehavior,
    Times,
} from 'typemoq';
import { BrowserAdapter } from '../../../../common/browser-adapters/browser-adapter';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { DevToolActionMessageCreator } from '../../../../common/message-creators/dev-tool-action-message-creator';
import { IssueFilingActionMessageCreator } from '../../../../common/message-creators/issue-filing-action-message-creator';
import { UserConfigMessageCreator } from '../../../../common/message-creators/user-config-message-creator';
import { WindowUtils } from '../../../../common/window-utils';
import { rootContainerId } from '../../../../injected/constants';
import { DetailsDialogHandler } from '../../../../injected/details-dialog-handler';
import { DetailsDialogWindowMessage, DialogRenderer } from '../../../../injected/dialog-renderer';
import { ErrorMessageContent } from '../../../../injected/frameCommunicators/error-message-content';
import {
    FrameCommunicator,
    MessageRequest,
} from '../../../../injected/frameCommunicators/frame-communicator';
import { FrameMessageResponseCallback } from '../../../../injected/frameCommunicators/window-message-handler';
import { LayeredDetailsDialogComponent } from '../../../../injected/layered-details-dialog-component';
import { MainWindowContext } from '../../../../injected/main-window-context';
import { DecoratedAxeNodeResult, HtmlElementAxeResults } from '../../../../injected/scanner-utils';
import { TargetPageActionMessageCreator } from '../../../../injected/target-page-action-message-creator';
import { IssueFilingServiceProvider } from '../../../../issue-filing/issue-filing-service-provider';
import { DictionaryStringTo } from '../../../../types/common-types';

describe('DialogRendererTests', () => {
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let windowUtilsMock: IMock<WindowUtils>;
    let navigatorUtilsMock: IMock<NavigatorUtils>;
    let frameCommunicator: IMock<FrameCommunicator>;
    let mainWindowContext: MainWindowContext;
    let browserAdapter: IMock<BrowserAdapter>;
    let domMock: IMock<Document>;
    let getRTLMock: IMock<typeof getRTL>;
    let renderMock: IMock<typeof ReactDOM.render>;
    let detailsDialogHandlerMock: IMock<DetailsDialogHandler>;

    let subscribeCallback: (
        message: DetailsDialogWindowMessage,
        error: ErrorMessageContent,
        responder?: FrameMessageResponseCallback,
    ) => void;
    let getMainWindoContextMock: IGlobalMock<() => MainWindowContext>;
    let rootContainerMock: IMock<HTMLElement>;

    const toolData = {} as ToolData;

    beforeEach(() => {
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        windowUtilsMock = Mock.ofType(WindowUtils);
        navigatorUtilsMock = Mock.ofType(NavigatorUtils);
        browserAdapter = Mock.ofType<BrowserAdapter>();
        detailsDialogHandlerMock = Mock.ofType<DetailsDialogHandler>();

        getMainWindoContextMock = GlobalMock.ofInstance(
            MainWindowContext.getMainWindowContext,
            'getMainWindowContext',
            MainWindowContext,
        );
        frameCommunicator = Mock.ofType(FrameCommunicator);
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
    });

    test('test render if dialog already exists', () => {
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
        setUpGetMainWindowContextCalledOnce();
        const testObject = createDialogRenderer();

        GlobalScope.using(getMainWindoContextMock).with(() => {
            expect(testObject.render(testData)).toBeUndefined();
        });

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
        getMainWindoContextMock.verifyAll();
    });

    test('test render in main window', () => {
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
        setUpGetMainWindowContextCalledOnce();

        const testObject = createDialogRenderer();

        GlobalScope.using(getMainWindoContextMock).with(() => {
            testObject.render(testData);
        });

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
        getMainWindoContextMock.verifyAll();
    });

    test('test render in iframe', () => {
        const testData: HtmlElementAxeResults = {
            ruleResults: null,
            target: [],
        };
        const windowMessageRequest: MessageRequest<DetailsDialogWindowMessage> = {
            win: 'this is main window' as any,
            command: 'insights.detailsDialog',
            message: { data: testData },
        };

        setupWindowUtilsMockAndFrameCommunicatorInIframe(windowMessageRequest);
        setupRenderMockForNeverVisited();

        const testObject = createDialogRenderer();

        GlobalScope.using(getMainWindoContextMock).with(() => {
            testObject.render(testData);
        });

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
        getMainWindoContextMock.verifyAll();
    });

    test('test main window subsribe and processRequest', () => {
        const testData: HtmlElementAxeResults = {
            ruleResults: null,
            target: ['test string'],
        };
        const message: DetailsDialogWindowMessage = {
            data: testData,
        };

        setupDomMockForMainWindow();
        setupWindowUtilsMockAndFrameCommunicatorInMainWindow();
        setupRenderMockForVerifiable();
        setUpGetMainWindowContextCalledOnce();

        createDialogRenderer();

        GlobalScope.using(getMainWindoContextMock).with(() => {
            subscribeCallback(message, undefined, undefined);
        });

        setupDomMockVerify();
        setupWindowUtilsMockAndFrameCommunicatorVerify();
        setupRenderMockVerify();
        getMainWindoContextMock.verifyAll();
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

    function setUpGetMainWindowContextCalledOnce(): void {
        getMainWindoContextMock
            .setup(getter => getter())
            .returns(() => mainWindowContext)
            .verifiable(Times.once());
    }

    function setupRenderMockForVerifiable(): void {
        renderMock
            .setup(render =>
                render(
                    It.is(detailsDialog => {
                        return (detailsDialog.type as any) === LayeredDetailsDialogComponent;
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
        const win = 'this is main window';
        windowUtilsMock
            .setup(wum => wum.getTopWindow())
            .returns(() => {
                return win as any;
            })
            .verifiable(Times.atLeastOnce());
        windowUtilsMock
            .setup(wum => wum.getWindow())
            .returns(() => {
                return win as any;
            })
            .verifiable(Times.atLeastOnce());
        windowUtilsMock.setup(wum => wum.getPlatform()).returns(() => 'Win32');
        frameCommunicator
            .setup(fcm =>
                fcm.subscribe(
                    It.isValue('insights.detailsDialog'),
                    It.is(
                        (
                            param: (
                                message: DetailsDialogWindowMessage,
                                error: ErrorMessageContent,
                                sourceWin: Window,
                                responder?: FrameMessageResponseCallback,
                            ) => void,
                        ) => {
                            return param instanceof Function;
                        },
                    ),
                ),
            )
            .callback((command, cb) => {
                subscribeCallback = cb;
            })
            .verifiable(Times.once());
        frameCommunicator.setup(fcm => fcm.sendMessage(It.isAny())).verifiable(Times.never());
    }

    function setupWindowUtilsMockAndFrameCommunicatorVerify(): void {
        windowUtilsMock.verifyAll();
        frameCommunicator.verifyAll();
    }

    function setupWindowUtilsMockAndFrameCommunicatorInIframe(
        windowMessageRequest: MessageRequest<DetailsDialogWindowMessage>,
    ): void {
        windowUtilsMock
            .setup(wum => wum.getTopWindow())
            .returns(() => {
                return 'this is main window' as any;
            })
            .verifiable(Times.atLeastOnce());
        windowUtilsMock
            .setup(wum => wum.getWindow())
            .returns(() => {
                return 'this is iframe' as any;
            })
            .verifiable(Times.atLeastOnce());

        frameCommunicator
            .setup(fcm => fcm.subscribe(It.isAny(), It.isAny()))
            .verifiable(Times.never());
        frameCommunicator
            .setup(fcm => fcm.sendMessage(It.isValue(windowMessageRequest)))
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
            frameCommunicator.object,
            htmlElementUtilsMock.object,
            windowUtilsMock.object,
            navigatorUtilsMock.object,
            browserAdapter.object,
            getRTLMock.object,
            detailsDialogHandlerMock.object,
        );
    }
});
