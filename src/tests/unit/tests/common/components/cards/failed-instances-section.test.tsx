// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FailedInstancesSection,
    FailedInstancesSectionDeps,
    FailedInstancesSectionProps,
} from 'common/components/cards/failed-instances-section';
import { CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
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

    describe('renders', () => {
        it.each`
            results                           | shouldAlertFailuresCount | description
            ${{ cards: resultsWithFailures }} | ${undefined}             | ${'with failures'}
            ${null}                           | ${undefined}             | ${'null results'}
            ${{ cards: null }}                | ${undefined}             | ${'null cards property'}
            ${{ cards: nonEmptyResults }}     | ${true}                  | ${'with alerting on'}
            ${{ cards: nonEmptyResults }}     | ${false}                 | ${'with alerting off'}
        `('$description', ({ results, shouldAlertFailuresCount }) => {
            const props = {
                deps: {} as FailedInstancesSectionDeps,
                cardsViewData: results,
                shouldAlertFailuresCount,
            } as FailedInstancesSectionProps;

            const wrapper = shallow(<FailedInstancesSection {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
