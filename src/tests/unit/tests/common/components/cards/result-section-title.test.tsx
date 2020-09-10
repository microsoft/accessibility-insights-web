// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { shallow } from 'enzyme';
import * as React from 'react';
import { allInstanceOutcomeTypes } from 'reports/components/instance-outcome-type';

describe.each(allInstanceOutcomeTypes)(
    'ResultSectionTitle with outcomeType %s renders',
    outcomeType => {
        it.each`
            badgeCount | shouldAlertFailuresCount | titleSize   | description
            ${10}      | ${false}                 | ${'large'}  | ${'with no-alerting'}
            ${15}      | ${undefined}             | ${'large'}  | ${'with no-alerting, shouldAlertFailuresCount is undefined'}
            ${0}       | ${true}                  | ${'large'}  | ${'with alerting, badgeCount is 0'}
            ${1}       | ${true}                  | ${'large'}  | ${'with alerting, badgeCount is 1'}
            ${2}       | ${true}                  | ${'large'}  | ${'with alerting, badgeCount is greater than 1'}
            ${10}      | ${false}                 | ${'medium'} | ${'with no-alerting, titleSize=medium'}
        `('$description', ({ badgeCount, shouldAlertFailuresCount, titleSize }) => {
            const props: ResultSectionTitleProps = {
                title: 'test title',
                badgeCount,
                shouldAlertFailuresCount,
                outcomeType: outcomeType,
                titleSize,
            };

            const wrapped = shallow(<ResultSectionTitle {...props} />);
            expect(wrapped.getElement()).toMatchSnapshot();
        });
    },
);
