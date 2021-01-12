// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ThemeDeps, ThemeInner, ThemeInnerProps } from 'common/components/theme';
import { DocumentManipulator } from 'common/document-manipulator';
import { DefaultThemePalette } from 'common/styles/default-theme-palette';
import { HighContrastThemePalette } from 'common/styles/high-contrast-theme-palette';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock } from 'typemoq';

describe('ThemeInner', () => {
    let props: ThemeInnerProps;
    const loadThemeMock = jest.fn();
    const documentManipulatorMock = Mock.ofType(DocumentManipulator);

    beforeEach(() => {
        props = {
            deps: {
                loadTheme: loadThemeMock,
                documentManipulator: documentManipulatorMock.object,
                storeActionMessageCreator: null,
                storesHub: null,
            } as ThemeDeps,
            storeState: {
                userConfigurationStoreData: {
                    enableHighContrast: null,
                },
            },
        } as ThemeInnerProps;
    });

    const testStub = [true, false];

    test.each(testStub)('is high contrast mode enabled: %s', (enableHighContrast: boolean) => {
        props.storeState.userConfigurationStoreData.enableHighContrast = enableHighContrast;
        const wrapper = shallow(<ThemeInner {...props} />);

        loadThemeMock.mockReset(); // omits irrelevant mock-call records from snapshot
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test.each(testStub)(
        'componentDidMount: is high contrast mode enabled: %s',
        (enableHighContrast: boolean) => {
            const theme = enableHighContrast ? HighContrastThemePalette : DefaultThemePalette;
            const userConfigurationStoreData = { enableHighContrast } as UserConfigurationStoreData;
            shallow(<ThemeInner {...props} storeState={{ userConfigurationStoreData }} />);

            expect(loadThemeMock).toBeCalledWith(theme);
        },
    );

    test.each(testStub)(
        'componentDidUpdate: is high contrast mode enabled: %s',
        (enableHighContrast: boolean) => {
            const theme = enableHighContrast ? HighContrastThemePalette : DefaultThemePalette;
            const wrapper = shallow(<ThemeInner {...props} />);

            loadThemeMock.mockReset();
            wrapper.setProps({
                storeState: {
                    userConfigurationStoreData: { enableHighContrast },
                },
            });
            expect(loadThemeMock).toBeCalledWith(theme);
        },
    );

    test('loadTheme is not called if props did not change', () => {
        const component = new ThemeInner(props);
        component.componentDidUpdate(props);
        expect(loadThemeMock).not.toBeCalled();
    });
});
