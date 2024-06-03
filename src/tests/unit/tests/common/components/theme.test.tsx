// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ThemeProvider } from '@fluentui/react';
import { FluentProvider } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import { BodyClassModifier } from 'common/components/body-class-modifier';
import { ThemeDeps, ThemeInner, ThemeInnerProps } from 'common/components/theme';
import { DocumentManipulator } from 'common/document-manipulator';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';
import {
    expectMockedComponentPropsToMatchSnapshots,
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from 'tests/unit/mock-helpers/mock-module-helpers';
import { Mock } from 'typemoq';

jest.mock('common/components/body-class-modifier');
jest.mock('@fluentui/react');
jest.mock('@fluentui/react-components');

describe('ThemeInner', () => {
    mockReactComponents([BodyClassModifier, ThemeProvider, FluentProvider]);
    let props: ThemeInnerProps;
    const documentManipulatorMock = Mock.ofType(DocumentManipulator);

    beforeEach(() => {
        props = {
            deps: {
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
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([BodyClassModifier]);
    });

    test.each(testStub)(
        'componentDidMount: is high contrast mode enabled: %s',
        (enableHighContrast: boolean) => {
            const userConfigurationStoreData = { enableHighContrast } as UserConfigurationStoreData;
            render(<ThemeInner {...props} storeState={{ userConfigurationStoreData }} />);
            const hasThemeProp = getMockComponentClassPropsForCall(ThemeProvider).theme;
            expect(hasThemeProp).not.toBeNull();

        },
    );

    test.each(testStub)(
        'componentDidUpdate: is high contrast mode enabled: %s',
        (enableHighContrast: boolean) => {
            const { rerender } = render(<ThemeInner {...props} />);

            const userConfigurationStoreData = { enableHighContrast } as UserConfigurationStoreData;
            rerender(<ThemeInner {...props} storeState={{ userConfigurationStoreData }} />);
            const hasThemeProp = getMockComponentClassPropsForCall(ThemeProvider).theme;
            expect(hasThemeProp).not.toBeNull();
        },
    );
});
