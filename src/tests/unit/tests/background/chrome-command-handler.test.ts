// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { IVisualizationTogglePayload } from '../../../../background/actions/action-payloads';
import { ChromeAdapter, BrowserAdapter } from '../../../../background/browser-adapter';
import { ChromeCommandHandler } from '../../../../background/chrome-command-handler';
import { Interpreter } from '../../../../background/interpreter';
import { TabContextStoreHub } from '../../../../background/stores/tab-context-store-hub';
import { VisualizationStore } from '../../../../background/stores/visualization-store';
import { TabContext, TabToContextMap } from '../../../../background/tab-context';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { DisplayableStrings } from '../../../../common/constants/displayable-strings';
import { IBaseStore } from '../../../../common/istore';
import { Messages } from '../../../../common/messages';
import { NotificationCreator } from '../../../../common/notification-creator';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { TelemetryEventSource, ToggleTelemetryData } from '../../../../common/telemetry-events';
import { IVisualizationStoreData } from '../../../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { UrlValidator } from '../../../../common/url-validator';
import { VisualizationStoreDataBuilder } from '../../Common/visualization-store-data-builder';

let testSubject: ChromeCommandHandler;
let chromeAdapterMock: IMock<BrowserAdapter>;
let urlValidatorMock: IMock<UrlValidator>;
let tabToContextMap: TabToContextMap;
let visualizationStoreMock: IMock<IBaseStore<IVisualizationStoreData>>;
let interpreterMock: IMock<Interpreter>;
let commandCallback: (commandId: string) => void;
let tabQueryCallback: (tabs: chrome.tabs.Tab[]) => void;
let existingTabId: number;
let notificationCreatorMock: IMock<NotificationCreator>;
let storeState: IVisualizationStoreData;

const visualizationConfigurationFactory = new VisualizationConfigurationFactory();
const testSource: TelemetryEventSource = TelemetryEventSource.ShortcutCommand;

