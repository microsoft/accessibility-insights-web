// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { getDefaultFeatureFlagsWeb } from '../../../../common/feature-flags';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import {
    DrawingController,
    VisualizationWindowMessage,
} from '../../../../injected/drawing-controller';
import {
    AssessmentVisualizationInstance,
    HtmlElementAxeResultsHelper,
} from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { HtmlElementAxeResults } from '../../../../injected/scanner-utils';
import { Drawer, DrawerInitData } from '../../../../injected/visualization/drawer';
import { HighlightBoxDrawer } from '../../../../injected/visualization/highlight-box-drawer';
import { HTMLCollectionOfBuilder } from '../../common/html-collection-of-builder';

class VisualizationWindowMessageStubBuilder {
    private isEnabled: boolean;
    private configId: string;
    private elementResults?: AssessmentVisualizationInstance[];
    private featureFlagStoreData?: FeatureFlagStoreData;

    public constructor(configId: string) {
        this.configId = configId;
        this.featureFlagStoreData = getDefaultFeatureFlagsWeb();
    }

    public setVisualizationEnabled(): VisualizationWindowMessageStubBuilder {
        this.isEnabled = true;
        return this;
    }

    public setVisualizationDisabled(): VisualizationWindowMessageStubBuilder {
        this.isEnabled = false;
        return this;
    }

    public setElementResults(
        results: AssessmentVisualizationInstance[],
    ): VisualizationWindowMessageStubBuilder {
        this.elementResults = results;
        return this;
    }

    public setFeatureFlagStoreData(
        featureFlagStoreData: FeatureFlagStoreData,
    ): VisualizationWindowMessageStubBuilder {
        this.featureFlagStoreData = featureFlagStoreData;
        return this;
    }

    public build(): VisualizationWindowMessage {
        const message: VisualizationWindowMessage = {
            isEnabled: this.isEnabled,
            elementResults: this.elementResults,
            featureFlagStoreData: this.featureFlagStoreData,
            configId: this.configId,
        };
        return message;
    }
}

