// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { VisualizationType } from 'common/types/visualization-type';
import {
    RequirementView,
    RequirementViewDeps,
    RequirementViewProps,
} from 'DetailsView/components/requirement-view';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('RequirementViewTest', () => {
    it('renders with content from props', () => {
        const requirementStub = {
            name: 'test-requirement-name',
            description: <div>test-description</div>,
            howToTest: <p>how-to-test-stub</p>,
        } as Requirement;

        const assessmentNavState = {
            selectedTestType: VisualizationType.Headings,
            selectedTestSubview: 'test-requirement-name',
        };

        const selectedRequirementStub = {
            getVisualHelperToggle: ({}) => <div>test-visual-helper-toggle</div>,
        } as Readonly<Requirement>;

        const assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);
        assessmentsProviderMock
            .setup(ap =>
                ap.getStep(
                    assessmentNavState.selectedTestType,
                    assessmentNavState.selectedTestSubview,
                ),
            )
            .returns(() => selectedRequirementStub);

        const props: RequirementViewProps = {
            deps: {} as RequirementViewDeps,
            requirement: requirementStub,
            assessmentsProvider: assessmentsProviderMock.object,
            assessmentNavState: assessmentNavState,
        };

        const rendered = shallow(<RequirementView {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });
});
