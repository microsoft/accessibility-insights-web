// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as React from 'react';

import { ManualTestStatus } from '../../../../../common/types/manual-test-status';
import { StatusIcon } from '../../../../../DetailsView/components/status-icon';

describe('StatusIcon', () => {
    test('render for PASS', () => {
        const wrapper = Enzyme.shallow(<StatusIcon status={ManualTestStatus.PASS} />);

        const icon = wrapper.find(Icon);

        expect(icon).toBeDefined();

        const expectedProperties = {
            iconName: 'completedSolid',
            className: 'status-icon positive-outcome-icon',
        };

        expect(icon.props()).toEqual(expectedProperties);
    });

    test('render for PASS with extra class name', () => {
        const wrapper = Enzyme.shallow(<StatusIcon status={ManualTestStatus.PASS} className={'test'} />);

        const icon = wrapper.find(Icon);

        expect(icon).toBeDefined();

        const expectedProperties = {
            iconName: 'completedSolid',
            className: 'status-icon positive-outcome-icon test',
        };

        expect(icon.props()).toEqual(expectedProperties);
    });

    test('render for FAIL', () => {
        const wrapper = Enzyme.shallow(<StatusIcon status={ManualTestStatus.FAIL} />);

        const icon = wrapper.find(Icon);

        expect(icon).toBeDefined();

        const expectedProperties = {
            iconName: 'StatusErrorFull',
            className: 'status-icon negative-outcome-icon',
        };

        expect(icon.props()).toEqual(expectedProperties);
    });

    test('render for UNKNOWN', () => {
        const wrapper = Enzyme.shallow(<StatusIcon status={ManualTestStatus.UNKNOWN} />);

        const icon = wrapper.find(Icon);

        expect(icon).toBeDefined();

        const expectedProperties = {
            iconName: 'circleRing',
            className: 'status-icon',
        };

        expect(icon.props()).toEqual(expectedProperties);
    });

    test('render for default', () => {
        const status: ManualTestStatus = -1 as ManualTestStatus;
        const wrapper = Enzyme.shallow(<StatusIcon status={status} />);

        const icon = wrapper.find(Icon);

        expect(icon).toBeDefined();

        const expectedProperties = {
            iconName: 'circleRing',
            className: 'status-icon',
        };

        expect(icon.props()).toEqual(expectedProperties);
    });
});
