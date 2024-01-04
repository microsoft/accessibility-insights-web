// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import {
    CommonInstancesSectionDeps,
    CommonInstancesSectionProps,
} from 'common/components/cards/common-instances-section-props';
import { NeedsReviewInstancesSection } from 'common/components/cards/needs-review-instances-section';
import { CardRuleResultsByStatus } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import * as React from 'react';

import { ResultSection } from '../../../../../../common/components/cards/result-section';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';
import { exampleUnifiedRuleResult } from './sample-view-model-data';

jest.mock('../../../../../../common/components/cards/result-section');
describe('NeedsReviewInstancesSection', () => {
    mockReactComponents([ResultSection]);

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
                sectionHeadingLevel: 2,
            } as CommonInstancesSectionProps;

            const renderResult = render(<NeedsReviewInstancesSection {...props} />);

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    });
});
