// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AllFramesMessenger } from 'injected/frameCommunicators/all-frames-messenger';
import {
    CommandMessage,
    CommandMessageResponse,
} from 'injected/frameCommunicators/respondable-command-message-communicator';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { getDefaultFeatureFlagsWeb } from '../../../../common/feature-flags';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import {
    DrawingController,
    VisualizationWindowMessage,
} from '../../../../injected/drawing-controller';
import {
    AssessmentVisualizationInstance,
    HtmlElementAxeResultsHelper,
} from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { Drawer, DrawerInitData } from '../../../../injected/visualization/drawer';
import { HighlightBoxDrawer } from '../../../../injected/visualization/highlight-box-drawer';

class VisualizationWindowMessageStubBuilder {
    private isEnabled: boolean;
    private configId: string;
    private elementResults: AssessmentVisualizationInstance[] | null;
    private featureFlagStoreData?: FeatureFlagStoreData;

    public constructor(configId: string) {
        this.configId = configId;
        this.featureFlagStoreData = getDefaultFeatureFlagsWeb();
        this.elementResults = null;
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
        results: AssessmentVisualizationInstance[] | null,
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
    const configId = 'id';
    let allFrameMessengerMock: IMock<AllFramesMessenger>;
    let axeResultsHelperMock: IMock<HtmlElementAxeResultsHelper>;

    beforeEach(() => {
        allFrameMessengerMock = Mock.ofType<AllFramesMessenger>();
        axeResultsHelperMock = Mock.ofType(HtmlElementAxeResultsHelper);
    });

    afterEach(() => {
        allFrameMessengerMock.verifyAll();
    });

    test('initialize', async () => {
        let addMessageListenerCallback: (
            message: CommandMessage,
        ) => Promise<CommandMessageResponse>;
        allFrameMessengerMock
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

        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);
        drawerMock.setup(m => m.eraseLayout()).verifiable(Times.once());

        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        await addMessageListenerCallback(commandMessage);

        allFrameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
    });

    test('prepareVisualization', async () => {
        allFrameMessengerMock.setup(f => f.initializeAllFrames()).verifiable();

        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
        );
        await testObject.prepareVisualization();
    });

    test('enable visualization test', async () => {
        const featureFlagStoreData = getDefaultFeatureFlagsWeb();

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
        const visibleResultStub = {} as AssessmentVisualizationInstance;
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
        let getPayloadCallback: (iframe: HTMLIFrameElement, index: number) => any;

        allFrameMessengerMock
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

        allFrameMessengerMock
            .setup(fm =>
                fm.sendCommandToMultipleFrames(
                    DrawingController.triggerVisualizationCommand,
                    [targetFrame],
                    It.isAny(),
                ),
            )
            .returns(async (command, frame, getPayload) => {
                getPayloadCallback = getPayload;
            })
            .verifiable(Times.once());

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isValue(message.elementResults)))
            .returns(() => {
                return resultsByFrames as any;
            })
            .verifiable(Times.once());

        const expected: DrawerInitData = {
            data: [visibleResultStub],
            featureFlagStoreData,
        };
        drawerMock.setup(dm => dm.initialize(It.isValue(expected))).verifiable(Times.once());

        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());

        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        await addMessageListenerCallback(commandMessage);

        expect(getPayloadCallback(targetFrame, 0)).toEqual({
            isEnabled: true,
            elementResults: iframeResults,
            featureFlagStoreData,
            configId: configId,
        });

        allFrameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        drawerMock.verifyAll();
    });

    test('enable visualization test when results is null - tabstops', async () => {
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
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        allFrameMessengerMock
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

        allFrameMessengerMock
            .setup(fm =>
                fm.sendCommandToAllFrames(DrawingController.triggerVisualizationCommand, {
                    isEnabled: true,
                    elementResults: null,
                    featureFlagStoreData: getDefaultFeatureFlagsWeb(),
                    configId: configId,
                }),
            )
            .verifiable(Times.once());

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isAny()))
            .verifiable(Times.never());

        drawerMock
            .setup(dm =>
                dm.initialize(
                    It.isValue({ data: null, featureFlagStoreData: getDefaultFeatureFlagsWeb() }),
                ),
            )
            .verifiable(Times.once());
        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());

        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        await addMessageListenerCallback(commandMessageStub);

        allFrameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        drawerMock.verifyAll();
    });

    test('disable visualization test', async () => {
        const disableMessage = new VisualizationWindowMessageStubBuilder(configId)
            .setVisualizationDisabled()
            .build();
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.never());
        drawerMock.setup(dm => dm.eraseLayout()).verifiable(Times.once());

        allFrameMessengerMock
            .setup(fm =>
                fm.sendCommandToAllFrames(DrawingController.triggerVisualizationCommand, {
                    isEnabled: false,
                    configId: configId,
                }),
            )
            .verifiable(Times.once());

        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
        );

        testObject.initialize();
        testObject.registerDrawer(configId, drawerMock.object);
        await testObject.processRequest(disableMessage);

        allFrameMessengerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        drawerMock.verifyAll();
    });

    test('dispose should call eraseLayout on drawers', async () => {
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

        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
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
        const drawerMock = Mock.ofType<Drawer>();
        const testObject = new DrawingController(
            allFrameMessengerMock.object,
            axeResultsHelperMock.object,
        );
        testObject.registerDrawer(configId, drawerMock.object);
        expect(() =>
            testObject.registerDrawer(configId, drawerMock.object),
        ).toThrowErrorMatchingSnapshot();
    });
});
