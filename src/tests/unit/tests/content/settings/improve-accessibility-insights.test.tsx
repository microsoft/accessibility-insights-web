// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import {
    EnableTelemetrySettingDescription,
    LinkComponentDeps,
    TelemetryNotice,
} from '../../../../../content/settings/improve-accessibility-insights';

describe('TelemetryNotice', () => {
    it('renders with LinkComponentDeps', () => {
        const deps: LinkComponentDeps = {
            LinkComponent: NewTabLink,
        };

        const wrapper = shallow(<TelemetryNotice {...deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});

describe('EnableTelemetrySettingDescription', () => {
    it('renders with LinkComponentDeps', () => {
        const deps: LinkComponentDeps = {
            LinkComponent: NewTabLink,
        };

        const wrapper = shallow(<EnableTelemetrySettingDescription {...deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
