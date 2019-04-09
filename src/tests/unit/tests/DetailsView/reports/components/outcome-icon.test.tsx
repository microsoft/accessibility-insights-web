// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { CheckIcon } from '../../../../../../common/icons/check-icon';
import { CircleIcon } from '../../../../../../common/icons/circle-icon';
import { CrossIcon } from '../../../../../../common/icons/cross-icon';
import { OutcomeIcon } from '../../../../../../DetailsView/reports/components/outcome-icon';
import { allOutcomeTypes } from '../../../../../../DetailsView/reports/components/outcome-type';

describe('OutcomeIcon', () => {
    describe('render', () => {
        allOutcomeTypes.forEach(outcomeType => {
            test(outcomeType, () => {
                const wrapper = shallow(<OutcomeIcon outcomeType={outcomeType} />);
                expect(wrapper.getElement()).toMatchSnapshot();
            });
        });
    });
});

[CheckIcon, CircleIcon, CrossIcon].forEach(Icon => {
    const name = Icon.displayName;
    describe(name, () => {
        test('render', () => {
            const wrapper = shallow(<Icon />);
            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
