// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InstanceTableRow } from 'assessments/types/instance-table-data';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    UserCapturedInstance,
} from '../../../../../common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { VisualizationType } from '../../../../../common/types/visualization-type';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { AssessmentInstanceEditAndRemoveControl } from '../../../../../DetailsView/components/assessment-instance-edit-and-remove-control';
import { AssessmentInstanceSelectedButton } from '../../../../../DetailsView/components/assessment-instance-selected-button';
import { CapturedInstanceRowData } from '../../../../../DetailsView/components/assessment-instance-table';
import { AssessmentTableColumnConfigHandler } from '../../../../../DetailsView/components/assessment-table-column-config-handler';
import { TestStatusChoiceGroup } from '../../../../../DetailsView/components/test-status-choice-group';
import { AssessmentInstanceTableHandler } from '../../../../../DetailsView/handlers/assessment-instance-table-handler';
import { DictionaryStringTo } from '../../../../../types/common-types';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

describe('AssessmentInstanceTableHandlerTest', () => {
    let testSubject: AssessmentInstanceTableHandler;
    let detailsViewActionMessageCreatorMock: IMock<DetailsViewActionMessageCreator>;
    let configFactoryMock: IMock<AssessmentTableColumnConfigHandler>;
    const assessmentsProvider = CreateTestAssessmentProvider();
    const featureFlagStoreData = {} as FeatureFlagStoreData;

    beforeEach(() => {
        detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        configFactoryMock = Mock.ofType(AssessmentTableColumnConfigHandler);
        testSubject = new AssessmentInstanceTableHandler(
            detailsViewActionMessageCreatorMock.object,
            configFactoryMock.object,
            assessmentsProvider,
        );
    });

    test('createAssessmentInstanceTableItems', () => {
        const instancesMap: DictionaryStringTo<GeneratedAssessmentInstance> = {
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
            selectedTestSubview: 'step1',
            selectedTestType: 5,
        };

        const rows = testSubject.createAssessmentInstanceTableItems(
            instancesMap,
            assessmentNavState,
            true,
        );
        const choiceGroup: JSX.Element = (
            <TestStatusChoiceGroup
                test={5}
                step={'step1'}
                selector={'selector1'}
                status={ManualTestStatus.FAIL}
                originalStatus={2}
                onGroupChoiceChange={
                    detailsViewActionMessageCreatorMock.object.changeManualTestStatus
                }
                onUndoClicked={
                    detailsViewActionMessageCreatorMock.object.undoManualTestStatusChange
                }
            />
        );
        const selectedButton: JSX.Element = (
            <AssessmentInstanceSelectedButton
                test={5}
                step={'step1'}
                selector={'selector1'}
                isVisualizationEnabled={false}
                isVisible={false}
                onSelected={
                    detailsViewActionMessageCreatorMock.object.changeAssessmentVisualizationState
                }
            />
        );

        const expectedRows: InstanceTableRow[] = [
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
        configFactoryMock.verifyAll();
        expect(expectedRows).toEqual(rows);
    });

    test('createCapturedInstanceTableItems with PathSnippetStoreData', () => {
        const instance: UserCapturedInstance = {
            id: '1',
            description: 'des',
        };
        const assessmentNavState: AssessmentNavState = {
            selectedTestSubview: 'step1',
            selectedTestType: 5,
        };

        const pathSnippetStoreData = {
            path: 'test path',
            snippet: 'test snippet for path',
        };

        const rows = testSubject.createCapturedInstanceTableItems(
            [instance],
            assessmentNavState.selectedTestType,
            assessmentNavState.selectedTestSubview,
            featureFlagStoreData,
            pathSnippetStoreData,
        );

        const currentInstance = {
            failureDescription: instance.description,
            path: pathSnippetStoreData.path,
            snippet: pathSnippetStoreData.snippet,
        };

        const instanceActionButtons: JSX.Element = (
            <AssessmentInstanceEditAndRemoveControl
                test={assessmentNavState.selectedTestType}
                step={assessmentNavState.selectedTestSubview}
                id={instance.id}
                currentInstance={currentInstance}
                onRemove={detailsViewActionMessageCreatorMock.object.removeFailureInstance}
                onEdit={detailsViewActionMessageCreatorMock.object.editFailureInstance}
                onAddPath={detailsViewActionMessageCreatorMock.object.addPathForValidation}
                onClearPathSnippetData={
                    detailsViewActionMessageCreatorMock.object.clearPathSnippetData
                }
                assessmentsProvider={assessmentsProvider}
                featureFlagStoreData={featureFlagStoreData}
            />
        );
        const expectedRows: CapturedInstanceRowData[] = [
            {
                instance: instance,
                instanceActionButtons: instanceActionButtons,
            },
        ];
        expect(expectedRows).toEqual(rows);
    });

    test('createCapturedInstanceTableItems without PathSnippetStoreData', () => {
        const instance: UserCapturedInstance = {
            id: '1',
            description: 'des',
            selector: 'saved path',
            html: 'saved instance',
        };
        const assessmentNavState: AssessmentNavState = {
            selectedTestSubview: 'step1',
            selectedTestType: 5,
        };

        const pathSnippetStoreData = {
            path: null,
            snippet: null,
        };

        const rows = testSubject.createCapturedInstanceTableItems(
            [instance],
            assessmentNavState.selectedTestType,
            assessmentNavState.selectedTestSubview,
            featureFlagStoreData,
            pathSnippetStoreData,
        );

        const currentInstance = {
            failureDescription: instance.description,
            path: instance.selector,
            snippet: instance.html,
        };

        const instanceActionButtons: JSX.Element = (
            <AssessmentInstanceEditAndRemoveControl
                test={assessmentNavState.selectedTestType}
                step={assessmentNavState.selectedTestSubview}
                id={instance.id}
                currentInstance={currentInstance}
                onRemove={detailsViewActionMessageCreatorMock.object.removeFailureInstance}
                onEdit={detailsViewActionMessageCreatorMock.object.editFailureInstance}
                onAddPath={detailsViewActionMessageCreatorMock.object.addPathForValidation}
                onClearPathSnippetData={
                    detailsViewActionMessageCreatorMock.object.clearPathSnippetData
                }
                assessmentsProvider={assessmentsProvider}
                featureFlagStoreData={featureFlagStoreData}
            />
        );
        const expectedRows: CapturedInstanceRowData[] = [
            {
                instance: instance,
                instanceActionButtons: instanceActionButtons,
            },
        ];
        expect(expectedRows).toEqual(rows);
    });

    test('getColumnConfigs', () => {
        const navState: AssessmentNavState = {
            selectedTestType: VisualizationType.HeadingsAssessment,
            selectedTestSubview: 'step',
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
        configFactoryMock
            .setup(c => c.getColumnConfigs(navState, true, true))
            .verifiable(Times.once());

        testSubject.getColumnConfigs(
            instanceMap as DictionaryStringTo<GeneratedAssessmentInstance>,
            navState,
            true,
        );

        configFactoryMock.verifyAll();
    });

    test('changeRequirementStatus', () => {
        const status = ManualTestStatus.FAIL;
        const test = VisualizationType.HeadingsAssessment;
        const requirement = 'requirement';
        const actionMessageCreatorStub = {
            changeManualRequirementStatus: (paramA, paramB, paramC) => {
                expect(paramA).toBe(status);
                expect(paramB).toBe(test);
                expect(paramC).toBe(requirement);
            },
        };
        const testObject = new AssessmentInstanceTableHandler(
            actionMessageCreatorStub as any,
            configFactoryMock.object,
            assessmentsProvider,
        );
        testObject.changeRequirementStatus(status, test, requirement);
    });

    test('undoRequirementStatusChange', () => {
        const test = VisualizationType.HeadingsAssessment;
        const requirement = 'requirement';
        const actionMessageCreatorStub = {
            undoManualRequirementStatusChange: (paramA, paramB) => {
                expect(paramA).toBe(test);
                expect(paramB).toBe(requirement);
            },
        };
        const testObject = new AssessmentInstanceTableHandler(
            actionMessageCreatorStub as any,
            configFactoryMock.object,
            assessmentsProvider,
        );
        testObject.undoRequirementStatusChange(test, requirement);
    });

    test('addPathForValidation', () => {
        const path = 'test path';
        detailsViewActionMessageCreatorMock
            .setup(a => a.addPathForValidation(path))
            .verifiable(Times.once());
        testSubject.addPathForValidation(path);

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    test('clearPathSnippetData', () => {
        detailsViewActionMessageCreatorMock
            .setup(a => a.clearPathSnippetData())
            .verifiable(Times.once());
        testSubject.clearPathSnippetData();

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    test('addFailureInstance', () => {
        const test = VisualizationType.HeadingsAssessment;
        const requirement = 'requirement';
        const instanceData = {
            failureDescription: 'description',
            path: 'path',
            snippet: 'snippet',
        };

        detailsViewActionMessageCreatorMock
            .setup(a => a.addFailureInstance(instanceData, test, requirement))
            .verifiable(Times.once());

        testSubject.addFailureInstance(instanceData, test, requirement);

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    test('passUnmarkedInstances', () => {
        const test = VisualizationType.HeadingsAssessment;
        const requirement = 'missingHeadings';
        detailsViewActionMessageCreatorMock
            .setup(a => a.passUnmarkedInstances(test, requirement))
            .verifiable(Times.once());

        testSubject.passUnmarkedInstances(test, requirement);

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    test('updateFocusedInstance', () => {
        const targetStub = ['target'];
        detailsViewActionMessageCreatorMock
            .setup(a => a.updateFocusedInstanceTarget(targetStub))
            .verifiable(Times.once());
        testSubject.updateFocusedTarget(targetStub);

        detailsViewActionMessageCreatorMock.verifyAll();
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
        } as GeneratedAssessmentInstance;

        const assessmentNavState: AssessmentNavState = {
            selectedTestSubview: 'step1',
            selectedTestType: 5,
        };

        (testSubject as any).renderSelectedButton(instance, null, assessmentNavState);

        configFactoryMock.verifyAll();
    });

    test('getColumnConfigsForCapturedInstance', () => {
        configFactoryMock
            .setup(c => c.getColumnConfigsForCapturedInstances())
            .verifiable(Times.once());

        testSubject.getColumnConfigsForCapturedInstance();

        configFactoryMock.verifyAll();
    });
});
