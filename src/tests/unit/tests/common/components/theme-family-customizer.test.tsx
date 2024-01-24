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
jest.mock('@fluentui/react');

describe('ThemeFamilyCustomizer', () => {
    mockReactComponents([ThemeProvider]);
    it.each`
        themeFamily    | enableHighContrast | expectedThemeName
        ${'default'}   | ${false}           | ${'DefaultTheme'}
        ${'default'}   | ${undefined}       | ${'DefaultTheme'}
        ${'default'}   | ${true}            | ${'HighContrastTheme'}
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
                    stub children
                </ThemeFamilyCustomizer>,
            );

            const themeFromTestSubject = getMockComponentClassPropsForCall(ThemeProvider).theme;

            const expectedTheme = {
                DefaultTheme,
                FastPassTheme,
                HighContrastTheme,
            }[expectedThemeName];

            expect(themeFromTestSubject).toMatchObject(expectedTheme);
        },
    );
});
