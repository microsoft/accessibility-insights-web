// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { shallow } from 'enzyme';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';
import {
    NoFailedInstancesCongrats,
    NoFailedInstancesCongratsDeps,
} from 'reports/components/report-sections/no-failed-instances-congrats';

describe.each(allInstanceOutcomeTypes)(
    'NoFailedInstancesCongrats with outcomeType %s',
    outcomeType => {
        it('renders per snapshot with default message', () => {
            const deps: NoFailedInstancesCongratsDeps = {
                customCongratsMessage: null,
                outcomeType: outcomeType,
            };
            const wrapper = shallow(
                <NoFailedInstancesCongrats outcomeType={outcomeType} deps={deps} />,
            );

            expect(wrapper.getElement()).toMatchSnapshot();
        });

        it('renders per snapshot with custom message', () => {
            const deps: NoFailedInstancesCongratsDeps = {
                customCongratsMessage: 'Look, ma! No bugs!',
                outcomeType: outcomeType,
            };
            const wrapper = shallow(
                <NoFailedInstancesCongrats outcomeType={outcomeType} deps={deps} />,
            );

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    },
);
