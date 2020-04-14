// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AboutSettings } from 'DetailsView/components/details-view-overlay/settings-panel/settings/about/about-settings';
import { SettingsProps } from 'DetailsView/components/details-view-overlay/settings-panel/settings/settings-props';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AboutSettings', () => {
    it('renders per snapshot', () => {
        const props = {} as SettingsProps;
        const testSubject = shallow(<AboutSettings {...props} />);
        expect(testSubject.debug()).toMatchSnapshot();
    });
});
