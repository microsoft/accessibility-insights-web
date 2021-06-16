// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getRTL } from '@uifabric/utilities';
import * as axe from 'axe-core';
import { BrowserAdapterFactory } from 'common/browser-adapters/browser-adapter-factory';
import { WebVisualizationConfigurationFactory } from 'common/configs/web-visualization-configuration-factory';
import { createDefaultLogger } from 'common/logging/default-logger';
import { NavigatorUtils } from 'common/navigator-utils';
import { createDefaultPromiseFactory } from 'common/promises/promise-factory';
import { AxeFrameMessenger } from 'injected/frameCommunicators/axe-frame-messenger';
import { BackchannelWindowMessageTranslator } from 'injected/frameCommunicators/backchannel-window-message-translator';
import { BrowserBackchannelWindowMessagePoster } from 'injected/frameCommunicators/browser-backchannel-window-message-poster';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import { RespondableCommandMessageCommunicator } from 'injected/frameCommunicators/respondable-command-message-communicator';
import { getUniqueSelector } from 'scanner/axe-utils';
import * as UAParser from 'ua-parser-js';
import { AppDataAdapter } from '../common/browser-adapters/app-data-adapter';
import { BrowserAdapter } from '../common/browser-adapters/browser-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../common/enum-helper';
import { HTMLElementUtils } from '../common/html-element-utils';
import { VisualizationType } from '../common/types/visualization-type';
import { generateUID } from '../common/uid-generator';
import { WindowUtils } from '../common/window-utils';
import { Assessments } from './../assessments/assessments';
import { ClientUtils } from './client-utils';
import { rootContainerId } from './constants';
import { DetailsDialogHandler } from './details-dialog-handler';
import { DrawingController } from './drawing-controller';
import { ElementFinderByPath } from './element-finder-by-path';
import { ElementFinderByPosition } from './element-finder-by-position';
import { FrameUrlFinder } from './frame-url-finder';
import { HtmlElementAxeResultsHelper } from './frameCommunicators/html-element-axe-results-helper';
import { ScrollingController } from './frameCommunicators/scrolling-controller';
import { ShadowInitializer } from './shadow-initializer';
import { ShadowUtils } from './shadow-utils';
import { TabStopsListener } from './tab-stops-listener';
import { VisualizationTypeDrawerRegistrar } from './visualization-type-drawer-registrar';
import { DrawerProvider } from './visualization/drawer-provider';
import { DrawerUtils } from './visualization/drawer-utils';
import { RootContainerCreator } from './visualization/root-container-creator';

// Required to initialize axe-core with our ruleset/branding
import 'scanner/exposed-apis';

export class WindowInitializer {
    public shadowInitializer: any;
    protected browserAdapter: BrowserAdapter;
    protected appDataAdapter: AppDataAdapter;
    protected windowUtils: WindowUtils;
    protected drawingController: DrawingController;
    protected scrollingController: ScrollingController;
    protected tabStopsListener: TabStopsListener;
    protected frameUrlFinder: FrameUrlFinder;
    protected elementFinderByPosition: ElementFinderByPosition;
    protected elementFinderByPath: ElementFinderByPath;
    protected clientUtils: ClientUtils;
    protected visualizationConfigurationFactory: VisualizationConfigurationFactory;
    protected frameMessenger: FrameMessenger;
    protected respondableCommandMessageCommunicator: RespondableCommandMessageCommunicator;
    protected windowMessagePoster: BrowserBackchannelWindowMessagePoster;

    public async initialize(): Promise<void> {
        const asyncInitializationSteps: Promise<void>[] = [];
        const userAgentParser = new UAParser(window.navigator.userAgent);
        const browserAdapterFactory = new BrowserAdapterFactory(userAgentParser);
        const browserAdapter = browserAdapterFactory.makeFromUserAgent();

        this.browserAdapter = browserAdapter;
        this.appDataAdapter = browserAdapter;
        this.windowUtils = new WindowUtils();
        const htmlElementUtils = new HTMLElementUtils();
        this.clientUtils = new ClientUtils(window);
        const logger = createDefaultLogger();

        new RootContainerCreator(htmlElementUtils).create(rootContainerId);

        this.shadowInitializer = new ShadowInitializer(
            this.browserAdapter,
            htmlElementUtils,
            logger,
        );
        asyncInitializationSteps.push(this.shadowInitializer.initialize());

        this.visualizationConfigurationFactory = new WebVisualizationConfigurationFactory();

        const backchannelWindowMessageTranslator = new BackchannelWindowMessageTranslator(
            this.browserAdapter,
            this.windowUtils,
            generateUID,
        );

        this.windowMessagePoster = new BrowserBackchannelWindowMessagePoster(
            this.windowUtils,
            this.browserAdapter,
            backchannelWindowMessageTranslator,
        );

        this.respondableCommandMessageCommunicator = new RespondableCommandMessageCommunicator(
            this.windowMessagePoster,
            generateUID,
            createDefaultPromiseFactory(),
            logger,
        );

        this.frameMessenger = new FrameMessenger(this.respondableCommandMessageCommunicator);
        const axeFrameMessenger = new AxeFrameMessenger(
            this.respondableCommandMessageCommunicator,
            this.windowUtils,
            logger,
        );

        axeFrameMessenger.registerGlobally(axe);

        this.tabStopsListener = new TabStopsListener(
            this.frameMessenger,
            this.windowUtils,
            htmlElementUtils,
            getUniqueSelector,
            document,
        );
        const drawerProvider = new DrawerProvider(
            htmlElementUtils,
            this.windowUtils,
            new NavigatorUtils(window.navigator, logger),
            new ShadowUtils(new HTMLElementUtils()),
            new DrawerUtils(document),
            this.clientUtils,
            document,
            this.frameMessenger,
            this.browserAdapter,
            getRTL,
            new DetailsDialogHandler(htmlElementUtils, this.windowUtils),
        );
        this.drawingController = new DrawingController(
            this.frameMessenger,
            new HtmlElementAxeResultsHelper(htmlElementUtils, logger),
            htmlElementUtils,
        );
        this.scrollingController = new ScrollingController(this.frameMessenger, htmlElementUtils);
        this.frameUrlFinder = new FrameUrlFinder(
            this.frameMessenger,
            this.windowUtils,
            htmlElementUtils,
        );
        this.windowMessagePoster.initialize();
        this.respondableCommandMessageCommunicator.initialize();
        this.tabStopsListener.initialize();
        this.drawingController.initialize();
        this.scrollingController.initialize();
        this.frameUrlFinder.initialize();

        const visualizationTypeDrawerRegistrar = new VisualizationTypeDrawerRegistrar(
            this.drawingController.registerDrawer,
            this.visualizationConfigurationFactory,
            Assessments,
            drawerProvider,
        );

        EnumHelper.getNumericValues(VisualizationType).forEach(
            visualizationTypeDrawerRegistrar.registerType,
        );

        const port = this.browserAdapter.connect();
        port.onDisconnect.addListener(() => this.dispose());

        this.elementFinderByPosition = new ElementFinderByPosition(
            this.frameMessenger,
            this.clientUtils,
            getUniqueSelector,
            document,
        );
        this.elementFinderByPosition.initialize();

        this.elementFinderByPath = new ElementFinderByPath(htmlElementUtils, this.frameMessenger);
        this.elementFinderByPath.initialize();

        await Promise.all(asyncInitializationSteps);
    }

    protected dispose(): void {
        this.drawingController.dispose();
        this.windowMessagePoster.dispose();
    }
}
