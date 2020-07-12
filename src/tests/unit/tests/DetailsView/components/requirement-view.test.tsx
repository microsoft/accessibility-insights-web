// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import {
    AssessmentNavState,
    GeneratedAssessmentInstance,
    ManualTestStepResult,
} from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    AssessmentViewUpdateHandler,
    AssessmentViewUpdateHandlerProps,
} from 'DetailsView/components/assessment-view-update-handler';
import {
    RequirementView,
    RequirementViewDeps,
    RequirementViewProps,
} from 'DetailsView/components/requirement-view';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { DictionaryStringTo } from 'types/common-types';

describe('RequirementViewTest', () => {
    let requirementStub: Requirement;
    let assessmentNavState: AssessmentNavState;
    let selectedRequirementStub: Requirement;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let props: RequirementViewProps;
    let manualRequirementResultMapStub: DictionaryStringTo<ManualTestStepResult>;
    let assessmentInstanceTableHandlerStub: AssessmentInstanceTableHandler;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;
    let updateHandlerMock: IMock<AssessmentViewUpdateHandler>;
    beforeEach(() => {
        requirementStub = {
            name: 'test-requirement-name',
            description: <div>test-description</div>,
            howToTest: <p>how-to-test-stub</p>,
        } as Requirement;

        assessmentNavState = {
            selectedTestType: VisualizationType.Headings,
            selectedTestSubview: 'test-requirement-name',
        };

        selectedRequirementStub = {
            getVisualHelperToggle: ({}) => <div>test-visual-helper-toggle</div>,
        } as Readonly<Requirement>;

        assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);
        assessmentsProviderMock
            .setup(ap =>
                ap.getStep(
                    assessmentNavState.selectedTestType,
                    assessmentNavState.selectedTestSubview,
                ),
            )
            .returns(() => selectedRequirementStub);
        assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;
        manualRequirementResultMapStub = {
            'some manual test step result id': null,
        };
        featureFlagStoreDataStub = {
            'some feature flag': true,
        };
        pathSnippetStoreDataStub = {
            path: null,
        } as PathSnippetStoreData;
        updateHandlerMock = Mock.ofType(AssessmentViewUpdateHandler);

        props = {
            deps: { assessmentViewUpdateHandler: updateHandlerMock.object } as RequirementViewDeps,
            requirement: requirementStub,
            assessmentsProvider: assessmentsProviderMock.object,
            assessmentNavState: assessmentNavState,
            instancesMap: {} as DictionaryStringTo<GeneratedAssessmentInstance>,
            isRequirementEnabled: true,
            isRequirementScanned: true,
            manualRequirementResultMap: manualRequirementResultMapStub,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
            prevTarget: { id: 4 },
            currentTarget: { id: 5 },
            assessmentData: {},
        } as RequirementViewProps;
    });

    it('renders with content from props', () => {
        const rendered = shallow(<RequirementView {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('componentDidUpdate', () => {
        const newProps = cloneDeep(props);
        newProps.deps.assessmentViewUpdateHandler = updateHandlerMock.object;
        const prevProps = props;
        prevProps.assessmentNavState.selectedTestSubview = 'prevTestStep';

        updateHandlerMock
            .setup(u =>
                u.update(
                    It.isValue(getUpdateHandlerProps(prevProps)),
                    It.isValue(getUpdateHandlerProps(newProps)),
                ),
            )
            .verifiable(Times.once());

        const testObject = new RequirementView(newProps);

        testObject.componentDidUpdate(prevProps);

        updateHandlerMock.verifyAll();
    });

    test('componentDidMount', () => {
        updateHandlerMock
            .setup(u => u.onMount(getUpdateHandlerProps(props)))
            .verifiable(Times.once());

        const testObject = new RequirementView(props);

        testObject.componentDidMount();

        updateHandlerMock.verifyAll();
    });

    test('componentWillUnmount', () => {
        updateHandlerMock
            .setup(u => u.onUnmount(getUpdateHandlerProps(props)))
            .verifiable(Times.once());

        const testObject = new RequirementView(props);

        testObject.componentWillUnmount();

        updateHandlerMock.verifyAll();
    });

    function getUpdateHandlerProps(
        givenProps: RequirementViewProps,
    ): AssessmentViewUpdateHandlerProps {
        return {
            deps: givenProps.deps,
            selectedRequirementIsEnabled: givenProps.isRequirementEnabled,
            assessmentNavState: givenProps.assessmentNavState,
            assessmentData: givenProps.assessmentData,
            prevTarget: givenProps.prevTarget,
            currentTarget: givenProps.currentTarget,
        };
    }
});
