// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    FailedAndUnknownInstancesSection,
    FailedAndUnknownInstancesSectionDeps,
    FailedAndUnknownInstancesSectionProps,
} from 'common/components/cards/failed-and-unknown-instances-section';
import { CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { shallow } from 'enzyme';
import * as React from 'react';

import { exampleUnifiedRuleResult } from './sample-view-model-data';

describe('FailedAndUnknownInstancesSection', () => {
    const resultsWithFailures: CardRuleResultsByStatus = {
        fail: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
        pass: [],
        inapplicable: [],
        unknown: [],
    };
    const resultsWithUnknowns: CardRuleResultsByStatus = {
        fail: [],
        pass: [],
        inapplicable: [],
        unknown: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
    };
    const resultsWithFailuresAndUnknowns: CardRuleResultsByStatus = {
        fail: [exampleUnifiedRuleResult, exampleUnifiedRuleResult],
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
            results                                      | shouldAlertFailuresCount | description
            ${{ cards: resultsWithFailures }}            | ${undefined}             | ${'with failures'}
            ${{ cards: resultsWithUnknowns }}            | ${undefined}             | ${'with unknowns'}
            ${{ cards: resultsWithFailuresAndUnknowns }} | ${undefined}             | ${'with failures and unknowns'}
            ${null}                                      | ${undefined}             | ${'null results'}
            ${{ cards: null }}                           | ${undefined}             | ${'null cards property'}
            ${{ cards: nonEmptyResults }}                | ${true}                  | ${'with alerting on'}
            ${{ cards: nonEmptyResults }}                | ${false}                 | ${'with alerting off'}
        `('$description', ({ results, shouldAlertFailuresCount }) => {
            const props = {
                deps: {} as FailedAndUnknownInstancesSectionDeps,
                cardsViewData: results,
                shouldAlertFailuresCount,
                scanMetadata,
            } as FailedAndUnknownInstancesSectionProps;

            const wrapper = shallow(<FailedAndUnknownInstancesSection {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
