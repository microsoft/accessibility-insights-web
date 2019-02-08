// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';

import { ThemeDeps, ThemeInner, ThemeInnerProps } from '../../../../../common/components/theme';
import { DefaultThemePalette } from '../../../../../common/styles/default-theme-palette';
import { HighContrastThemePalette } from '../../../../../common/styles/high-contrast-theme-palette';
import { FeatureFlagStoreData } from '../../../../../common/types/store-data/feature-flag-store-data';

describe('ThemeInner', () => {
    let props: ThemeInnerProps;
    const loadThemeMock = jest.fn();

    beforeEach(() => {
        props = {
            deps: {
                loadTheme: loadThemeMock,
                storeActionMessageCreator: null,
                storesHub: null,
            } as ThemeDeps,
            storeState: {
                userConfigurationStoreData: {
                    enableHighContrast: null,
                },
                featureFlagStoreData: {
                    highContrastMode: true,
                } as FeatureFlagStoreData,
            },
        } as ThemeInnerProps;
    });

    // trying to form 2^2 combinations
    const testStub = [
        { enableHighContrast: true, highContrastMode: true },
        { enableHighContrast: true, highContrastMode: false },
        { enableHighContrast: false, highContrastMode: true },
        { enableHighContrast: false, highContrastMode: false },
    ];

    test.each(testStub)('is high contrast mode enabled: %p', ({ enableHighContrast, highContrastMode }) => {
        props.storeState.userConfigurationStoreData.enableHighContrast = enableHighContrast;
        props.storeState.featureFlagStoreData.highContrastMode = highContrastMode;
        const wrapper = shallow(<ThemeInner {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test.each(testStub)('componentDidUpdate: is high contrast mode enabled: %p', ({ enableHighContrast, highContrastMode }) => {
        const theme = enableHighContrast && highContrastMode ? HighContrastThemePalette : DefaultThemePalette;
        const wrapper = shallow(<ThemeInner {...props} />);
        wrapper.setProps({
            storeState: {
                userConfigurationStoreData: { enableHighContrast },
                featureFlagStoreData: { highContrastMode },
            },
        });
        expect(loadThemeMock).toBeCalledWith(theme);
    });

    test('loadTheme is not called if props did not change', () => {
        const component = new ThemeInner(props);
        component.componentDidUpdate(props);
        expect(loadThemeMock).not.toBeCalled();
    });
});
