// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import { Toggle } from 'office-ui-fabric-react/lib/Toggle';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

import { UserConfigMessageCreator } from '../../../../../../../../common/message-creators/user-config-message-creator';
import {
    HighContrastSettings,
    HighContrastSettingsDeps,
} from '../../../../../../../../DetailsView/components/settings-panel/settings/high-contrast/high-contrast-settings';

describe('HighContrastSettings', () => {
    describe('renders', () => {
        const enableStates = [true, false];

        it.each(enableStates)('with enabled = %s', enabled => {
            const props = {
                deps: Mock.ofType<HighContrastSettingsDeps>().object,
                enabled,
            };

            const wrapper = shallow(<HighContrastSettings {...props} />);

            expect(wrapper.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        it('handles toggle click', () => {
            const userConfigMessageCreatorMock = Mock.ofType<UserConfigMessageCreator>();
            const deps = {
                userConfigMessageCreator: userConfigMessageCreatorMock.object,
            };
            const props = {
                deps,
                enabled: true,
            };

            const wrapper = shallow(<HighContrastSettings {...props} />);

            userConfigMessageCreatorMock.setup(creator => creator.setHighContrastMode(!props.enabled)).verifiable(Times.once());

            wrapper
                .dive()
                .find(Toggle)
                .simulate('click');

            userConfigMessageCreatorMock.verifyAll();
        });
    });
});
