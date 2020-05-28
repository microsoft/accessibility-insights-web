// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { NewTabLink } from '../../../../../common/components/new-tab-link';
import {
    TelemetryNotice,
    TelemetryNoticeDeps,
} from '../../../../../common/components/telemetry-notice';

describe('TelemetryNotice', () => {
    it('renders', () => {
        const deps: TelemetryNoticeDeps = {
            LinkComponent: NewTabLink,
        };

        const wrapper = shallow(<TelemetryNotice deps={deps} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
