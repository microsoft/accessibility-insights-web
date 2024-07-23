// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CheckboxVisibility, ConstrainMode, DetailsList } from '@fluentui/react';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { ManualTestStepResult } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ManualTestStatus } from 'common/types/store-data/manual-test-status';
import { VisualizationType } from 'common/types/visualization-type';
import { FailureInstancePanelControl } from 'DetailsView/components/failure-instance-panel-control';
import {
    ManualTestStepView,
    ManualTestStepViewProps,
} from 'DetailsView/components/manual-test-step-view';
import { TestStatusChoiceGroup } from 'DetailsView/components/test-status-choice-group';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as React from 'react';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { Mock } from 'typemoq';

describe('ManualTestStepView', () => {
    const featureFlagStoreData = {} as FeatureFlagStoreData;

    test('constructor: default', () => {
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        const props: ManualTestStepViewProps = {
            step: 'step',
            test: VisualizationType.HeadingsAssessment,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerMock.object,
            manualTestStepResultMap: {
                step: {
                    status: ManualTestStatus.UNKNOWN,
                } as ManualTestStepResult,
            },
            assessmentsProvider: CreateTestAssessmentProvider(),
            featureFlagStoreData: featureFlagStoreData,
            pathSnippetStoreData: null,
        };
        const testObject = new ManualTestStepView(props);

        const expected = (
            <React.Fragment>
                <div className="test-step-choice-group-container">
                    <TestStatusChoiceGroup
                        test={props.test}
                        step={props.step}
                        status={ManualTestStatus.UNKNOWN}
                        originalStatus={ManualTestStatus.UNKNOWN}
                        onGroupChoiceChange={
                            props.assessmentInstanceTableHandler.changeRequirementStatus
                        }
                        onUndoClicked={
                            props.assessmentInstanceTableHandler.undoRequirementStatusChange
                        }
                        isLabelVisible={true}
                    />
                </div>
                <div className="manual-test-step-table-container">{null}</div>
            </React.Fragment>
        );

        expect(testObject.render()).toEqual(expected);
    });

    test('constructor: user marked fail', () => {
        const instances = [];
        const items = [];
        const assessmentInstanceTableHandlerMock = Mock.ofType(AssessmentInstanceTableHandler);
        const cols = [];

        const pathSnippetStoreData = {
            path: 'Validated Path',
            snippet: 'Corresponding Snippet',
        };

        const failureInstance = {
            path: pathSnippetStoreData.path,
            snippet: pathSnippetStoreData.snippet,
        };

        const props: ManualTestStepViewProps = {
            step: 'step',
            test: VisualizationType.HeadingsAssessment,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerMock.object,
            manualTestStepResultMap: {
                step: {
                    id: 'id',
                    instances: instances,
                    status: ManualTestStatus.FAIL,
                },
            },
            assessmentsProvider: CreateTestAssessmentProvider(),
            featureFlagStoreData,
            pathSnippetStoreData,
        };
        assessmentInstanceTableHandlerMock
            .setup(a => a.getColumnConfigsForCapturedInstance())
            .returns(() => cols);
        assessmentInstanceTableHandlerMock
            .setup(a =>
                a.createCapturedInstanceTableItems(
                    instances,
                    props.test,
                    props.step,
                    featureFlagStoreData,
                    pathSnippetStoreData,
                ),
            )
            .returns(() => items);
        const testObject = new ManualTestStepView(props);

        const expected = (
            <React.Fragment>
                <div className="test-step-choice-group-container">
                    <TestStatusChoiceGroup
                        test={props.test}
                        step={props.step}
                        status={ManualTestStatus.FAIL}
                        originalStatus={ManualTestStatus.UNKNOWN}
                        onGroupChoiceChange={
                            props.assessmentInstanceTableHandler.changeRequirementStatus
                        }
                        onUndoClicked={
                            props.assessmentInstanceTableHandler.undoRequirementStatusChange
                        }
                        isLabelVisible={true}
                    />
                </div>
                <div className="manual-test-step-table-container">
                    <React.Fragment>
                        <h3 className="test-step-instances-header">Instances</h3>
                        <p>
                            At least one failure instance is required to mark the requirement as
                            failed.
                        </p>
                        <FailureInstancePanelControl
                            step={props.step}
                            test={props.test}
                            actionType={CapturedInstanceActionType.CREATE}
                            addFailureInstance={
                                props.assessmentInstanceTableHandler.addFailureInstance
                            }
                            addPathForValidation={
                                props.assessmentInstanceTableHandler.addPathForValidation
                            }
                            clearPathSnippetData={
                                props.assessmentInstanceTableHandler.clearPathSnippetData
                            }
                            assessmentsProvider={props.assessmentsProvider}
                            featureFlagStoreData={featureFlagStoreData}
                            failureInstance={failureInstance}
                        />
                        <DetailsList
                            items={items}
                            columns={cols}
                            checkboxVisibility={CheckboxVisibility.hidden}
                            constrainMode={ConstrainMode.horizontalConstrained}
                        />
                    </React.Fragment>
                </div>
            </React.Fragment>
        );

        expect(testObject.render()).toEqual(expected);
    });
});
