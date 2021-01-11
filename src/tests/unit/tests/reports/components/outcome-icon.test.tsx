// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CheckIcon, CheckIconInverted } from 'common/icons/check-icon';
import { CircleIcon } from 'common/icons/circle-icon';
import { CrossIconInverted } from 'common/icons/cross-icon';
import { InapplicableIcon, InapplicableIconInverted } from 'common/icons/inapplicable-icon';
import { shallow } from 'enzyme';
import * as React from 'react';
import { OutcomeIcon } from 'reports/components/outcome-icon';
import { allRequirementOutcomeTypes } from 'reports/components/requirement-outcome-type';

describe('OutcomeIcon', () => {
    describe('render', () => {
        allRequirementOutcomeTypes.forEach(outcomeType => {
            test(outcomeType, () => {
                const wrapper = shallow(<OutcomeIcon outcomeType={outcomeType} />);
                expect(wrapper.getElement()).toMatchSnapshot();
            });
        });
    });
});

[
    CheckIcon,
    CheckIconInverted,
    CircleIcon,
    CrossIconInverted,
    InapplicableIcon,
    InapplicableIconInverted,
].forEach(Icon => {
    const name = Icon.displayName;
    describe(name, () => {
        test('render', () => {
            const wrapper = shallow(<Icon />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
