// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import {
    EnableTelemetrySettingDescription,
    EnableTelemetrySettingDescriptionDeps,
} from '../../../../../common/components/enable-telemetry-setting-description';
import { NewTabLink } from '../../../../../common/components/new-tab-link';

describe('EnableTelemetrySettingDescription', () => {
    it('renders', () => {
        const deps: EnableTelemetrySettingDescriptionDeps = {
            LinkComponent: NewTabLink,
        };

        const wrapper = shallow(<EnableTelemetrySettingDescription deps={deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
