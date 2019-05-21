// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { AssessmentsProviderImpl } from '../../../../assessments/assessments-provider';
import { AssessmentsProvider } from '../../../../assessments/types/assessments-provider';
import { VisualizationConfiguration } from '../../../../common/configs/visualization-configuration';
import { VisualizationConfigurationFactory } from '../../../../common/configs/visualization-configuration-factory';
import { EnumHelper } from '../../../../common/enum-helper';
import { FeatureFlags, getDefaultFeatureFlagValues } from '../../../../common/feature-flags';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { DrawingController, VisualizationWindowMessage } from '../../../../injected/drawing-controller';
import { FrameCommunicator } from '../../../../injected/frameCommunicators/frame-communicator';
import {
    AssessmentVisualizationInstance,
    HtmlElementAxeResultsHelper,
} from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { InstanceVisibilityChecker } from '../../../../injected/instance-visibility-checker';
import { HtmlElementAxeResults } from '../../../../injected/scanner-utils';
import { Drawer, DrawerInitData } from '../../../../injected/visualization/drawer';
import { DrawerProvider } from '../../../../injected/visualization/drawer-provider';
import { HighlightBoxDrawer } from '../../../../injected/visualization/highlight-box-drawer';
import { NodeListBuilder } from '../../common/node-list-builder';

class VisualizationWindowMessageStubBuilder {
    private visualizationType: VisualizationType;
    private isEnabled: boolean;
    private configId: string;
    private elementResults?: AssessmentVisualizationInstance[];
    private featureFlagStoreData?: FeatureFlagStoreData;

    public constructor(visualizationType: VisualizationType, configId: string) {
        this.visualizationType = visualizationType;
        this.configId = configId;
        this.featureFlagStoreData = getDefaultFeatureFlagValues();
    }

    public setVisualizationEnabled(): VisualizationWindowMessageStubBuilder {
        this.isEnabled = true;
        return this;
    }

    public setVisualizationDisabled(): VisualizationWindowMessageStubBuilder {
        this.isEnabled = false;
        return this;
    }

    public setElementResults(results: AssessmentVisualizationInstance[]): VisualizationWindowMessageStubBuilder {
        this.elementResults = results;
        return this;
    }

    public setFeatureFlagStoreData(featureFlagStoreData: FeatureFlagStoreData): VisualizationWindowMessageStubBuilder {
        this.featureFlagStoreData = featureFlagStoreData;
        return this;
    }

    public build(): VisualizationWindowMessage {
        const message: VisualizationWindowMessage = {
            visualizationType: this.visualizationType,
            isEnabled: this.isEnabled,
            elementResults: this.elementResults,
            featureFlagStoreData: this.featureFlagStoreData,
            configId: this.configId,
        };
        return message;
    }
}

