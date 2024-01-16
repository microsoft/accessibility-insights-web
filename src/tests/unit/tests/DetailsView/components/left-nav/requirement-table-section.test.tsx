// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Spinner } from '@fluentui/react';
import { render } from '@testing-library/react';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Requirement } from 'assessments/types/requirement';
import { ManualTestStepResult } from 'common/types/store-data/assessment-result-data';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { PathSnippetStoreData } from 'common/types/store-data/path-snippet-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import {
    RequirementTableSection,
    RequirementTableSectionProps,
} from 'DetailsView/components/left-nav/requirement-table-section';
import { AssessmentInstanceTableHandler } from 'DetailsView/handlers/assessment-instance-table-handler';
import * as React from 'react';
import { DictionaryStringTo } from 'types/common-types';
import { AssessmentInstanceTable } from '../../../../../../DetailsView/components/assessment-instance-table';
import { ManualTestStepView } from '../../../../../../DetailsView/components/manual-test-step-view';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
jest.mock('../../../../../../DetailsView/components/manual-test-step-view');
jest.mock('../../../../../../DetailsView/components/assessment-instance-table');
describe('RequirementTableSection', () => {
    mockReactComponents([ManualTestStepView, Spinner, AssessmentInstanceTable]);
    let props: RequirementTableSectionProps;
    let manualRequirementResultMapStub: DictionaryStringTo<ManualTestStepResult>;
    let assessmentInstanceTableHandlerStub: AssessmentInstanceTableHandler;
    let assessmentProviderStub: AssessmentsProvider;
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let pathSnippetStoreDataStub: PathSnippetStoreData;

    beforeEach(() => {
        assessmentInstanceTableHandlerStub = {
            changeRequirementStatus: null,
        } as AssessmentInstanceTableHandler;
        manualRequirementResultMapStub = {
            'some manual test step result id': null,
        };
        assessmentProviderStub = {
            all: null,
        } as AssessmentsProvider;
        featureFlagStoreDataStub = {
            'some feature flag': true,
        };
        pathSnippetStoreDataStub = {
            path: null,
        } as PathSnippetStoreData;

        props = {
            assessmentNavState: {
                selectedTestSubview: 'some test view',
                selectedTestType: -1 as VisualizationType,
            },
            manualRequirementResultMap: manualRequirementResultMapStub,
            assessmentInstanceTableHandler: assessmentInstanceTableHandlerStub,
            assessmentsProvider: assessmentProviderStub,
            featureFlagStoreData: featureFlagStoreDataStub,
            pathSnippetStoreData: pathSnippetStoreDataStub,
            requirement: {
                isManual: false,
                getDefaultMessage: _ => null,
                instanceTableHeaderType: 'none',
            },
        } as RequirementTableSectionProps;
    });

    test('render ManualTestStepView when requirement is manual', () => {
        props.requirement = {
            isManual: true,
        } as Requirement;

        const renderResult = render(<RequirementTableSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ManualTestStepView]);
    });

    test('render Spinner when scanning in progress', () => {
        props.scanningInProgress = true;

        const renderResult = render(<RequirementTableSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([Spinner]);
    });

    test('render instance table', () => {
        const renderResult = render(<RequirementTableSection {...props} />);

        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([AssessmentInstanceTable]);
    });
});
