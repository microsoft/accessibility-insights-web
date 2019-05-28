// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock, MockBehavior } from 'typemoq';

import { BaseStore } from '../../../../../common/base-store';
import { FeatureFlags } from '../../../../../common/feature-flags';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';
import { AssessmentReportHtmlGenerator } from '../../../../../DetailsView/reports/assessment-report-html-generator';
import { createReportGeneratorProvider, ReportGeneratorProvider } from '../../../../../DetailsView/reports/report-generator-provider';
import { ReportGeneratorV1 } from '../../../../../DetailsView/reports/report-generator-v1';
import { ReportGeneratorV2 } from '../../../../../DetailsView/reports/report-generator-v2';
import { ReportHtmlGenerator } from '../../../../../DetailsView/reports/report-html-generator';
import { ReportNameGenerator } from '../../../../../DetailsView/reports/report-name-generator';

describe('ReportGeneratorProvider', () => {
    let nameGeneratorMock: IMock<ReportNameGenerator>;
    let htmlGeneratorMock: IMock<ReportHtmlGenerator>;
    let assessmentHtmlGeneratorMock: IMock<AssessmentReportHtmlGenerator>;
    let featureFlagStoreMock: IMock<BaseStore<FeatureFlagStoreData>>;
    let provider: ReportGeneratorProvider;

    beforeEach(() => {
        nameGeneratorMock = Mock.ofType<ReportNameGenerator>();
        htmlGeneratorMock = Mock.ofType<ReportHtmlGenerator>();
        assessmentHtmlGeneratorMock = Mock.ofType<AssessmentReportHtmlGenerator>();
        featureFlagStoreMock = Mock.ofType<BaseStore<FeatureFlagStoreData>>(undefined, MockBehavior.Strict);
        provider = createReportGeneratorProvider(
            nameGeneratorMock.object,
            htmlGeneratorMock.object,
            assessmentHtmlGeneratorMock.object,
            featureFlagStoreMock.object,
        );
    });

    it('creates report generator, feature flag on', () => {
        const featureFlag = {
            [FeatureFlags.newAutomatedChecksReport]: false,
        };

        featureFlagStoreMock.setup(store => store.getState()).returns(() => featureFlag);
        const generator = provider.getGenerator();

        expect(generator).toBeInstanceOf(ReportGeneratorV1);
    });

    it('creates report generator, feature flag off', () => {
        const featureFlag = {
            [FeatureFlags.newAutomatedChecksReport]: true,
        };

        featureFlagStoreMock.setup(store => store.getState()).returns(() => featureFlag);

        const generator = provider.getGenerator();

        expect(generator).toBeInstanceOf(ReportGeneratorV2);
    });
});
