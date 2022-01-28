// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThemeProvider } from '@fluentui/react';
import { ThemeFamilyCustomizer } from 'common/components/theme-family-customizer';
import { DefaultTheme } from 'common/styles/default-theme';
import { FastPassTheme } from 'common/styles/fast-pass-theme';
import { HighContrastTheme } from 'common/styles/high-contrast-theme';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('ThemeFamilyCustomizer', () => {
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
            const testSubject = shallow(
                <ThemeFamilyCustomizer
                    themeFamily={themeFamily}
                    userConfigurationStoreData={
                        { enableHighContrast } as UserConfigurationStoreData
                    }
                >
                    stub children
                </ThemeFamilyCustomizer>,
            );

            const themeFromTestSubject = testSubject.find(ThemeProvider).prop('theme');

            const expectedTheme = {
                DefaultTheme,
                FastPassTheme,
                HighContrastTheme,
            }[expectedThemeName];

            expect(themeFromTestSubject).toMatchObject(expectedTheme);
        },
    );
});
