// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { DefaultThemePalette } from 'common/styles/default-theme-palette';
import { FastPassThemePalette } from 'common/styles/fast-pass-theme-palette';
import { HighContrastThemePalette } from 'common/styles/high-contrast-theme-palette';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { createTheme, Customizer, ITheme } from 'office-ui-fabric-react';
import * as React from 'react';

export type ThemeFamily = 'default' | 'fast-pass';

// createTheme is somewhat expensive; don't call it in render()
const themeFamilyDefaultThemes: { [themeFamily in ThemeFamily]: ITheme } = {
    default: createTheme(DefaultThemePalette),
    'fast-pass': createTheme(FastPassThemePalette),
};
const highConstrastTheme = createTheme(HighContrastThemePalette);

export type ThemeFamilyCustomizerProps = {
    userConfigurationStoreData: UserConfigurationStoreData;
    themeFamily: ThemeFamily;
    children: React.ReactNode;
};

// This is a store-state-aware version of the Fluent UI <ThemeProvider> component. It's intended
// as a wrapper for Fluent UI-based components that need to use a different Theme from our default
// one, but still want to support being overriden by HighContrastTheme when a user has enabled our
// High Contrast Mode setting (or a native system High Contrast setting).
export const ThemeFamilyCustomizer = NamedFC<ThemeFamilyCustomizerProps>(
    'ThemeCustomizer',
    props => {
        const isHighContrastEnabled = props.userConfigurationStoreData?.enableHighContrast === true;
        const defaultTheme = themeFamilyDefaultThemes[props.themeFamily];

        const activeTheme = isHighContrastEnabled ? highConstrastTheme : defaultTheme;

        // When we update to Fluent UI 8, replace the below line with:
        //
        //     return <ThemeProvider theme={activeTheme}>{props.children}</ThemeProvider>
        //
        // ...and remove the `createTheme` calls from the theme constants at the top of
        // this file (ThemeProvider doesn't need them because it supports using PartialThemes
        // directly, whereas Customizer only supports full Themes)
        return <Customizer settings={{ theme: activeTheme }}>{props.children}</Customizer>;
    },
);
