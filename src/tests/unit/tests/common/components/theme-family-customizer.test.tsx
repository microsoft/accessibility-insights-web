// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThemeProvider } from '@fluentui/react';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import { ThemeFamilyCustomizer } from 'common/components/theme-family-customizer';
import { DefaultTheme } from 'common/styles/default-theme';
import { FastPassTheme } from 'common/styles/fast-pass-theme';
import { FastPassV9Theme } from 'common/styles/fast-pass-v9-theme';
import { HighContrastTheme } from 'common/styles/high-contrast-theme';
import { ThemeV9DarkTheme } from 'common/styles/theme-v9-dark-theme';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react');
jest.mock('@fluentui/react-components');

describe('ThemeFamilyCustomizer', () => {
    mockReactComponents([ThemeProvider, FluentProvider]);
    it.each`
        themeFamily    | enableHighContrast | expectedThemeName      | fluentUIVersion
        ${'default'}   | ${false}           | ${'DefaultTheme'}      | ${'v8'}
        ${'default'}   | ${undefined}       | ${'DefaultTheme'}      | ${'v8'}
        ${'default'}   | ${true}            | ${'HighContrastTheme'} | ${'v8'}
        ${'fast-pass'} | ${false}           | ${'FastPassTheme'}     | ${'v8'}
        ${'fast-pass'} | ${true}            | ${'HighContrastTheme'} | ${'v8'}
        ${'default'}   | ${false}           | ${'webLightTheme'}     | ${'v9'}
        ${'default'}   | ${undefined}       | ${'webLightTheme'}     | ${'v9'}
        ${'default'}   | ${true}            | ${'ThemeV9DarkTheme'}  | ${'v9'}
        ${'fast-pass'} | ${false}           | ${'FastPassV9Theme'}   | ${'v9'}
        ${'fast-pass'} | ${true}            | ${'ThemeV9DarkTheme'}  | ${'v9'}
    `(
        'renders ThemeProvider themeFamily $themeFamily using $expectedThemeName with highContrast=$enableHighContrast',
        ({ themeFamily, enableHighContrast, expectedThemeName, fluentUIVersion }) => {
            render(
                <ThemeFamilyCustomizer
                    themeFamily={themeFamily}
                    userConfigurationStoreData={
                        { enableHighContrast } as UserConfigurationStoreData
                    }
                >
                    <FluentProvider theme={themeFamily}>stub children</FluentProvider>
                </ThemeFamilyCustomizer>,
            );

            if (fluentUIVersion === 'v8') {
                const themeFromTestSubject = getMockComponentClassPropsForCall(ThemeProvider).theme;

                const expectedTheme = {
                    DefaultTheme,
                    FastPassTheme,
                    HighContrastTheme,
                }[expectedThemeName];

                expect(themeFromTestSubject).toMatchObject(expectedTheme);
            } else {
                const themeFromTestSubjectV9 =
                    getMockComponentClassPropsForCall(FluentProvider).theme;

                const expectedV9Theme = {
                    webLightTheme,
                    FastPassV9Theme,
                    ThemeV9DarkTheme,
                }[expectedThemeName];

                expect(themeFromTestSubjectV9).toMatchObject(expectedV9Theme);
            }
        },
    );
});
