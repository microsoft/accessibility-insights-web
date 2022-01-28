// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CommonInstancesSectionDeps,
    CommonInstancesSectionProps,
} from 'common/components/cards/common-instances-section-props';
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('NeedsReviewInstancesSection', () => {
    const resultsWithUnknowns: CardRuleResultsByStatus = {
        fail: [],
        pass: [],
        inapplicable: [],
        unknown: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
    };
    const nonEmptyResults: CardRuleResultsByStatus = {
        fail: [],
        pass: [],
        inapplicable: [],
        unknown: [],
    };
    const scanMetadata: ScanMetadata = {
        targetAppInfo: {
            name: 'page title',
            url: 'page url',
        },
    } as ScanMetadata;

    describe('renders', () => {
        it.each`
            results                           | shouldAlertFailuresCount | description
            ${{ cards: resultsWithUnknowns }} | ${undefined}             | ${'with unknowns'}
            ${null}                           | ${undefined}             | ${'null results'}
            ${{ cards: null }}                | ${undefined}             | ${'null cards property'}
            ${{ cards: nonEmptyResults }}     | ${true}                  | ${'with alerting on'}
            ${{ cards: nonEmptyResults }}     | ${false}                 | ${'with alerting off'}
        `('$description', ({ results, shouldAlertFailuresCount }) => {
            const props = {
                deps: {} as CommonInstancesSectionDeps,
                cardsViewData: results,
                shouldAlertFailuresCount,
                scanMetadata,
                titleHeadingLevel: 2,
            } as CommonInstancesSectionProps;

            const wrapper = shallow(<NeedsReviewInstancesSection {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