describe('ChromeCommandHandlerTest', () => {
    beforeEach(() => {
        interpreterMock = Mock.ofType(Interpreter, MockBehavior.Strict);

        visualizationStoreMock = Mock.ofType(VisualizationStore, MockBehavior.Strict);
        visualizationStoreMock.setup(vs => vs.getState()).returns(() => storeState);

        tabToContextMap = {};

        existingTabId = 1;
        tabToContextMap[existingTabId] = new TabContext(interpreterMock.object, {
            visualizationStore: visualizationStoreMock.object,
        } as TabContextStoreHub);

        chromeAdapterMock = Mock.ofType(ChromeAdapter);
        chromeAdapterMock
            .setup(ca => ca.addCommandListener(It.isAny()))
            .callback(callback => (commandCallback = callback))
            .verifiable();

        urlValidatorMock = Mock.ofType(UrlValidator);
        notificationCreatorMock = Mock.ofType(NotificationCreator);

        testSubject = new ChromeCommandHandler(
            tabToContextMap,
            chromeAdapterMock.object,
            urlValidatorMock.object,
            notificationCreatorMock.object,
            new VisualizationConfigurationFactory(),
            new TelemetryDataFactory(),
        );

        testSubject.initialize();
    });

    it('verify for unknown command', async done => {
        setupUrlValidator(It.isAny(), true);

        storeState = new VisualizationStoreDataBuilder().build();

        setupTabQueryCall();

        commandCallback('some command');
        tabQueryCallback([{ id: existingTabId } as chrome.tabs.Tab]);

        interpreterMock.verifyAll();
        urlValidatorMock.verifyAll();
        done();
    });

    it('verify for command when tab context does not exist', async done => {
        const configuration = visualizationConfigurationFactory.getConfiguration(VisualizationType.Issues);
        setupTabQueryCall();
        commandCallback(configuration.chromeCommand);
        tabQueryCallback([{ id: 12 } as chrome.tabs.Tab]);

        interpreterMock.verifyAll();
        done();
    });

    it('enables issues', async done => {
        const test = VisualizationType.Issues;
        setupUrlValidator('testurl', true);

        storeState = new VisualizationStoreDataBuilder()
            .withHeadingsEnable()
            .withLandmarksEnable()
            .withColorEnable()
            .withTabStopsEnable()
            .build();

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = true;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                notificationCreatorMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        const enableMessage = configuration.displayableData.enableMessage;

        notificationCreatorMock.setup(nc => nc.createNotification(enableMessage)).verifiable();

        setupTabQueryCall();
        commandCallback(configuration.chromeCommand);
        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('disable issues', async done => {
        const test = VisualizationType.Issues;
        storeState = new VisualizationStoreDataBuilder().withEnable(test).build();

        setupTabQueryCall();

        setupUrlValidator('testurl', true);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = false;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        const configuration = visualizationConfigurationFactory.getConfiguration(VisualizationType.Issues);
        commandCallback(configuration.chromeCommand);
        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('enables landmarks', async done => {
        const test = VisualizationType.Landmarks;
        setupUrlValidator('testurl', true);

        storeState = new VisualizationStoreDataBuilder()
            .withIssuesEnable()
            .withHeadingsEnable()
            .withColorEnable()
            .withTabStopsEnable()
            .build();

        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = true;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                interpreterMock.verifyAll();
                urlValidatorMock.verifyAll();
                notificationCreatorMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        const enableMessage = configuration.displayableData.enableMessage;

        notificationCreatorMock.setup(nc => nc.createNotification(enableMessage)).verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('disable landmarks', async done => {
        setupUrlValidator('testurl', true);

        const test = VisualizationType.Landmarks;
        storeState = new VisualizationStoreDataBuilder().withEnable(test).build();

        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = false;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                interpreterMock.verifyAll();
                urlValidatorMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('enables headings', async done => {
        const test = VisualizationType.Headings;
        setupUrlValidator('testurl', true);

        storeState = new VisualizationStoreDataBuilder()
            .withLandmarksEnable()
            .withTabStopsEnable()
            .withColorEnable()
            .withIssuesEnable()
            .build();

        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = true;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                notificationCreatorMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        const enableMessage = configuration.displayableData.enableMessage;

        notificationCreatorMock.setup(nc => nc.createNotification(enableMessage)).verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('disable headings', async done => {
        setupUrlValidator('testurl', true);

        const test = VisualizationType.Headings;
        storeState = new VisualizationStoreDataBuilder().withEnable(test).build();

        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = false;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('enables tab stops', async done => {
        setupUrlValidator('testurl', true);

        storeState = new VisualizationStoreDataBuilder()
            .withHeadingsEnable()
            .withLandmarksEnable()
            .withColorEnable()
            .withIssuesEnable()
            .build();

        setupTabQueryCall();

        const test = VisualizationType.TabStops;
        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = true;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test: VisualizationType.TabStops,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                notificationCreatorMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        const enableMessage = configuration.displayableData.enableMessage;

        notificationCreatorMock.setup(nc => nc.createNotification(enableMessage)).verifiable(Times.never());

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('disable tab stops', async done => {
        const test = VisualizationType.TabStops;
        storeState = new VisualizationStoreDataBuilder().withEnable(test).build();

        setupTabQueryCall();

        setupUrlValidator('testurl', true);

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = false;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('enable color', async done => {
        const test = VisualizationType.Color;
        storeState = new VisualizationStoreDataBuilder()
            .withHeadingsEnable()
            .withIssuesEnable()
            .withTabStopsEnable()
            .withLandmarksEnable()
            .build();

        setupTabQueryCall();

        setupUrlValidator('testurl', true);

        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = true;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                notificationCreatorMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        const enableMessage = configuration.displayableData.enableMessage;

        notificationCreatorMock.setup(nc => nc.createNotification(enableMessage)).verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('disable color', async done => {
        storeState = new VisualizationStoreDataBuilder().withColorEnable().build();

        setupTabQueryCall();

        setupUrlValidator('testurl', true);

        const test = VisualizationType.Color;
        const configuration = visualizationConfigurationFactory.getConfiguration(test);
        commandCallback(configuration.chromeCommand);

        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                const enabled = false;
                const telemetry: ToggleTelemetryData = {
                    triggeredBy: 'shortcut',
                    enabled,
                    source: testSource,
                };

                const payload: IVisualizationTogglePayload = {
                    enabled,
                    telemetry,
                    test,
                };

                const expectedMessage: IMessage = {
                    tabId: existingTabId,
                    type: Messages.Visualizations.Common.Toggle,
                    payload,
                };

                expect(message).toEqual(expectedMessage);
                urlValidatorMock.verifyAll();
                interpreterMock.verifyAll();
                done();
                return true;
            })
            .verifiable();

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
    });

    it('do nothing if scanning', async done => {
        setupUrlValidator('testurl', true);

        storeState = new VisualizationStoreDataBuilder()
            .withEnable(VisualizationType.Issues)
            .withEnable(VisualizationType.Headings)
            .with('scanning', 'headings')
            .build();
        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(VisualizationType.Issues);
        commandCallback(configuration.chromeCommand);

        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());

        tabQueryCallback([{ id: existingTabId, url: 'testurl' } as chrome.tabs.Tab]);
        urlValidatorMock.verifyAll();
        interpreterMock.verifyAll();
        done();
    });

    it('has no acccess to file url scanning', async done => {
        const url = 'file://url';
        setupUrlValidator(url, false);

        notificationCreatorMock.setup(nc => nc.createNotification(DisplayableStrings.fileUrlDoesNotHaveAccess)).verifiable();

        const type = VisualizationType.Issues;
        storeState = new VisualizationStoreDataBuilder().withEnable(type).build();
        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(type);
        commandCallback(configuration.chromeCommand);

        tabQueryCallback([{ id: existingTabId, url: url } as chrome.tabs.Tab]);
        urlValidatorMock.verifyAll();
        done();
    });

    it('has no acccess to chrome url scanning', async done => {
        const url = 'chrome://url';

        setupUrlValidator(url, false);

        notificationCreatorMock.setup(nc => nc.createNotification(DisplayableStrings.fileUrlDoesNotHaveAccess)).verifiable();

        notificationCreatorMock.setup(nc => nc.createNotification(DisplayableStrings.urlNotScannable.join('\n'))).verifiable();

        const type = VisualizationType.Issues;
        storeState = new VisualizationStoreDataBuilder().withEnable(type).build();
        setupTabQueryCall();

        const configuration = visualizationConfigurationFactory.getConfiguration(type);
        commandCallback(configuration.chromeCommand);

        tabQueryCallback([{ id: existingTabId, url: url } as chrome.tabs.Tab]);
        urlValidatorMock.verifyAll();
        done();
    });
});

function setupTabQueryCall() {
    chromeAdapterMock
        .setup(x => x.tabsQuery(It.isAny(), It.isAny()))
        .returns((params, callback) => {
            const expected = { active: true, currentWindow: true };
            expect(params).toEqual(expected);
            tabQueryCallback = callback;
        })
        .verifiable();
}

function setupUrlValidator(url: string, isSupportedUrl: boolean) {
    urlValidatorMock
        .setup(uV => uV.isSupportedUrl(url, chromeAdapterMock.object))
        .returns(async () => {
            return isSupportedUrl;
        })
        .verifiable();
}