describe('DrawingControllerTest', () => {
    let frameMessengerMock: IMock<FrameMessenger>;
    let axeResultsHelperMock: IMock<HtmlElementAxeResultsHelper>;
    let hTMLElementUtils: IMock<HTMLElementUtils>;

    beforeEach(() => {
        frameMessengerMock = Mock.ofType(FrameMessenger);
        axeResultsHelperMock = Mock.ofType(HtmlElementAxeResultsHelper);
        hTMLElementUtils = Mock.ofType(HTMLElementUtils);
    });

    test('initialize', () => {
        let addMessageListenerCallback: (
            message: CommandMessage,
        ) => Promise<CommandMessageResponse>;
        const configId = 'id';
        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    It.isValue(DrawingController.triggerVisualizationCommand),
                    It.isAny(),
                ),
            )
            .returns((cmd, func) => {
                addMessageListenerCallback = func;
            })
            .verifiable(Times.once());

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isAny()))
            .verifiable(Times.never());

        const message: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(
            configId,
        )
            .setVisualizationDisabled()
            .setElementResults([])
            .build();

        const commandMessage: CommandMessage = {
            command: DrawingController.triggerVisualizationCommand,
            payload: message,
        };

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName(It.isValue('iframe')))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());

        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);
        drawerMock.setup(m => m.eraseLayout()).verifiable(Times.once());

        const testObject = new DrawingController(
            frameMessengerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        addMessageListenerCallback(commandMessage);

        frameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
    });

    test('enable visualization test', () => {
        const featureFlagStoreData = getDefaultFeatureFlagsWeb();

        const configId = 'id';
        let addMessageListenerCallback: (
            message: CommandMessage,
        ) => Promise<CommandMessageResponse>;
        const message: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(
            configId,
        )
            .setVisualizationEnabled()
            .setElementResults(['some data'] as any)
            .setFeatureFlagStoreData(featureFlagStoreData)
            .build();
        const commandMessage: CommandMessage = {
            command: DrawingController.triggerVisualizationCommand,
            payload: message,
        };
        const iframeResults = ['iframeContent'];
        const iframeElement = 'iframeElement';
        const targetFrame = iframeElement as any;
        const visibleResultStub = {} as HtmlElementAxeResults;
        const disabledResultStub = {
            isVisualizationEnabled: false,
        } as AssessmentVisualizationInstance;
        const resultsByFrames = [
            {
                frame: null,
                elementResults: [visibleResultStub, disabledResultStub],
            },
            {
                frame: iframeElement,
                elementResults: iframeResults,
            },
        ];
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    It.isValue(DrawingController.triggerVisualizationCommand),
                    It.isAny(),
                ),
            )
            .returns((cmd, func) => {
                addMessageListenerCallback = func;
            })
            .verifiable(Times.once());

        frameMessengerMock
            .setup(fm =>
                fm.sendMessageToFrame(
                    targetFrame,
                    It.isValue({
                        command: DrawingController.triggerVisualizationCommand,
                        payload: {
                            isEnabled: true,
                            elementResults: iframeResults,
                            featureFlagStoreData,
                            configId: configId,
                        },
                    }),
                ),
            )
            .verifiable(Times.once());

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isValue(message.elementResults)))
            .returns(() => {
                return resultsByFrames as any;
            })
            .verifiable(Times.once());

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName(It.isAny()))
            .verifiable(Times.never());

        const expected: DrawerInitData<HtmlElementAxeResults> = {
            data: [visibleResultStub],
            featureFlagStoreData,
        };
        drawerMock.setup(dm => dm.initialize(It.isValue(expected))).verifiable(Times.once());

        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());

        const testObject = new DrawingController(
            frameMessengerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        addMessageListenerCallback(commandMessage);

        frameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        hTMLElementUtils.verifyAll();
        drawerMock.verifyAll();
    });

    test('enable visualization test when results is null - tabstops', () => {
        const configId = 'id';
        let addMessageListenerCallback: (
            message: CommandMessage,
        ) => Promise<CommandMessageResponse>;
        const message: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(
            configId,
        )
            .setVisualizationEnabled()
            .build();
        const commandMessageStub: CommandMessage = {
            command: DrawingController.triggerVisualizationCommand,
            payload: message,
        };
        const iframeElement = 'iframeElement';
        const targetFrame = iframeElement as any;
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        frameMessengerMock
            .setup(fm =>
                fm.addMessageListener(
                    It.isValue(DrawingController.triggerVisualizationCommand),
                    It.isAny(),
                ),
            )
            .returns((cmd, func) => {
                addMessageListenerCallback = func;
            })
            .verifiable(Times.once());

        frameMessengerMock
            .setup(fm =>
                fm.sendMessageToFrame(
                    targetFrame,
                    It.isValue({
                        command: DrawingController.triggerVisualizationCommand,
                        payload: {
                            isEnabled: true,
                            elementResults: null,
                            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
                            configId: configId,
                        },
                    }),
                ),
            )
            .verifiable(Times.once());

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isAny()))
            .verifiable(Times.never());

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName('iframe'))
            .returns(() => HTMLCollectionOfBuilder.create([iframeElement as any]))
            .verifiable(Times.once());

        drawerMock
            .setup(dm =>
                dm.initialize(
                    It.isValue({ data: null, featureFlagStoreData: getDefaultFeatureFlagsWeb() }),
                ),
            )
            .verifiable(Times.once());
        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());

        const testObject = new DrawingController(
            frameMessengerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        addMessageListenerCallback(commandMessageStub);

        frameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        hTMLElementUtils.verifyAll();
        drawerMock.verifyAll();
    });

    test('disable visualization test', async () => {
        const configId = 'id';
        const disableMessage = new VisualizationWindowMessageStubBuilder(configId)
            .setVisualizationDisabled()
            .build();
        const iframes = ['1'];
        const targetFrame = iframes[0] as any;
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName('iframe'))
            .returns(() => iframes as any)
            .verifiable(Times.once());

        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.never());
        drawerMock.setup(dm => dm.eraseLayout()).verifiable(Times.once());

        frameMessengerMock
            .setup(fm =>
                fm.sendMessageToFrame(
                    targetFrame,
                    It.isValue({
                        command: DrawingController.triggerVisualizationCommand,
                        payload: {
                            isEnabled: false,
                            configId: configId,
                        },
                    }),
                ),
            )
            .verifiable(Times.once());

        const testObject = new DrawingController(
            frameMessengerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        await testObject.processRequest(disableMessage);

        frameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        hTMLElementUtils.verifyAll();
        drawerMock.verifyAll();
    });

    test('dispose should call eraseLayout on drawers', async () => {
        const configId = 'id';
        const enableMessage: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(
            configId,
        )
            .setVisualizationEnabled()
            .build();
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);
        drawerMock.setup(dm => dm.initialize(It.isAny())).verifiable(Times.once());
        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());
        drawerMock.setup(dm => dm.eraseLayout()).verifiable(Times.atLeastOnce());

        const resultsByFrames = [
            {
                frame: null,
                elementResults: ['abc'],
            },
        ];

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isAny()))
            .returns(message => {
                return resultsByFrames as any;
            });

        const iframeElement = 'iframeElement';
        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName(It.isAny()))
            .returns(() => HTMLCollectionOfBuilder.create([iframeElement as any]))
            .verifiable(Times.once());

        const testObject = new DrawingController(
            frameMessengerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        await testObject.processRequest(enableMessage);

        drawerMock.reset();
        drawerMock.setup(x => x.eraseLayout()).verifiable(Times.once());

        testObject.dispose();

        drawerMock.verifyAll();
    });

    test('drawer already registered', () => {
        const configId = 'stub id';
        const drawerMock = Mock.ofType<Drawer>();
        const testObject = new DrawingController(
            frameMessengerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
        );
        testObject.registerDrawer(configId, drawerMock.object);
        expect(() =>
            testObject.registerDrawer(configId, drawerMock.object),
        ).toThrowErrorMatchingSnapshot();
    });
});
