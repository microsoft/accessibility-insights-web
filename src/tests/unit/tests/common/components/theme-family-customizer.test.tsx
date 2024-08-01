// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThemeProvider } from '@fluentui/react';
import { render } from '@testing-library/react';
import { ThemeFamilyCustomizer } from 'common/components/theme-family-customizer';
import { DefaultTheme } from 'common/styles/default-theme';
import { FastPassTheme } from 'common/styles/fast-pass-theme';
import { HighContrastTheme } from 'common/styles/high-contrast-theme';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
import { ThemeV9DarkTheme } from 'common/styles/theme-v9-dark-theme';
import { FluentProvider } from '@fluentui/react-components';

jest.mock('@fluentui/react');
jest.mock('@fluentui/react-components')

describe('ThemeFamilyCustomizer', () => {
    mockReactComponents([ThemeProvider, FluentProvider]);
    it.each`
        themeFamily    | enableHighContrast | expectedThemeName
        ${'default'}   | ${false}           | ${'DefaultTheme'}
        ${'default'}   | ${undefined}       | ${'DefaultTheme'}
        ${'default'}   | ${true}            | ${'HighContrastTheme'}
        ${'default'}   | ${false}           | ${'webLightTheme'}
        ${'default'}   | ${undefined}       | ${'DefaultTheme'}
        ${'default'}   | ${true}            | ${'ThemeV9DarkTheme'}
        ${'fast-pass'} | ${false}           | ${'FastPassTheme'}
        ${'fast-pass'} | ${true}            | ${'ThemeV9DarkTheme'}
        ${'fast-pass'} | ${false}           | ${'FastPassTheme'}
        ${'fast-pass'} | ${true}            | ${'HighContrastTheme'}
    `(
        'renders themeFamily $themeFamily using $expectedThemeName with highContrast=$enableHighContrast',
        ({ themeFamily, enableHighContrast, expectedThemeName }) => {
            render(
                <ThemeFamilyCustomizer
                    themeFamily={themeFamily}
                    userConfigurationStoreData={
                        { enableHighContrast } as UserConfigurationStoreData
                    }
                >
                    <FluentProvider theme={themeFamily}>
                        stub children
                    </FluentProvider>
                </ThemeFamilyCustomizer>,
            );

            const themeFromTestSubject = getMockComponentClassPropsForCall(ThemeProvider).theme;
            //const themeFromTestSubjectV9 = getMockComponentClassPropsForCall(FluentProvider).theme
            const expectedTheme = {
                DefaultTheme,
                FastPassTheme,
                HighContrastTheme,
            }[expectedThemeName];

            // const expectedV9Theme = {
            //     ThemeV9DarkTheme
            // }[expectedThemeName]

            expect(themeFromTestSubject).toMatchObject(expectedTheme);
            //  expect(themeFromTestSubjectV9).toMatchObject(expectedV9Theme)
        },
    );
});