describe('DrawingControllerTest', () => {
    let frameCommunicatorMock: IMock<FrameCommunicator>;
    let axeResultsHelperMock: IMock<HtmlElementAxeResultsHelper>;
    let instanceVisibilityCheckerMock: IMock<InstanceVisibilityChecker>;
    let hTMLElementUtils: IMock<HTMLElementUtils>;
    let visualizationConfigFactory: IMock<VisualizationConfigurationFactory>;
    let visualizationConfigStub: VisualizationConfiguration;
    let getIdentifierMock: IMock<(step?: string) => string>;
    let getDrawerMock: IMock<(provider: DrawerProvider, testStep?: string) => Drawer>;
    let drawerProvider: IMock<DrawerProvider>;
    let assessmentProvider: IMock<AssessmentsProvider>;
    let numVisualizationTypes: number;

    beforeEach(() => {
        frameCommunicatorMock = Mock.ofType(FrameCommunicator);
        instanceVisibilityCheckerMock = Mock.ofType(InstanceVisibilityChecker);
        axeResultsHelperMock = Mock.ofType(HtmlElementAxeResultsHelper);
        hTMLElementUtils = Mock.ofType(HTMLElementUtils);
        visualizationConfigFactory = Mock.ofType(VisualizationConfigurationFactory);
        drawerProvider = Mock.ofType(DrawerProvider);
        getIdentifierMock = Mock.ofInstance(step => null);
        getDrawerMock = Mock.ofInstance((provider, testStep) => null);
        assessmentProvider = Mock.ofType(AssessmentsProviderImpl);
        visualizationConfigStub = {
            getIdentifier: getIdentifierMock.object,
            getDrawer: getDrawerMock.object,
        } as VisualizationConfiguration;
        numVisualizationTypes = EnumHelper.getNumericValues(VisualizationType).length;
    });

    function setupIsAssessmentFalse(times: Times): void {
        assessmentProvider
            .setup(p => p.isValidType(It.isAnyNumber()))
            .returns(() => false)
            .verifiable(times);
    }

    function setupDrawerFetches(drawerMock: IMock<HighlightBoxDrawer>, times: Times): void {
        getDrawerMock
            .setup(m => m(drawerProvider.object, It.isAny()))
            .returns(() => drawerMock.object)
            .verifiable(times);
    }

    function setupConfigFetches(times: Times): void {
        getIdentifierMock
            .setup(c => c(It.isAny()))
            .returns(() => 'id')
            .verifiable(times);

        visualizationConfigFactory
            .setup(f => f.getConfiguration(It.isAnyNumber()))
            .returns(() => visualizationConfigStub)
            .verifiable(times);
    }

    test('initialize and invokeMethodIfExists test', () => {
        setupIsAssessmentFalse(Times.exactly(numVisualizationTypes));
        setupConfigFetches(Times.exactly(numVisualizationTypes));
        let subscribeCallback: (result: any, error: any, win: any, responder?: any) => void;
        const configId = 'id';
        frameCommunicatorMock
            .setup(fcm => fcm.subscribe(It.isValue(DrawingController.triggerVisualizationCommand), It.isAny()))
            .returns((cmd, func) => {
                subscribeCallback = func;
            })
            .verifiable(Times.once());

        axeResultsHelperMock.setup(am => am.splitResultsByFrame(It.isAny())).verifiable(Times.never());

        const message: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(VisualizationType.Headings, configId)
            .setVisualizationDisabled()
            .setElementResults([])
            .build();

        const responderMock = Mock.ofInstance((data: any) => {});
        responderMock.setup(rm => rm(It.isValue(null))).verifiable(Times.once());

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName(It.isValue('iframe')))
            .returns(() => {
                return [] as any;
            })
            .verifiable(Times.once());

        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);
        drawerMock.setup(m => m.eraseLayout()).verifiable(Times.once());

        setupDrawerFetches(drawerMock, Times.exactly(numVisualizationTypes));

        const testObject = new DrawingController(
            frameCommunicatorMock.object,
            instanceVisibilityCheckerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
            visualizationConfigFactory.object,
            drawerProvider.object,
            assessmentProvider.object,
        );

        testObject.initialize();
        subscribeCallback(message, null, null, responderMock.object);

        frameCommunicatorMock.verifyAll();
        getDrawerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        visualizationConfigFactory.verifyAll();
        assessmentProvider.verifyAll();
        responderMock.verifyAll();
    });

    test('enable visualization test with showInstanceVisibility FF on', () => {
        testEnableVisualization(true);
    });

    test('enable visualization test with showInstanceVisibility FF off', () => {
        testEnableVisualization(false);
    });

    function testEnableVisualization(showInstanceVisibilityFF: boolean): void {
        const featureFlagStoreData = getDefaultFeatureFlagValues();
        featureFlagStoreData[FeatureFlags.showInstanceVisibility] = showInstanceVisibilityFF;

        const configId = 'id';
        setupIsAssessmentFalse(Times.exactly(numVisualizationTypes));
        setupConfigFetches(Times.exactly(numVisualizationTypes));
        let subscribeCallback: (result: any, error: any, responder?: any) => void;
        const message: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(VisualizationType.Headings, configId)
            .setVisualizationEnabled()
            .setElementResults(['some data'] as any)
            .setFeatureFlagStoreData(featureFlagStoreData)
            .build();
        const iframeResults = ['iframeContent'];
        const iframeElement = 'iframeElement';
        const visibleResultStub = {} as HtmlElementAxeResults;
        const notVisibleResultStub = { isVisible: false } as HtmlElementAxeResults;
        const disabledResultStub = { isVisualizationEnabled: false } as AssessmentVisualizationInstance;
        const resultsByFrames = [
            {
                frame: null,
                elementResults: [visibleResultStub, notVisibleResultStub, disabledResultStub],
            },
            {
                frame: iframeElement,
                elementResults: iframeResults,
            },
        ];
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        frameCommunicatorMock
            .setup(fcm => fcm.subscribe(It.isValue(DrawingController.triggerVisualizationCommand), It.isAny()))
            .returns((cmd, func) => {
                subscribeCallback = func;
            })
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(fm =>
                fm.sendMessage(
                    It.isValue({
                        command: DrawingController.triggerVisualizationCommand,
                        frame: iframeElement as any,
                        message: {
                            isEnabled: true,
                            elementResults: iframeResults,
                            visualizationType: VisualizationType.Headings,
                            featureFlagStoreData,
                            configId: configId,
                        },
                    }),
                ),
            )
            .verifiable(Times.once());

        const instanceVisibilityCheckerTimes = showInstanceVisibilityFF ? Times.once() : Times.never();
        instanceVisibilityCheckerMock
            .setup(tpl => tpl.createVisibilityCheckerInterval(configId, VisualizationType.Headings, It.isAny()))
            .verifiable(instanceVisibilityCheckerTimes);

        axeResultsHelperMock
            .setup(am => am.splitResultsByFrame(It.isValue(message.elementResults)))
            .returns(() => {
                return resultsByFrames as any;
            })
            .verifiable(Times.once());

        hTMLElementUtils.setup(dm => dm.getAllElementsByTagName(It.isAny())).verifiable(Times.never());

        const expected: DrawerInitData<HtmlElementAxeResults> = {
            data: [visibleResultStub],
            featureFlagStoreData,
        };
        drawerMock.setup(dm => dm.initialize(It.isValue(expected))).verifiable(Times.once());

        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());

        setupDrawerFetches(drawerMock, Times.exactly(numVisualizationTypes));

        const testObject = new DrawingController(
            frameCommunicatorMock.object,
            instanceVisibilityCheckerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
            visualizationConfigFactory.object,
            drawerProvider.object,
            assessmentProvider.object,
        );

        testObject.initialize();
        subscribeCallback(message, null, null);

        frameCommunicatorMock.verifyAll();
        instanceVisibilityCheckerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        hTMLElementUtils.verifyAll();
        visualizationConfigFactory.verifyAll();
        getDrawerMock.verifyAll();
        assessmentProvider.verifyAll();
        getIdentifierMock.verifyAll();
        drawerMock.verifyAll();
    }

    test('enable visualization test when results is null - tabstops', () => {
        const configId = 'id';
        setupIsAssessmentFalse(Times.exactly(numVisualizationTypes));
        setupConfigFetches(Times.exactly(numVisualizationTypes));
        let subscribeCallback: (result: any, error: any, responder?: any) => void;
        const message: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(VisualizationType.TabStops, configId)
            .setVisualizationEnabled()
            .build();
        const iframeElement = 'iframeElement';
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        frameCommunicatorMock
            .setup(fcm => fcm.subscribe(It.isValue(DrawingController.triggerVisualizationCommand), It.isAny()))
            .returns((cmd, func) => {
                subscribeCallback = func;
            })
            .verifiable(Times.once());

        frameCommunicatorMock
            .setup(fm =>
                fm.sendMessage(
                    It.isValue({
                        command: DrawingController.triggerVisualizationCommand,
                        frame: iframeElement as any,
                        message: {
                            isEnabled: true,
                            elementResults: null,
                            visualizationType: VisualizationType.TabStops,
                            featureFlagStoreData: getDefaultFeatureFlagValues(),
                            configId: configId,
                        },
                    }),
                ),
            )
            .verifiable(Times.once());

        axeResultsHelperMock.setup(am => am.splitResultsByFrame(It.isAny())).verifiable(Times.never());

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName('iframe'))
            .returns(() => NodeListBuilder.createNodeList([iframeElement as any]))
            .verifiable(Times.once());

        drawerMock
            .setup(dm => dm.initialize(It.isValue({ data: null, featureFlagStoreData: getDefaultFeatureFlagValues() })))
            .verifiable(Times.once());
        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.once());

        setupDrawerFetches(drawerMock, Times.exactly(numVisualizationTypes));

        const testObject = new DrawingController(
            frameCommunicatorMock.object,
            instanceVisibilityCheckerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
            visualizationConfigFactory.object,
            drawerProvider.object,
            assessmentProvider.object,
        );

        testObject.initialize();
        subscribeCallback(message, null, null);

        frameCommunicatorMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        hTMLElementUtils.verifyAll();
        visualizationConfigFactory.verifyAll();
        getDrawerMock.verifyAll();
        getIdentifierMock.verifyAll();
        assessmentProvider.verifyAll();
        drawerMock.verifyAll();
    });

    test('disable visualization test', () => {
        setupIsAssessmentFalse(Times.exactly(numVisualizationTypes));
        setupConfigFetches(Times.exactly(numVisualizationTypes));
        const configId = 'id';
        const disableMessage = new VisualizationWindowMessageStubBuilder(VisualizationType.HeadingsAssessment, configId)
            .setVisualizationDisabled()
            .build();
        const iframes = ['1'];
        const drawerMock = Mock.ofType(HighlightBoxDrawer, MockBehavior.Strict);

        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName('iframe'))
            .returns(() => iframes as any)
            .verifiable(Times.once());

        instanceVisibilityCheckerMock
            .setup(tlp => tlp.clearVisibilityCheck(configId, VisualizationType.HeadingsAssessment))
            .verifiable(Times.once());

        drawerMock.setup(dm => dm.drawLayout()).verifiable(Times.never());
        drawerMock.setup(dm => dm.eraseLayout()).verifiable(Times.once());

        setupDrawerFetches(drawerMock, Times.exactly(numVisualizationTypes));

        frameCommunicatorMock
            .setup(fm =>
                fm.sendMessage(
                    It.isValue({
                        command: DrawingController.triggerVisualizationCommand,
                        frame: iframes[0] as any,
                        message: {
                            isEnabled: false,
                            visualizationType: VisualizationType.HeadingsAssessment,
                            configId: configId,
                        },
                    }),
                ),
            )
            .verifiable(Times.once());

        const testObject = new DrawingController(
            frameCommunicatorMock.object,
            instanceVisibilityCheckerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
            visualizationConfigFactory.object,
            drawerProvider.object,
            assessmentProvider.object,
        );

        testObject.initialize();
        testObject.processRequest(disableMessage);

        frameCommunicatorMock.verifyAll();
        instanceVisibilityCheckerMock.verifyAll();
        axeResultsHelperMock.verifyAll();
        hTMLElementUtils.verifyAll();
        visualizationConfigFactory.verifyAll();
        getDrawerMock.verifyAll();
        getIdentifierMock.verifyAll();
        assessmentProvider.verifyAll();
        drawerMock.verifyAll();
    });

    test('dispose should call eraseLayout on drawers', () => {
        const configId = 'id';
        setupIsAssessmentFalse(Times.exactly(numVisualizationTypes));
        setupConfigFetches(Times.exactly(numVisualizationTypes));
        const enableMessage: VisualizationWindowMessage = new VisualizationWindowMessageStubBuilder(VisualizationType.Headings, configId)
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

        setupDrawerFetches(drawerMock, Times.exactly(numVisualizationTypes));

        const iframeElement = 'iframeElement';
        hTMLElementUtils
            .setup(dm => dm.getAllElementsByTagName(It.isAny()))
            .returns(() => NodeListBuilder.createNodeList([iframeElement as any]))
            .verifiable(Times.once());

        const testObject = new DrawingController(
            frameCommunicatorMock.object,
            instanceVisibilityCheckerMock.object,
            axeResultsHelperMock.object,
            hTMLElementUtils.object,
            visualizationConfigFactory.object,
            drawerProvider.object,
            assessmentProvider.object,
        );

        testObject.initialize();
        testObject.processRequest(enableMessage);

        drawerMock.reset();
        drawerMock.setup(x => x.eraseLayout()).verifiable(Times.once());

        testObject.dispose();

        drawerMock.verifyAll();
        visualizationConfigFactory.verifyAll();
        getDrawerMock.verifyAll();
        getIdentifierMock.verifyAll();
        assessmentProvider.verifyAll();
    });
});
