// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BrowserAdapter, ChromeAdapter } from '../../../../background/browser-adapter';
import { ChromeCommandHandler } from '../../../../background/chrome-command-handler';
import { Interpreter } from '../../../../background/interpreter';
import { UserConfigurationStore } from '../../../../background/stores/global/user-configuration-store';
import { TabContextStoreHub } from '../../../../background/stores/tab-context-store-hub';
import { VisualizationStore } from '../../../../background/stores/visualization-store';
import { TabContext, TabToContextMap } from '../../../../background/tab-context';
import { BaseStore } from '../../../../common/base-store';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { DisplayableStrings } from '../../../../common/constants/displayable-strings';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { NotificationCreator } from '../../../../common/notification-creator';
import { TelemetryDataFactory } from '../../../../common/telemetry-data-factory';
import { TelemetryEventSource } from '../../../../common/telemetry-events';
import { VisualizationStoreData } from '../../../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { UrlValidator } from '../../../../common/url-validator';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

let testSubject: ChromeCommandHandler;
let chromeAdapterMock: IMock<BrowserAdapter>;
let urlValidatorMock: IMock<UrlValidator>;
let tabToContextMap: TabToContextMap;
let visualizationStoreMock: IMock<BaseStore<VisualizationStoreData>>;
let interpreterMock: IMock<Interpreter>;
let commandCallback: (commandId: string) => Promise<void>;
let existingTabId: number;
let notificationCreatorMock: IMock<NotificationCreator>;
let storeState: VisualizationStoreData;
let simulatedIsFirstTimeUserConfiguration: boolean;
let simulatedIsSupportedUrlResponse: boolean;
let simulatedActiveTabId: Number;
let simulatedActiveTabUrl: string;

const visualizationConfigurationFactory = new VisualizationConfigurationFactory();
const testSource: TelemetryEventSource = TelemetryEventSource.ShortcutCommand;

