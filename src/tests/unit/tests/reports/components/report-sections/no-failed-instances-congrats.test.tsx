// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import * as React from 'react';

import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import {
    NoFailedInstancesCongrats,
    NoFailedInstancesCongratsDeps,
} from 'reports/components/report-sections/no-failed-instances-congrats';
import { InlineImage } from '../../../../../../reports/components/inline-image';
import { mockReactComponents } from '../../../../mock-helpers/mock-module-helpers';

jest.mock('../../../../../../reports/components/inline-image');
describe.each(allInstanceOutcomeTypes)(
    'NoFailedInstancesCongrats with outcomeType %s',
    outcomeType => {
        mockReactComponents([InlineImage]);
        it('renders per snapshot with default message', () => {
            const deps: NoFailedInstancesCongratsDeps = {
                customCongratsContinueInvestigatingMessage: null,
            };
            const renderResult = render(
                <NoFailedInstancesCongrats outcomeType={outcomeType} deps={deps} />,
            );

            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('renders per snapshot with custom message', () => {
            const deps: NoFailedInstancesCongratsDeps = {
                customCongratsContinueInvestigatingMessage: 'Continue investigating!',
            };
            const renderResult = render(
                <NoFailedInstancesCongrats outcomeType={outcomeType} deps={deps} />,
            );

            expect(renderResult.asFragment()).toMatchSnapshot();
        });
    },
);
