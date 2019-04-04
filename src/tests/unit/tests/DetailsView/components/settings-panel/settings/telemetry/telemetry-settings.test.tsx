// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';
import {
    TelemetrySettings,
    TelemetrySettingsDeps,
} from '../../../../../../../../DetailsView/components/settings-panel/settings/telemetry/telemetry-settings';

describe('TelemetrySettings', () => {
    describe('renders', () => {
        const enableStates = [true, false];

        it.each(enableStates)('with enabled = %s', enabled => {
            const props = {
                deps: Mock.ofType<TelemetrySettingsDeps>().object,
                name: 'telemetry-settings',
                description: <>this is the description</>,
                enabled,
            };

            const wrapper = shallow(<TelemetrySettings {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });
});
