// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { autobind, getRTL } from '@uifabric/utilities';
import * as Q from 'q';
import { Assessments } from '../assessments/assessments';
import { ElectronRendererAdapter } from '../background/browser-adapters/electron-renderer-adapter';
import { ClientBrowserAdapter } from '../common/client-browser-adapter';
import { VisualizationConfigurationFactory } from '../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../common/enum-helper';
import { HTMLElementUtils } from '../common/html-element-utils';
import { VisualizationType } from '../common/types/visualization-type';
import { generateUID } from '../common/uid-generator';
import { WindowUtils } from '../common/window-utils';
import { fromBackgroundChannel, toBackgroundChannel } from '../electron/main/communication-channel';
import { scan } from '../scanner/exposed-apis';
import { ClientUtils } from './client-utils';
import { rootContainerId } from './constants';
import { DetailsDialogHandler } from './details-dialog-handler';
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
import { VisualizationTypeDrawerRegistrar } from './visualization-type-drawer-registrar';
import { DrawerProvider } from './visualization/drawer-provider';
import { DrawerUtils } from './visualization/drawer-utils';
import { RootContainerCreator } from './visualization/root-container-creator';

export class ElectronWindowInitializer {
    public shadowInitializer: any;
    protected clientChromeAdapter: ClientBrowserAdapter;
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

        this.clientChromeAdapter = new ElectronRendererAdapter(toBackgroundChannel, fromBackgroundChannel);
        this.windowUtils = new WindowUtils();
        const htmlElementUtils = new HTMLElementUtils();
        this.clientUtils = new ClientUtils(window);
        this.scannerUtils = new ScannerUtils(scan);

        new RootContainerCreator(htmlElementUtils).create(rootContainerId);

        this.shadowInitializer = new ShadowInitializer(this.clientChromeAdapter, htmlElementUtils);
        asyncInitializationSteps.push(this.shadowInitializer.initialize());

        this.visualizationConfigurationFactory = new VisualizationConfigurationFactory();

        const windowMessageHandler = new WindowMessageHandler(
            this.windowUtils,
            new WindowMessageMarshaller(this.clientChromeAdapter, generateUID),
        );
        this.frameCommunicator = new FrameCommunicator(windowMessageHandler, htmlElementUtils, this.windowUtils, Q);
        this.tabStopsListener = new TabStopsListener(this.frameCommunicator, this.windowUtils, htmlElementUtils, this.scannerUtils);
        this.instanceVisibilityChecker = new InstanceVisibilityChecker(
            this.clientChromeAdapter.sendMessageToFrames,
            this.windowUtils,
            htmlElementUtils,
            this.visualizationConfigurationFactory,
        );
        const drawerProvider = new DrawerProvider(
            htmlElementUtils,
            this.windowUtils,
            new ShadowUtils(new HTMLElementUtils()),
            new DrawerUtils(document),
            this.clientUtils,
            document,
            this.frameCommunicator,
            this.clientChromeAdapter,
            getRTL,
            new DetailsDialogHandler(htmlElementUtils),
        );
        this.drawingController = new DrawingController(
            this.frameCommunicator,
            new HtmlElementAxeResultsHelper(htmlElementUtils),
            htmlElementUtils,
        );

        this.scrollingController = new ScrollingController(this.frameCommunicator, htmlElementUtils);
        this.frameUrlFinder = new FrameUrlFinder(this.frameCommunicator, this.windowUtils, htmlElementUtils);
        windowMessageHandler.initialize();
        this.tabStopsListener.initialize();
        this.frameCommunicator.initialize();
        this.drawingController.initialize();
        this.scrollingController.initialize();
        this.frameUrlFinder.initialize();

        const visualizationTypeDrawerRegistrar = new VisualizationTypeDrawerRegistrar(
            this.drawingController.registerDrawer,
            this.visualizationConfigurationFactory,
            Assessments,
            drawerProvider,
        );
        EnumHelper.getNumericValues(VisualizationType).forEach(visualizationTypeDrawerRegistrar.registerType);

        const port = this.clientChromeAdapter.connect();
        port.onDisconnect.addListener(this.dispose);

        this.elementFinderByPosition = new ElementFinderByPosition(
            this.frameCommunicator,
            this.clientUtils,
            this.scannerUtils,
            Q,
            document,
        );
        this.elementFinderByPosition.initialize();

        await Promise.all(asyncInitializationSteps);
    }

    @autobind
    protected dispose(): void {
        this.drawingController.dispose();
    }
}
