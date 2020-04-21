// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FailedInstancesSection,
    FailedInstancesSectionDeps,
    FailedInstancesSectionProps,
} from 'common/components/cards/failed-instances-section';
import { CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { ScanMetaData } from 'common/types/store-data/scan-meta-data';
import { TargetAppData } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('FailedInstancesSection', () => {
    const resultsWithFailures: CardRuleResultsByStatus = {
        fail: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
        pass: [],
        inapplicable: [],
        unknown: [],
    };
    const nonEmptyResults: CardRuleResultsByStatus = {
        fail: [],
        pass: [],
        inapplicable: [],
        unknown: [],
    };
    const testTargetAppInfo: TargetAppData = {
        name: 'target name',
        url: 'target url',
    };
    const testScanMetadata = {
        targetAppInfo: testTargetAppInfo,
    } as ScanMetaData;

    describe('renders', () => {
        it.each`
            results                           | shouldAlertFailuresCount | targetAppInfo        | scanMetadata        | description
            ${{ cards: resultsWithFailures }} | ${undefined}             | ${testTargetAppInfo} | ${undefined}        | ${'with failures'}
            ${null}                           | ${undefined}             | ${testTargetAppInfo} | ${undefined}        | ${'null results'}
            ${{ cards: null }}                | ${undefined}             | ${testTargetAppInfo} | ${undefined}        | ${'null cards property'}
            ${{ cards: nonEmptyResults }}     | ${true}                  | ${testTargetAppInfo} | ${undefined}        | ${'with alerting on'}
            ${{ cards: nonEmptyResults }}     | ${false}                 | ${testTargetAppInfo} | ${undefined}        | ${'with alerting off'}
            ${{ cards: nonEmptyResults }}     | ${undefined}             | ${undefined}         | ${testScanMetadata} | ${'with scanMetadata'}
        `('$description', ({ results, shouldAlertFailuresCount, targetAppInfo, scanMetadata }) => {
            const props = {
                deps: {} as FailedInstancesSectionDeps,
                cardsViewData: results,
                shouldAlertFailuresCount,
                targetAppInfo,
                scanMetadata,
            } as FailedInstancesSectionProps;

            const wrapper = shallow(<FailedInstancesSection {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
