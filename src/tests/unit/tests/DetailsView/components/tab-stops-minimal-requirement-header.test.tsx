// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { TabStopsFailedCounter } from 'DetailsView/tab-stops-failed-counter';
import {
    TabStopsMinimalRequirementHeader,
    TabStopsMinimalRequirementHeaderDeps,
    TabStopsMinimalRequirementHeaderProps,
} from 'DetailsView/tab-stops-minimal-requirement-header';
import { TabStopsRequirementResult } from 'DetailsView/tab-stops-requirement-result';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';
import { OutcomeChip } from '../../../../../reports/components/outcome-chip';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('../../../../../reports/components/outcome-chip');

describe('TabStopsMinimalRequirementHeader', () => {
    mockReactComponents([OutcomeChip]);
    let tabStopsFailedCounterMock: IMock<TabStopsFailedCounter>;

    const requirement = {
        id: 'keyboard-navigation',
        description: 'test requirement description',
        name: 'test requirement name',
        instances: [{ id: 'test-id', description: 'test description' }],
        isExpanded: false,
    } as TabStopsRequirementResult;

    let deps: TabStopsMinimalRequirementHeaderDeps;

    beforeEach(() => {
        tabStopsFailedCounterMock = Mock.ofType<TabStopsFailedCounter>();

        deps = {
            tabStopsFailedCounter: tabStopsFailedCounterMock.object,
        } as TabStopsMinimalRequirementHeaderDeps;
    });

    it('renders', () => {
        const props: TabStopsMinimalRequirementHeaderProps = {
            deps,
            requirement,
        };

        tabStopsFailedCounterMock
            .setup(tsf => tsf.getTotalFailedByRequirementId(It.isAny(), It.isAnyString()))
            .returns(() => 2)
            .verifiable(Times.once());

        const renderResult = render(<TabStopsMinimalRequirementHeader {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
        tabStopsFailedCounterMock.verifyAll();
    });
});
