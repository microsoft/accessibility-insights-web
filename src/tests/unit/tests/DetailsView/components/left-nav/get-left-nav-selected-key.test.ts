// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentsProvider } from 'assessments/types/assessments-provider';
import { FeatureFlags } from 'common/feature-flags';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
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
    let generateReflowAssessmentTestKeyMock: IMock<(
        visualizationType: VisualizationType,
        selectedSubview: string,
    ) => string>;
    let props: GetLeftNavSelectedKeyProps;

    beforeEach(() => {
        assessmentsProviderMock = Mock.ofType<AssessmentsProviderImpl>();
        generateReflowAssessmentTestKeyMock = Mock.ofType<
            (visualizationType: VisualizationType, selectedSubview: string) => string
        >();
        featureFlagStoreData = {};
        featureFlagStoreData[FeatureFlags.reflowUI] = false;

        props = {
            deps: {
                generateReflowAssessmentTestKey: generateReflowAssessmentTestKeyMock.object,
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

    it('with reflow flag disabled', () => {
        assessmentsProviderMock.setup(a => a.isValidType(visualizationType)).returns(() => true);
        const expectedKey = VisualizationType[visualizationType];

        expect(getTestViewKey(props)).toEqual(expectedKey);
    });

    it('with reflow flag enabled', () => {
        assessmentsProviderMock.setup(a => a.isValidType(visualizationType)).returns(() => true);
        featureFlagStoreData[FeatureFlags.reflowUI] = true;
        const expectedKey = 'expected key';
        generateReflowAssessmentTestKeyMock
            .setup(g => g(visualizationType, selectedSubview))
            .returns(() => expectedKey);

        expect(getTestViewKey(props)).toEqual(expectedKey);
    });
});
