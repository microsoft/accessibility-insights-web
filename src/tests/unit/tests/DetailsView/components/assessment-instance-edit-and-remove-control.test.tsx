// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from '@fluentui/react';
import { Link } from '@fluentui/react-components';
import { CapturedInstanceActionType } from 'common/types/captured-instance-action-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AssessmentInstanceEditAndRemoveControl,
    AssessmentInstanceEditAndRemoveControlProps,
} from 'DetailsView/components/assessment-instance-edit-and-remove-control';
import styles from 'DetailsView/components/assessment-instance-edit-and-remove-control.scss';
import { FailureInstancePanelControl } from 'DetailsView/components/failure-instance-panel-control';
import * as React from 'react';
import { CreateTestAssessmentProvider } from 'tests/unit/common/test-assessment-provider';
import { Mock, Times } from 'typemoq';

describe('AssessmentInstanceRemoveButton', () => {
    const featureFlagStoreData = {} as FeatureFlagStoreData;

    test('constructor', () => {
        const testObject = new AssessmentInstanceEditAndRemoveControl(
            {} as AssessmentInstanceEditAndRemoveControlProps,
        );
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render', () => {
        const onRemoveMock = Mock.ofInstance((test, step, id) => {});
        const props: AssessmentInstanceEditAndRemoveControlProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            id: 'id',
            currentInstance: {
                failureDescription: 'original text',
                path: 'original path',
                snippet: 'original snippet',
            },
            onRemove: onRemoveMock.object,
            onEdit: null,
            onAddPath: null,
            onClearPathSnippetData: null,
            assessmentsProvider: CreateTestAssessmentProvider(),
            featureFlagStoreData: featureFlagStoreData,
        };
        onRemoveMock.setup(r => r(props.test, props.step, props.id)).verifiable(Times.once());

        const testSubject = new TestableAssessmentInstanceRemoveButton(props);
        const expected = (
            <div>
                <FailureInstancePanelControl
                    step={props.step}
                    test={props.test}
                    actionType={CapturedInstanceActionType.EDIT}
                    instanceId={props.id}
                    failureInstance={props.currentInstance}
                    editFailureInstance={props.onEdit}
                    addPathForValidation={props.onAddPath}
                    clearPathSnippetData={null}
                    assessmentsProvider={props.assessmentsProvider}
                    featureFlagStoreData={featureFlagStoreData}
                />
                <Link
                    className={styles.removeButton}
                    onClick={testSubject.getOnRemoveButtonClicked()}
                >
                    <Icon iconName="delete" ariaLabel={'delete instance'} />
                </Link>
            </div>
        );

        testSubject.getOnRemoveButtonClicked()();

        expect(testSubject.render()).toEqual(expected);
        onRemoveMock.verifyAll();
    });
});

class TestableAssessmentInstanceRemoveButton extends AssessmentInstanceEditAndRemoveControl {
    public getOnRemoveButtonClicked(): (
        event?: React.MouseEvent<HTMLElement | HTMLAnchorElement | HTMLButtonElement>,
    ) => void {
        return this.onRemoveButtonClicked;
    }
}
