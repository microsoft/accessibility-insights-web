// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { Assessment } from 'assessments/types/iassessment';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { assessmentTestKeyGenerator } from 'DetailsView/components/left-nav/left-nav-link-builder';
import { IMock, Mock } from 'typemoq';
import { VisualizationType } from '../../../../../../common/types/visualization-type';
import {
    GetLeftNavSelectedKeyProps,
    getOverviewKey,
    getTestViewKey,
} from '../../../../../../DetailsView/components/left-nav/get-left-nav-selected-key';

describe('getOverviewKey', () => {
    it('returns Overview', () => {
        expect(getOverviewKey()).toEqual('Overview');
    });
});

describe('getTestviewKey', () => {
    const visualizationType: VisualizationType = 1;
    const selectedSubview = 'selected-subview';
    let featureFlagStoreData: FeatureFlagStoreData;
    let assessmentsProviderMock: IMock<AssessmentsProvider>;
    let generateReflowAssessmentTestKeyMock: IMock<assessmentTestKeyGenerator>;
    let props: GetLeftNavSelectedKeyProps;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProviderImpl>();
        generateReflowAssessmentTestKeyMock = Mock.ofType<assessmentTestKeyGenerator>();
        featureFlagStoreData = {};

        props = {
            deps: {
                generateAssessmentTestKey: generateReflowAssessmentTestKeyMock.object,
            },
            assessmentsProvider: assessmentsProviderMock.object,
            visualizationType,
            featureFlagStoreData,
            selectedSubview,
        };
    });

    it('with invalid assessment type', () => {
        assessmentsProviderMock.setup(a => a.isValidType(visualizationType)).returns(() => false);
        const expectedKey = VisualizationType[visualizationType];

        expect(getTestViewKey(props)).toEqual(expectedKey);
    });

    it('with noncollapsible assessment type', () => {
        assessmentsProviderMock.setup(a => a.isValidType(visualizationType)).returns(() => true);
        assessmentsProviderMock
            .setup(a => a.forType(visualizationType))
            .returns(() => ({ isNonCollapsible: true } as Readonly<Assessment>));
        const expectedKey = VisualizationType[visualizationType];

        expect(getTestViewKey(props)).toEqual(expectedKey);
    });

    it('with reflow', () => {
        assessmentsProviderMock.setup(a => a.isValidType(visualizationType)).returns(() => true);
        const expectedKey = 'expected key';
        generateReflowAssessmentTestKeyMock
            .setup(g => g(visualizationType, selectedSubview))
            .returns(() => expectedKey);

        expect(getTestViewKey(props)).toEqual(expectedKey);
    });
});