describe('ChromeCommandHandlerTest', () => {
    beforeEach(() => {
        interpreterMock = Mock.ofType(Interpreter);

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
            .callback(callback => {
                commandCallback = callback;
            })
            .verifiable();
        chromeAdapterMock
            .setup(ca => ca.tabsQuery(It.isValue({ active: true, currentWindow: true }), It.isAny()))
            .returns((_, callback) => {
                callback([{ id: simulatedActiveTabId, url: simulatedActiveTabUrl } as chrome.tabs.Tab]);
            })
            .verifiable();

        urlValidatorMock = Mock.ofType(UrlValidator);
        urlValidatorMock
            .setup(uV => uV.isSupportedUrl(It.isAny(), chromeAdapterMock.object))
            .returns(async () => simulatedIsSupportedUrlResponse)
            .verifiable();

        notificationCreatorMock = Mock.ofType(NotificationCreator);

        const userConfigurationStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);
        userConfigurationStoreMock
            .setup(s => s.getState())
            .returns(() => {
                return {
                    isFirstTime: simulatedIsFirstTimeUserConfiguration,
                    enableTelemetry: true,
                    enableHighContrast: false,
                    bugService: 'none',
                    bugServicePropertiesMap: {},
                };
            });

        testSubject = new ChromeCommandHandler(
            tabToContextMap,
            chromeAdapterMock.object,
            urlValidatorMock.object,
            notificationCreatorMock.object,
            new VisualizationConfigurationFactory(),
            new TelemetryDataFactory(),
            userConfigurationStoreMock.object,
        );

        testSubject.initialize();

        // Individual tests may override these; these are preset to simple/arbitrary values
        // that would enable normal happy-path operation of the testSubject.
        storeState = new VisualizationStoreDataBuilder().build();
        simulatedIsFirstTimeUserConfiguration = false;
        simulatedActiveTabId = existingTabId;
        simulatedActiveTabUrl = 'https://arbitrary.url';
        simulatedIsSupportedUrlResponse = true;
    });

    const supportedVisualizationTypes = [
        ['Issues', VisualizationType.Issues],
        ['Landmarks', VisualizationType.Landmarks],
        ['Headings', VisualizationType.Headings],
        ['Color', VisualizationType.Color],
        ['TabStops', VisualizationType.TabStops],
    ];

    const visualizationTypesThatShouldNotifyOnEnable = [
        ['Issues', VisualizationType.Issues],
        ['Landmarks', VisualizationType.Landmarks],
        ['Headings', VisualizationType.Headings],
        ['Color', VisualizationType.Color],
    ];

    const visualizationTypesThatShouldNotNotifyOnEnable = [['TabStops', VisualizationType.TabStops]];

    it.each(supportedVisualizationTypes)(`enables previously-disabled '%s' visualizer`, async (_, visualizationType) => {
        storeState = new VisualizationStoreDataBuilder().withDisable(visualizationType).build();
        const configuration = visualizationConfigurationFactory.getConfiguration(visualizationType);

        let receivedMessage: Message;
        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                receivedMessage = message;
                return true;
            })
            .verifiable();

        await commandCallback(configuration.chromeCommand);

        expect(receivedMessage).toEqual({
            tabId: existingTabId,
            type: Messages.Visualizations.Common.Toggle,
            payload: {
                enabled: true,
                telemetry: {
                    triggeredBy: 'shortcut',
                    enabled: true,
                    source: testSource,
                },
                test: visualizationType,
            },
        });

        interpreterMock.verifyAll();
    });

    it.each(supportedVisualizationTypes)(`disables previously-enabled '%s' visualizer`, async (_, visualizationType) => {
        storeState = new VisualizationStoreDataBuilder().withEnable(visualizationType).build();
        const configuration = visualizationConfigurationFactory.getConfiguration(visualizationType);

        let receivedMessage: Message;
        interpreterMock
            .setup(x => x.interpret(It.isAny()))
            .returns(message => {
                receivedMessage = message;
                return true;
            })
            .verifiable();

        await commandCallback(configuration.chromeCommand);

        expect(receivedMessage).toEqual({
            tabId: existingTabId,
            type: Messages.Visualizations.Common.Toggle,
            payload: {
                enabled: false,
                telemetry: {
                    triggeredBy: 'shortcut',
                    enabled: false,
                    source: testSource,
                },
                test: visualizationType,
            },
        });

        interpreterMock.verifyAll();
    });

    it.each(visualizationTypesThatShouldNotifyOnEnable)(
        `emits the expected 'enabled' notification when enabling '%s' visualizer`,
        async (_, visualizationType) => {
            storeState = new VisualizationStoreDataBuilder().withDisable(visualizationType).build();
            const configuration = visualizationConfigurationFactory.getConfiguration(visualizationType);

            const enableMessage = configuration.displayableData.enableMessage;
            notificationCreatorMock.setup(nc => nc.createNotification(enableMessage)).verifiable(Times.once());

            await commandCallback(configuration.chromeCommand);

            notificationCreatorMock.verifyAll();
        },
    );

    it.each(visualizationTypesThatShouldNotNotifyOnEnable)(
        `does not emit unexpected 'enabled' notification when enabling '%s' visualizer`,
        async (_, visualizationType) => {
            storeState = new VisualizationStoreDataBuilder().withDisable(visualizationType).build();
            const configuration = visualizationConfigurationFactory.getConfiguration(visualizationType);

            notificationCreatorMock.setup(nc => nc.createNotification(It.isAny())).verifiable(Times.never());

            await commandCallback(configuration.chromeCommand);

            notificationCreatorMock.verifyAll();
        },
    );

    it('does not emit toggle messages for unknown command strings', async () => {
        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());

        await commandCallback('unknown-command');

        interpreterMock.verifyAll();
    });

    it('does not emit toggle messages if the first-time dialog has not been dismissed yet', async () => {
        simulatedIsFirstTimeUserConfiguration = true;

        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());

        await commandCallback(getArbitraryValidChromeCommand());

        interpreterMock.verifyAll();
    });

    it('does not emit toggle messages when the active/current tab has no known tab context', async () => {
        simulatedActiveTabId = 12;
        expect(simulatedActiveTabId !== existingTabId);

        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());

        await commandCallback(getArbitraryValidChromeCommand());

        interpreterMock.verifyAll();
    });

    it('does not emit toggle messages if scanning is in progress already', async () => {
        storeState = new VisualizationStoreDataBuilder()
            .withEnable(VisualizationType.Issues)
            .withEnable(VisualizationType.Headings)
            .with('scanning', 'headings')
            .build();
        const configuration = visualizationConfigurationFactory.getConfiguration(VisualizationType.Issues);

        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());

        await commandCallback(configuration.chromeCommand);

        interpreterMock.verifyAll();
    });

    it("does not emit toggle messages if the active/current tab's URL is not supported", async () => {
        simulatedIsSupportedUrlResponse = false;

        interpreterMock.setup(x => x.interpret(It.isAny())).verifiable(Times.never());

        await commandCallback(getArbitraryValidChromeCommand());

        interpreterMock.verifyAll();
    });

    it.each`
        protocol       | expectedNotificationMessage
        ${'file://'}   | ${DisplayableStrings.fileUrlDoesNotHaveAccess}
        ${'chrome://'} | ${DisplayableStrings.urlNotScannable.join('\n')}
    `(
        'emits the expected notification when the active/current tab is an unsupported $protocol URL',
        async ({ protocol, expectedNotificationMessage }) => {
            simulatedActiveTabUrl = `${protocol}arbitrary-host`;
            simulatedIsSupportedUrlResponse = false;

            notificationCreatorMock.setup(nc => nc.createNotification(expectedNotificationMessage)).verifiable();

            await commandCallback(getArbitraryValidChromeCommand());

            notificationCreatorMock.verifyAll();
        },
    );
});

function getArbitraryValidChromeCommand(): string {
    const configuration = visualizationConfigurationFactory.getConfiguration(VisualizationType.Issues);
    return configuration.chromeCommand;
}
