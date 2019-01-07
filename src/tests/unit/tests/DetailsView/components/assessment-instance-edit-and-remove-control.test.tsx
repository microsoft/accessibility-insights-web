// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Link } from 'office-ui-fabric-react/lib/Link';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

import { VisualizationType } from '../../../../../common/types/visualization-type';
import {
    AssessmentInstanceEditAndRemoveControl,
    IAssessmentInstanceEditAndRemoveControlProps,
} from '../../../../../DetailsView/components/assessment-instance-edit-and-remove-control';
import {
    CapturedInstanceActionType,
    FailureInstancePanelControl,
} from '../../../../../DetailsView/components/failure-instance-panel-control';
import { CreateTestAssessmentProvider } from '../../../common/test-assessment-provider';

describe('AssessmentInstanceRemoveButton', () => {
    test('constructor', () => {
        const testObject = new AssessmentInstanceEditAndRemoveControl({} as IAssessmentInstanceEditAndRemoveControlProps);
        expect(testObject).toBeInstanceOf(React.Component);
    });

    test('render', () => {
        const onRemoveMock = Mock.ofInstance((test, step, id) => {});
        const props: IAssessmentInstanceEditAndRemoveControlProps = {
            test: VisualizationType.HeadingsAssessment,
            step: 'headingLevel',
            id: 'id',
            description: 'description',
            onRemove: onRemoveMock.object,
            onEdit: null,
            assessmentsProvider: CreateTestAssessmentProvider(),
        };
        onRemoveMock
            .setup(r => r(props.test, props.step, props.id))
            .verifiable(Times.once());

        const testSubject = new TestableAssessmentInstanceRemoveButton(props);
        const expected = (
            <div>
                <FailureInstancePanelControl
                    step={props.step}
                    test={props.test}
                    actionType={CapturedInstanceActionType.EDIT}
                    instanceId={props.id}
                    editFailureInstance={props.onEdit}
                    originalText={props.description}
                    assessmentsProvider={props.assessmentsProvider}
                />
                <Link className="remove-button" onClick={testSubject.getOnRemoveButtonClicked()}>
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
    public getOnRemoveButtonClicked() {
        return this.onRemoveButtonClicked;
    }
}
