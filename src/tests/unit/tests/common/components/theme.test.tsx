// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { BodyClassModifier } from 'common/components/body-class-modifier';
import { ThemeDeps, ThemeInner, ThemeInnerProps } from 'common/components/theme';
import { DocumentManipulator } from 'common/document-manipulator';
import { DefaultTheme } from 'common/styles/default-theme';
import { HighContrastTheme } from 'common/styles/high-contrast-theme';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';
import { expectMockedComponentPropsToMatchSnapshots, mockReactComponents } from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock } from 'typemoq';

jest.mock('common/components/body-class-modifier');
describe('ThemeInner', () => {
    mockReactComponents([BodyClassModifier]);
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
        const renderResult = render(<ThemeInner {...props} />);

        loadThemeMock.mockReset(); // omits irrelevant mock-call records from snapshot
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([BodyClassModifier]);
    });

    test.each(testStub)(
        'componentDidMount: is high contrast mode enabled: %s',
        (enableHighContrast: boolean) => {
            const theme = enableHighContrast ? HighContrastTheme : DefaultTheme;
            const userConfigurationStoreData = { enableHighContrast } as UserConfigurationStoreData;
            render(<ThemeInner {...props} storeState={{ userConfigurationStoreData }} />);

            expect(loadThemeMock).toHaveBeenCalledWith(theme);
        },
    );

    test.each(testStub)(
        'componentDidUpdate: is high contrast mode enabled: %s',
        (enableHighContrast: boolean) => {
            const theme = enableHighContrast ? HighContrastTheme : DefaultTheme;
            const { rerender } = render(<ThemeInner {...props} />);

            loadThemeMock.mockReset();
            const userConfigurationStoreData = { enableHighContrast } as UserConfigurationStoreData;
            rerender(<ThemeInner {...props} storeState={{ userConfigurationStoreData }} />);
            expect(loadThemeMock).toHaveBeenCalledWith(theme);
        },
    );

    test('loadTheme is not called if props did not change', () => {
        const component = new ThemeInner(props);
        component.componentDidUpdate(props);
        expect(loadThemeMock).not.toHaveBeenCalled();
    });
});
