// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import * as React from 'react';

import { ManualTestStatus } from '../../../../../common/types/store-data/manual-test-status';
import { StatusIcon } from '../../../../../DetailsView/components/status-icon';

describe('StatusIcon', () => {
    test('render for PASS', () => {
        const wrapper = Enzyme.shallow(<StatusIcon status={ManualTestStatus.PASS} level="test" />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render for PASS with extra class name', () => {
        const wrapper = Enzyme.shallow(
            <StatusIcon status={ManualTestStatus.PASS} className={'test'} level="test" />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render for FAIL', () => {
        const wrapper = Enzyme.shallow(
            <StatusIcon status={ManualTestStatus.FAIL} level="requirement" />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render for UNKNOWN', () => {
        const wrapper = Enzyme.shallow(
            <StatusIcon status={ManualTestStatus.UNKNOWN} level="requirement" />,
        );
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render for default', () => {
        const status: ManualTestStatus = -1 as ManualTestStatus;
        const wrapper = Enzyme.shallow(<StatusIcon status={status} level="requirement" />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
