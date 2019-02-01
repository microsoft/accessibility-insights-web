// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow, mount } from 'enzyme';
import * as React from 'react';
import { IBaseStore } from '../../../../../common/istore';
import { IMock, Mock, It } from 'typemoq';
import { UserConfigurationStore } from '../../../../../background/stores/global/user-configuration-store';
import { ThemeProps, Theme } from '../../../../../common/components/theme';

describe('Theme', () => {
    let storeMock: IMock<IBaseStore<any>>;
    let props: ThemeProps;

    beforeEach(() => {
        storeMock = Mock.ofType(UserConfigurationStore);
        props = {
            userConfigurationStore: storeMock.object,
        };
    });

    test('constructor', () => {
        storeMock
            .setup(sm => sm.getState())
            .returns(() => {
                return { enableTelemetry: true };
            });
        const wrapper = shallow(<Theme {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render', () => {
        const wrapper = shallow(<Theme {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('theme change', () => {
        let updateStateCb;
        storeMock
            .setup(sm => sm.addChangedListener(It.isAny()))
            .callback(update => {
                updateStateCb = update;
            });
        const wrapper = shallow(<Theme {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot('initial theme');
        storeMock
            .setup(sm => sm.getState())
            .returns(() => {
                return { enableTelemetry: true };
            });
        updateStateCb();
        expect(wrapper.getElement()).toMatchSnapshot('new theme');
    });
});
