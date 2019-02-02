// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ControlledBodyClassName, ControlledBodyClassNameProps } from '../../../../../common/components/theme';

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
        const wrapper = shallow(<ControlledBodyClassName {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
