// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { UniquelyIdentifiableInstances } from '../../../../background/instance-identifier-generator';
import {
    VisualizationConfiguration,
    VisualizationConfigurationFactory,
} from '../../../../common/configs/visualization-configuration-factory';
import { HTMLElementUtils } from '../../../../common/html-element-utils';
import { Message } from '../../../../common/message';
import { Messages } from '../../../../common/messages';
import { VisualizationType } from '../../../../common/types/visualization-type';
import { WindowUtils } from '../../../../common/window-utils';
import { AssessmentVisualizationInstance } from '../../../../injected/frameCommunicators/html-element-axe-results-helper';
import { InstanceVisibilityChecker } from '../../../../injected/instance-visibility-checker';
import { itIsFunction } from '../../common/it-is-function';

describe('InstanceVisibilityCheckerTest', () => {
    let windowUtilsMock: IMock<WindowUtils>;
    let sendMessageMock: IMock<(message) => void>;
    let htmlElementUtilsMock: IMock<HTMLElementUtils>;
    let testSubject: InstanceVisibilityChecker;
    let configFactoryMock: IMock<VisualizationConfigurationFactory>;
    let configStub: VisualizationConfiguration;
    let getInstanceIdentiferGeneratorMock: IMock<(step: string) => Function>;
    let getUpdateVisibilityMock: IMock<(step: string) => boolean>;
    let generateInstanceIdentifierMock: IMock<(instance: UniquelyIdentifiableInstances) => string>;
    let testType: VisualizationType;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        sendMessageMock = Mock.ofInstance(message => {});
        htmlElementUtilsMock = Mock.ofType(HTMLElementUtils);
        configFactoryMock = Mock.ofType(VisualizationConfigurationFactory);
        generateInstanceIdentifierMock = Mock.ofInstance(instance => null);
        getInstanceIdentiferGeneratorMock = Mock.ofInstance(step => null);
        getUpdateVisibilityMock = Mock.ofInstance(step => null);
        testType = -1;
        configStub = {
            getInstanceIdentiferGenerator: getInstanceIdentiferGeneratorMock.object,
            getUpdateVisibility: getUpdateVisibilityMock.object,
        } as VisualizationConfiguration;

        testSubject = new InstanceVisibilityChecker(
            sendMessageMock.object,
            windowUtilsMock.object,
            htmlElementUtilsMock.object,
            configFactoryMock.object,
        );
    });

    test('constructor', () => {
        expect(new InstanceVisibilityChecker(null, null, null, null)).toBeDefined();
    });

    test('checkVisibility: new generated identifier does not match current element', () => {
        const frameResultIds = ['found id', 'another id'];
        const elementFoundGeneratedIds = ['found id', 'another found id'];
        const frameResults: AssessmentVisualizationInstance[] = [
            {
                ruleResults: {},
                targetIndex: 0,
                target: ['target0'],
                isFailure: false,
                isVisualizationEnabled: false,
                html: 'testhtml',
                isVisible: true,
                identifier: frameResultIds[0],
            },
            {
                ruleResults: {},
                targetIndex: 0,
                target: ['target1'],
                isFailure: false,
                isVisualizationEnabled: false,
                html: 'testhtml',
                isVisible: true,
                identifier: frameResultIds[1],
            },
        ];
        const testStepDrawerId = 'headingFunction';

        const elements = [
            {
                offsetWidth: 80,
                offsetHeight: 80,
                outerHTML: 'testhtml',
            },
            {
                offsetWidth: 40,
                offsetHeight: 40,
                outerHTML: 'differenttesthtml',
            },
        ];

        const expectedUniquelyIdentifiableInstances = [
            {
                target: frameResults[0].target,
                html: elements[0].outerHTML,
            } as UniquelyIdentifiableInstances,
            {
                target: frameResults[1].target,
                html: elements[1].outerHTML,
            } as UniquelyIdentifiableInstances,
        ];

        windowUtilsMock
            .setup(wU => wU.setInterval(itIsFunction, InstanceVisibilityChecker.recalculationTimeInterval))
            .callback((cb, timeout) => {
                cb();
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(hU => hU.querySelector('target0'))
            .returns(() => elements[0] as HTMLElement)
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(hU => hU.querySelector('target1'))
            .returns(() => elements[1] as HTMLElement)
            .verifiable(Times.once());

        setupConfigurationFactoryMocks(testType, testStepDrawerId, expectedUniquelyIdentifiableInstances, elementFoundGeneratedIds);

        const expectedPayload: Message = {
            type: Messages.Assessment.UpdateInstanceVisibility,
            payload: {
                payloadBatch: [
                    {
                        test: testType,
                        selector: frameResultIds[0],
                        isVisible: true,
                    },
                    {
                        test: testType,
                        selector: frameResultIds[1],
                        isVisible: false,
                    },
                ],
            },
        };

        sendMessageMock.setup(sm => sm(It.isValue(expectedPayload))).verifiable(Times.once());

        testSubject.createVisibilityCheckerInterval(testStepDrawerId, testType, frameResults);
        verifyMocks();
    });

    test('checkVisibility: two elements, one identifier matching and one not', () => {
        const frameResultId = 'some id';
        const elementFoundGeneratedId = frameResultId;
        const frameResult: AssessmentVisualizationInstance = {
            ruleResults: {},
            targetIndex: 0,
            target: ['target0'],
            isFailure: false,
            isVisualizationEnabled: false,
            html: 'testhtml',
            isVisible: true,
            identifier: frameResultId,
        };
        const testStepDrawerId = 'headingFunction';

        const element = {
            offsetWidth: 80,
            offsetHeight: 80,
            outerHTML: 'differenttesthtml',
        } as HTMLElement;

        const expectedUniquelyIdentifiableInstance = {
            target: frameResult.target,
            html: element.outerHTML,
        };

        windowUtilsMock
            .setup(wU => wU.setInterval(itIsFunction, InstanceVisibilityChecker.recalculationTimeInterval))
            .callback((cb, timeout) => {
                cb();
            })
            .verifiable(Times.once());

        htmlElementUtilsMock
            .setup(hU => hU.querySelector('target0'))
            .returns(() => element)
            .verifiable(Times.once());

        setupConfigurationFactoryMocks(testType, testStepDrawerId, [expectedUniquelyIdentifiableInstance], [elementFoundGeneratedId]);

        const expectedPayload: Message = {
            type: Messages.Assessment.UpdateInstanceVisibility,
            payload: {
                payloadBatch: [
                    {
                        test: testType,
                        selector: frameResultId,
                        isVisible: true,
                    },
                ],
            },
        };

        sendMessageMock.setup(sm => sm(It.isValue(expectedPayload))).verifiable(Times.once());

        testSubject.createVisibilityCheckerInterval(testStepDrawerId, testType, [frameResult]);
        verifyMocks();
    });

    test('checkVisibility: element is null', () => {
        const frameResultId = 'some id';
        const frameResult: AssessmentVisualizationInstance = {
            ruleResults: {},
            targetIndex: 0,
            target: ['target0'],
            isFailure: false,
            isVisualizationEnabled: false,
            html: 'testhtml',
            isVisible: true,
            identifier: frameResultId,
        };
        const testStepDrawerId = 'headingFunction';

        windowUtilsMock
            .setup(wU => wU.setInterval(It.isAny(), InstanceVisibilityChecker.recalculationTimeInterval))
            .callback((cb, timeout) => {
                cb();
            })
            .verifiable(Times.once());

        configFactoryMock.setup(cfm => cfm.getConfiguration(testType)).returns(() => configStub);

        getUpdateVisibilityMock.setup(guvm => guvm(testStepDrawerId)).returns(() => true);

        htmlElementUtilsMock
            .setup(hU => hU.querySelector('target0'))
            .returns(() => null)
            .verifiable(Times.once());

        const expectedPayload: Message = {
            type: Messages.Assessment.UpdateInstanceVisibility,
            payload: {
                payloadBatch: [
                    {
                        test: testType,
                        selector: frameResultId,
                        isVisible: false,
                    },
                ],
            },
        };

        sendMessageMock.setup(sm => sm(It.isValue(expectedPayload))).verifiable(Times.once());

        testSubject.createVisibilityCheckerInterval(testStepDrawerId, testType, [frameResult]);
        verifyMocks();
    });

    test('clearVisibilityCheck', () => {
        const id = 'some id';
        (testSubject as any).identifierToIntervalMap = {
            [id]: 10,
        };

        windowUtilsMock.setup(wU => wU.clearInterval(It.isAny())).verifiable(Times.once());

        testSubject.clearVisibilityCheck(id, testType);
        expect((testSubject as any).setIntervalFunc).toBeUndefined();
        verifyMocks();
    });

    test('checkVisibility: skipVisibilityCheck', () => {
        const frameResultId = 'some id';
        const frameResult: AssessmentVisualizationInstance = {
            ruleResults: {},
            targetIndex: 0,
            target: ['target0'],
            isFailure: false,
            isVisualizationEnabled: false,
            html: 'testhtml',
            isVisible: true,
            identifier: frameResultId,
        };
        const testStepDrawerId = 'headingFunction';

        getUpdateVisibilityMock.setup(guvm => guvm(testStepDrawerId)).returns(() => false);

        configFactoryMock.setup(cfm => cfm.getConfiguration(testType)).returns(() => configStub);

        windowUtilsMock
            .setup(wU => wU.setInterval(itIsFunction, InstanceVisibilityChecker.recalculationTimeInterval))
            .verifiable(Times.never());

        testSubject.createVisibilityCheckerInterval(testStepDrawerId, testType, [frameResult]);
        verifyMocks();
    });

    function setupConfigurationFactoryMocks(
        getConfigType: VisualizationType,
        drawerIdentifier: string,
        instances: UniquelyIdentifiableInstances[],
        returnedIdentifiers: string[],
    ): void {
        getUpdateVisibilityMock.setup(guvm => guvm(drawerIdentifier)).returns(() => true);

        configFactoryMock.setup(cfm => cfm.getConfiguration(getConfigType)).returns(() => configStub);

        getInstanceIdentiferGeneratorMock.setup(giigm => giigm(drawerIdentifier)).returns(() => generateInstanceIdentifierMock.object);

        instances.forEach((instance, i) => {
            generateInstanceIdentifierMock.setup(giim => giim(It.isValue(instance))).returns(() => returnedIdentifiers[i]);
        });
    }

    function verifyMocks(): void {
        windowUtilsMock.verifyAll();
        htmlElementUtilsMock.verifyAll();
        sendMessageMock.verifyAll();
    }
});
