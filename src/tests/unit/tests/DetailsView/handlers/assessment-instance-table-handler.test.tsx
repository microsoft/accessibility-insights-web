// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    AssessmentNavState,
    IGeneratedAssessmentInstance,
    IUserCapturedInstance,
} from '../../../../../common/types/store-data/iassessment-result-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { AssessmentInstanceEditAndRemoveControl } from '../../../../../DetailsView/components/assessment-instance-edit-and-remove-control';
import { AssessmentInstanceSelectedButton } from '../../../../../DetailsView/components/assessment-instance-selected-button';
import { IAssessmentInstanceRowData, ICapturedInstanceRowData } from '../../../../../DetailsView/components/assessment-instance-table';
import { AssessmentTableColumnConfigHandler } from '../../../../../DetailsView/components/assessment-table-column-config-handler';
import { TestStatusChoiceGroup } from '../../../../../DetailsView/components/test-status-choice-group';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

describe('AssessmentInstanceTableHandlerTest', () => {
    let testSubject: AssessmentInstanceTableHandler;
    let actionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let configFactoryMock: IMock<AssessmentTableColumnConfigHandler>;
    const assessmentsProvider = CreateTestAssessmentProvider();

    beforeEach(() => {
        actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        configFactoryMock = Mock.ofType(AssessmentTableColumnConfigHandler);
        testSubject = new AssessmentInstanceTableHandler(actionMessageCreatorMock.object, configFactoryMock.object, assessmentsProvider);
    });

    test('createAssessmentInstanceTableItems', () => {
        const instancesMap: DictionaryStringTo<IGeneratedAssessmentInstance> = {
            selector1: {
                target: ['target1'],
                html: 'html',
                testStepResults: {
                    step1: {
                        status: ManualTestStatus.FAIL,
                        originalStatus: 2,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
            selector2: {
                target: ['target2'],
                html: 'html',
                testStepResults: {
                    step2: {
                        status: ManualTestStatus.PASS,
                        isVisualizationEnabled: false,
                        isVisible: false,
                    },
                },
            },
        };
        const assessmentNavState: AssessmentNavState = {
            selectedTestStep: 'step1',
            selectedTestType: 5,
        };

        actionMessageCreatorMock.setup(a => a.changeManualTestStatus).verifiable(Times.atLeastOnce());

        actionMessageCreatorMock.setup(a => a.undoManualTestStatusChange).verifiable(Times.atLeastOnce());

        const rows = testSubject.createAssessmentInstanceTableItems(instancesMap, assessmentNavState, true);
        const choiceGroup: JSX.Element = (
            <TestStatusChoiceGroup
                test={5}
                step={'step1'}
                selector={'selector1'}
                status={ManualTestStatus.FAIL}
                originalStatus={2}
                onGroupChoiceChange={actionMessageCreatorMock.object.changeManualTestStatus}
                onUndoClicked={actionMessageCreatorMock.object.undoManualTestStatusChange}
            />
        );
        const selectedButton: JSX.Element = (
            <AssessmentInstanceSelectedButton
                test={5}
                step={'step1'}
                selector={'selector1'}
                isVisualizationEnabled={false}
                isVisible={false}
                onSelected={actionMessageCreatorMock.object.changeAssessmentVisualizationState}
            />
        );

        const expectedRows: IAssessmentInstanceRowData[] = [
            {
                instance: {
                    target: ['target1'],
                    html: 'html',
                    testStepResults: {
                        step1: {
                            status: ManualTestStatus.FAIL,
                            originalStatus: 2,
                            isVisualizationEnabled: false,
                            isVisible: false,
                        },
                    },
                },
                statusChoiceGroup: choiceGroup,
                key: 'selector1',
                visualizationButton: selectedButton,
            },
        ];
        actionMessageCreatorMock.verifyAll();
        configFactoryMock.verifyAll();
        expect(expectedRows).toEqual(rows);
    });

    test('createCapturedInstanceTableItems', () => {
        const instance: IUserCapturedInstance = {
            id: '1',
            description: 'des',
        };
        const assessmentNavState: AssessmentNavState = {
            selectedTestStep: 'step1',
            selectedTestType: 5,
        };

        actionMessageCreatorMock.setup(a => a.removeFailureInstance).verifiable(Times.atLeastOnce());

        const rows = testSubject.createCapturedInstanceTableItems(
            [instance],
            assessmentNavState.selectedTestType,
            assessmentNavState.selectedTestStep,
        );

        const instanceActionButtons: JSX.Element = (
            <AssessmentInstanceEditAndRemoveControl
                test={assessmentNavState.selectedTestType}
                step={assessmentNavState.selectedTestStep}
                id={instance.id}
                onRemove={actionMessageCreatorMock.object.removeFailureInstance}
                onEdit={actionMessageCreatorMock.object.editFailureInstance}
                description={instance.description}
                assessmentsProvider={assessmentsProvider}
            />
        );
        const expectedRows: ICapturedInstanceRowData[] = [
            {
                instance: instance,
                instanceActionButtons: instanceActionButtons,
            },
        ];
        actionMessageCreatorMock.verifyAll();
        expect(expectedRows).toEqual(rows);
    });

    test('getColumnConfigs', () => {
        const navState: AssessmentNavState = {
            selectedTestType: VisualizationType.HeadingsAssessment,
            selectedTestStep: 'step',
        };
        const instanceMap = {
            selector1: {
                testStepResults: {
                    step: {
                        isVisualizationEnabled: true,
                    },
                },
                target: [],
                html: '',
            },
        };
        configFactoryMock.setup(c => c.getColumnConfigs(navState, true, true)).verifiable(Times.once());

        testSubject.getColumnConfigs(instanceMap as DictionaryStringTo<IGeneratedAssessmentInstance>, navState, true);

        configFactoryMock.verifyAll();
    });

    test('changeStepStatus', () => {
        const status = ManualTestStatus.FAIL;
        const test = VisualizationType.HeadingsAssessment;
        const step = 'step';
        const actionMessageCreatorStub = {
            changeManualTestStepStatus: (paramA, paramB, paramC) => {
                expect(paramA).toBe(status);
                expect(paramB).toBe(test);
                expect(paramC).toBe(step);
            },
        };
        const testObject = new AssessmentInstanceTableHandler(
            actionMessageCreatorStub as any,
            configFactoryMock.object,
            assessmentsProvider,
        );
        testObject.changeStepStatus(status, test, step);
    });

    test('undoStepStatusChange', () => {
        const test = VisualizationType.HeadingsAssessment;
        const step = 'step';
        const actionMessageCreatorStub = {
            undoManualTestStepStatusChange: (paramA, paramB) => {
                expect(paramA).toBe(test);
                expect(paramB).toBe(step);
            },
        };
        const testObject = new AssessmentInstanceTableHandler(
            actionMessageCreatorStub as any,
            configFactoryMock.object,
            assessmentsProvider,
        );
        testObject.undoStepStatusChange(test, step);
    });

    test('addFailureInstance', () => {
        const test = VisualizationType.HeadingsAssessment;
        const step = 'step';
        const description = 'description';
        actionMessageCreatorMock.setup(a => a.addFailureInstance(description, test, step)).verifiable(Times.once());

        testSubject.addFailureInstance(description, test, step);
    });

    test('passUnmarkedInstances', () => {
        const test = VisualizationType.HeadingsAssessment;
        const step = 'missingHeadings';
        actionMessageCreatorMock.setup(a => a.passUnmarkedInstances(test, step)).verifiable(Times.once());

        testSubject.passUnmarkedInstances(test, step);
    });

    test('updateFocusedInstance', () => {
        const targetStub = ['target'];
        actionMessageCreatorMock.setup(a => a.updateFocusedInstanceTarget(targetStub)).verifiable(Times.once());
        testSubject.updateFocusedTarget(targetStub);
    });

    test('renderSelectedButton should trigger addOneInstance', () => {
        const instance = {
            target: ['target1'],
            html: 'html',
            testStepResults: {
                step1: {
                    status: ManualTestStatus.FAIL,
                    originalStatus: 2,
                    isVisualizationEnabled: true,
                },
            },
        } as IGeneratedAssessmentInstance;

        const assessmentNavState: AssessmentNavState = {
            selectedTestStep: 'step1',
            selectedTestType: 5,
        };

        (testSubject as any).renderSelectedButton(instance, null, assessmentNavState);

        configFactoryMock.verifyAll();
    });

    test('getColumnConfigsForCapturedInstance', () => {
        configFactoryMock.setup(c => c.getColumnConfigsForCapturedInstances()).verifiable(Times.once());

        testSubject.getColumnConfigsForCapturedInstance();

        configFactoryMock.verifyAll();
    });
});
