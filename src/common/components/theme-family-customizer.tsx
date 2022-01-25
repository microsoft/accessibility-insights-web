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

// This is a store-state-aware version of the Office Fabric <Customizer> component. It's intended
// as a wrapper for Fabric-based components that need to use a different Office Fabric Theme from
// our default one, but still want to support being overriden by HighContrastTheme when a user has
// enabled our High Contrast Mode setting.
export const ThemeFamilyCustomizer = NamedFC<ThemeFamilyCustomizerProps>(
    'ThemeCustomizer',
    props => {
        const isHighContrastEnabled = props.userConfigurationStoreData?.enableHighContrast === true;
        const defaultTheme = themeFamilyDefaultThemes[props.themeFamily];

        const activeTheme = isHighContrastEnabled ? highConstrastTheme : defaultTheme;

        return <Customizer settings={{ theme: activeTheme }}>{props.children}</Customizer>;
    },
);
