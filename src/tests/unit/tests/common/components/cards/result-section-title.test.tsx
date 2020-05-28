// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    ResultSectionTitle,
    ResultSectionTitleProps,
} from 'common/components/cards/result-section-title';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ResultSectionTitle', () => {
    describe('renders', () => {
        it.each`
            badgeCount | shouldAlertFailuresCount | description
            ${10}      | ${false}                 | ${'with no-alerting'}
            ${15}      | ${undefined}             | ${'with no-alerting, shouldAlertFailuresCount is undefined'}
            ${0}       | ${true}                  | ${'with alerting, badgeCount is 0'}
            ${1}       | ${true}                  | ${'with alerting, badgeCount is 1'}
            ${2}       | ${true}                  | ${'with alerting, badgeCount is greater than 1'}
        `('$description', ({ badgeCount, shouldAlertFailuresCount }) => {
            const props: ResultSectionTitleProps = {
                title: 'test title',
                badgeCount,
                shouldAlertFailuresCount,
                outcomeType: 'pass',
            };

            const wrapped = shallow(<ResultSectionTitle {...props} />);
            expect(wrapped.getElement()).toMatchSnapshot();
        });
    });
});
