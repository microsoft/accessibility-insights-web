// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { Mock, Times } from 'typemoq';

import { IAssessmentsProvider } from '../../../../assessments/types/iassessments-provider';
import { ManualTestStatus } from '../../../../common/types/manual-test-status';
import { DetailsViewActionMessageCreator } from '../../../../DetailsView/actions/details-view-action-message-creator';
import { ITestStepNavProps, TestStepsNav } from '../../../../DetailsView/components/test-steps-nav';
import { EventStubFactory } from '../../../Common/event-stub-factory';
import {
    CreateTestAssessmentProvider,
    CreateTestAssessmentProviderAutomated,
} from '../../../Common/test-assessment-provider';

class TestableTestStepsNav extends TestStepsNav {
    public getOnTestStepSelected() {
        return this.onTestStepSelected;
    }

    public getRenderNavLink() {
        return this.renderNavLink;
    }
}

describe('TestStepsNav', () => {

    it('renders assisted tests', () => {
        runTest(CreateTestAssessmentProvider());
    });

    it('renders automated tests', () => {
        runTest(CreateTestAssessmentProviderAutomated());
    });

    function runTest(assessmentProvider: IAssessmentsProvider) {
        const eventFactory = new EventStubFactory();
        const actionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const eventStub = eventFactory.createKeypressEvent() as any;

        const all = assessmentProvider.all();
        const assessment = all[0];
        const firstStep = assessment.steps[0];

        const item = {
            key: firstStep.key,
            name: firstStep.name,
            description: firstStep.description,
            url: '',
            index: 1,
            forceAnchor: true,
            renderRequirementDescription: firstStep.renderRequirementDescription,
        };

        const props: ITestStepNavProps = {
            selectedTest: assessment.type,
            selectedTestStep: firstStep.key,
            actionMessageCreator: actionMessageCreatorMock.object,
            stepStatus: {},
            assessmentsProvider: assessmentProvider,
            ariaLabel: 'test',
        };

        assessment.steps.forEach(step => {
            props.stepStatus[step.key] = {
                stepFinalResult: ManualTestStatus.UNKNOWN,
                isStepScanned: false,
            };
        });

        actionMessageCreatorMock
            .setup(a => a.selectTestStep(eventStub, item.key, props.selectedTest))
            .verifiable(Times.once());

        const component = React.createElement(TestableTestStepsNav, props);
        const testObject = TestUtils.renderIntoDocument(component);
        const rendered = testObject.render();
        rendered.props.onLinkClick(eventStub, item);

        expect(rendered).toMatchSnapshot('render');
        expect(testObject.getRenderNavLink()(item)).toMatchSnapshot('getRenderNavLink');
        actionMessageCreatorMock.verifyAll();
    }
});

