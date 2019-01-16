// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind } from '@uifabric/utilities';
import * as Q from 'q';

import { XMLHttpRequestFactory } from '../background/xml-http-request-factory';
import { ClientChromeAdapter } from '../common/client-browser-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { FileRequestHelper } from '../common/file-request-helper';
import { HTMLElementUtils } from '../common/html-element-utils';
import { generateUID } from '../common/uid-generator';
import { WindowUtils } from '../common/window-utils';
import { scan } from '../scanner/exposed-apis';
import { Assessments } from './../assessments/assessments';
import { ClientUtils } from './client-utils';
import { DrawingController } from './drawing-controller';
import { ElementFinderByPosition } from './element-finder-by-position';
import { FrameUrlFinder } from './frame-url-finder';
import { FrameCommunicator } from './frameCommunicators/frame-communicator';
import { HtmlElementAxeResultsHelper } from './frameCommunicators/html-element-axe-results-helper';
import { ScrollingController } from './frameCommunicators/scrolling-controller';
import { WindowMessageHandler } from './frameCommunicators/window-message-handler';
import { WindowMessageMarshaller } from './frameCommunicators/window-message-marshaller';
import { InstanceVisibilityChecker } from './instance-visibility-checker';
import { ScannerUtils } from './scanner-utils';
import { ShadowInitializer } from './shadow-initializer';
import { ShadowUtils } from './shadow-utils';
import { TabStopsListener } from './tab-stops-listener';
import { DrawerProvider } from './visualization/drawer-provider';
import { DrawerUtils } from './visualization/drawer-utils';

export class WindowInitializer {
    public shadowInitializer: any;
    protected clientChromeAdapter: ClientChromeAdapter;
    protected windowUtils: WindowUtils;
    protected frameCommunicator: FrameCommunicator;
    protected drawingController: DrawingController;
    protected scrollingController: ScrollingController;
    protected tabStopsListener: TabStopsListener;
    protected frameUrlFinder: FrameUrlFinder;
    protected instanceVisibilityChecker: InstanceVisibilityChecker;
    protected elementFinderByPosition: ElementFinderByPosition;
    protected clientUtils: ClientUtils;
    protected scannerUtils: ScannerUtils;
    protected visualizationConfigurationFactory: VisualizationConfigurationFactory;

    public async initialize(): Promise<void> {
        const asyncInitializationSteps: Promise<void>[] = [];

        this.clientChromeAdapter = new ClientChromeAdapter();
        this.windowUtils = new WindowUtils();
        const htmlElementUtils = new HTMLElementUtils();
        const xmlHttpRequestFactory = new XMLHttpRequestFactory();
        this.clientUtils = new ClientUtils(window);
        this.scannerUtils = new ScannerUtils(scan);

        this.shadowInitializer = new ShadowInitializer(this.clientChromeAdapter, htmlElementUtils, new FileRequestHelper(xmlHttpRequestFactory));
        asyncInitializationSteps.push(this.shadowInitializer.initialize());

        this.visualizationConfigurationFactory = new VisualizationConfigurationFactory();

        const windowMessageHandler = new WindowMessageHandler(this.windowUtils, new WindowMessageMarshaller(this.clientChromeAdapter, generateUID));
        this.frameCommunicator = new FrameCommunicator(windowMessageHandler, htmlElementUtils, this.windowUtils, Q);
        this.tabStopsListener = new TabStopsListener(this.frameCommunicator, this.windowUtils, htmlElementUtils, this.scannerUtils);
        this.instanceVisibilityChecker = new InstanceVisibilityChecker(this.clientChromeAdapter.sendMessageToFrames, this.windowUtils, htmlElementUtils, this.visualizationConfigurationFactory);
        const drawerProvider = new DrawerProvider(this.windowUtils, new ShadowUtils(new HTMLElementUtils()), new DrawerUtils(document), this.clientUtils, document, this.frameCommunicator);
        this.drawingController = new DrawingController(this.frameCommunicator, this.instanceVisibilityChecker, new HtmlElementAxeResultsHelper(htmlElementUtils), htmlElementUtils, this.visualizationConfigurationFactory, drawerProvider, Assessments);
        this.scrollingController = new ScrollingController(this.frameCommunicator, htmlElementUtils);
        this.frameUrlFinder = new FrameUrlFinder(this.frameCommunicator, this.windowUtils, htmlElementUtils);
        windowMessageHandler.initialize();
        this.tabStopsListener.initialize();
        this.frameCommunicator.initialize();
        this.drawingController.initialize();
        this.scrollingController.initialize();
        this.frameUrlFinder.initialize();

        const port = this.clientChromeAdapter.connect();
        port.onDisconnect.addListener(this.dispose);

        this.elementFinderByPosition = new ElementFinderByPosition(this.frameCommunicator, this.clientUtils, this.scannerUtils, Q, document);
        this.elementFinderByPosition.initialize();

        await Promise.all(asyncInitializationSteps);
    }

    @autobind
    protected dispose() {
        this.drawingController.dispose();
    }
}
