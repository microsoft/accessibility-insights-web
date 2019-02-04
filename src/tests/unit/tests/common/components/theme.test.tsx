// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ThemeInner, ControlledBodyClassNameProps } from '../../../../../common/components/theme';

describe('ControlledBodyClassName', () => {
    let props: ControlledBodyClassNameProps;

    beforeEach(() => {
        props = {
            storeState: {
                userConfigurationStoreData: {
                    enableHighContrast: null,
                },
            },
        } as ControlledBodyClassNameProps;
    });

    test.each([true, false])('is high contrast mode enabled: %s', (enableHighContrast: boolean) => {
        props.storeState.userConfigurationStoreData.enableHighContrast = enableHighContrast;
        const wrapper = shallow(<ThemeInner {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
