// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThemeFamilyCustomizer } from 'common/components/theme-family-customizer';
import { DefaultThemePalette } from 'common/styles/default-theme-palette';
import { FastPassThemePalette } from 'common/styles/fast-pass-theme-palette';
import { HighContrastThemePalette } from 'common/styles/high-contrast-theme-palette';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { shallow } from 'enzyme';
import { Customizer, ISettings } from 'office-ui-fabric-react';
import * as React from 'react';

describe('ThemeFamilyCustomizer', () => {
    it.each`
        themeFamily    | enableHighContrast | expectedPaletteName
        ${'default'}   | ${false}           | ${'DefaultThemePalette'}
        ${'default'}   | ${undefined}       | ${'DefaultThemePalette'}
        ${'default'}   | ${true}            | ${'HighContrastThemePalette'}
        ${'fast-pass'} | ${false}           | ${'FastPassThemePalette'}
        ${'fast-pass'} | ${true}            | ${'HighContrastThemePalette'}
    `(
        'renders themeFamily $themeFamily using $expectedPaletteName with highContrast=$enableHighContrast',
        ({ themeFamily, enableHighContrast, expectedPaletteName }) => {
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

            const settingsPassedByTestSubject = testSubject
                .find(Customizer)
                .prop('settings') as ISettings;

            const expectedPalette = {
                DefaultThemePalette,
                FastPassThemePalette,
                HighContrastThemePalette,
            }[expectedPaletteName];

            expect(settingsPassedByTestSubject.theme).toMatchObject(expectedPalette);
        },
    );
});
