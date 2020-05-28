// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import {
    HeaderIconComponent,
    HeaderIconDeps,
    HeaderIconProps,
} from '../../../../../common/components/header-icon';

describe('HeaderIconComponent', () => {
    let props: HeaderIconProps;

    beforeEach(() => {
        props = {
            deps: {
                storeActionMessageCreator: null,
                storesHub: null,
            } as HeaderIconDeps,
            storeState: {
                userConfigurationStoreData: {
                    enableHighContrast: null,
                },
            },
        } as HeaderIconProps;
    });

    describe('renders', () => {
        describe.each([true, false, undefined])('with invertColors = %s', invertColors => {
            it.each([true, false])('and high contrast mode = %s', enableHighContrast => {
                props.invertColors = invertColors;
                props.storeState.userConfigurationStoreData.enableHighContrast = enableHighContrast;
                const wrapper = shallow(<HeaderIconComponent {...props} />);
                expect(wrapper.getElement()).toMatchSnapshot();
            });
        });
    });
});
