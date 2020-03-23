// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { INavLink } from 'office-ui-fabric-react';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { Mock, Times } from 'typemoq';

import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { OutcomeTypeSemantic } from 'reports/components/outcome-type';
import { outcomeTypeSemanticsFromTestStatus } from 'reports/components/requirement-outcome-type';
import { getInnerTextFromJsxElement } from '../../../../../common/get-inner-text-from-jsx-element';
import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import {
    TestStepNavProps,
    TestStepsNav,
} from '../../../../../DetailsView/components/test-steps-nav';
import { EventStubFactory } from '../../../common/event-stub-factory';
import {
    CreateTestAssessmentProvider,
    CreateTestAssessmentProviderAutomated,
} from '../../../common/test-assessment-provider';

class TestableTestStepsNav extends TestStepsNav {
    public getOnTestStepSelected(): (
        event?: React.MouseEvent<HTMLElement>,
        item?: INavLink,
    ) => void {
        return this.onTestStepSelected;
    }

    public getRenderNavLink(): (link: INavLink) => JSX.Element {
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

    function runTest(assessmentProvider: AssessmentsProvider): void {
        const eventFactory = new EventStubFactory();
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        const eventStub = eventFactory.createKeypressEvent() as any;

        const all = assessmentProvider.all();
        const assessment = all[0];
        const firstStep = assessment.requirements[0];

        const item = {
            key: firstStep.key,
            name: firstStep.name,
            description: firstStep.description,
            url: '',
            index: 1,
            forceAnchor: true,
            renderRequirementDescription: firstStep.renderRequirementDescription,
        };

        const props: TestStepNavProps = {
            deps: {
                detailsViewActionMessageCreator: detailsViewActionMessageCreatorMock.object,
                assessmentsProvider: assessmentProvider,
                getInnerTextFromJsxElement: getInnerTextFromJsxElementStub(),
                outcomeTypeSemanticsFromTestStatus: createOutcomeTypeSemanticsFromTestStatusStub(),
            },
            selectedTest: assessment.visualizationType,
            selectedTestStep: firstStep.key,
            stepStatus: {},
            assessmentsProvider: assessmentProvider,
            ariaLabel: 'test',
        };

        generateStepStatus(assessment.requirements, props);

        detailsViewActionMessageCreatorMock
            .setup(a => a.selectRequirement(eventStub, item.key, props.selectedTest))
            .verifiable(Times.once());

        const component = React.createElement(TestableTestStepsNav, props);
        const testObject = TestUtils.renderIntoDocument(component);
        const rendered = testObject.render();
        rendered.props.onLinkClick(eventStub, item);

        expect(rendered).toMatchSnapshot('render');
        expect(testObject.getRenderNavLink()(item)).toMatchSnapshot('getRenderNavLink');
        detailsViewActionMessageCreatorMock.verifyAll();
    }

    function generateStepStatus(testSteps: Requirement[], props: TestStepNavProps): void {
        testSteps.forEach((step, index) => {
            props.stepStatus[step.key] = {
                stepFinalResult: index % 2 === 0 ? ManualTestStatus.UNKNOWN : ManualTestStatus.PASS,
                isStepScanned: false,
                name: step.name,
            };
        });
    }
    function createOutcomeTypeSemanticsFromTestStatusStub(): typeof outcomeTypeSemanticsFromTestStatus {
        const outcomeTypeSemanticsFromTestStatusMock = Mock.ofInstance(
            outcomeTypeSemanticsFromTestStatus,
        );

        outcomeTypeSemanticsFromTestStatusMock
            .setup(f => f(ManualTestStatus.PASS))
            .returns(() => {
                return { pastTense: 'passed' } as OutcomeTypeSemantic;
            });
        outcomeTypeSemanticsFromTestStatusMock
            .setup(f => f(ManualTestStatus.UNKNOWN))
            .returns(() => {
                return { pastTense: 'unknown' } as OutcomeTypeSemantic;
            });

        return outcomeTypeSemanticsFromTestStatusMock.object;
    }

    function getInnerTextFromJsxElementStub(): typeof getInnerTextFromJsxElement {
        return status => {
            return 'some test step description';
        };
    }
});
