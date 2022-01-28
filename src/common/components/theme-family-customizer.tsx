// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThemeProvider, PartialTheme } from '@fluentui/react';
import { NamedFC } from 'common/react/named-fc';
import { DefaultTheme } from 'common/styles/default-theme';
import { FastPassTheme } from 'common/styles/fast-pass-theme';
import { HighContrastTheme } from 'common/styles/high-contrast-theme';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';

export type ThemeFamily = 'default' | 'fast-pass';

const themeFamilyDefaultThemes: { [themeFamily in ThemeFamily]: PartialTheme } = {
    default: DefaultTheme,
    'fast-pass': FastPassTheme,
};

export type ThemeFamilyCustomizerProps = {
    userConfigurationStoreData: UserConfigurationStoreData;
    themeFamily: ThemeFamily;
    children: React.ReactNode;
};

export const ThemeFamilyCustomizer = NamedFC<ThemeFamilyCustomizerProps>(
    'ThemeCustomizer',
    props => {
        const isHighContrastEnabled = props.userConfigurationStoreData?.enableHighContrast === true;
        const defaultTheme = themeFamilyDefaultThemes[props.themeFamily];
        const activeTheme = isHighContrastEnabled ? HighContrastTheme : defaultTheme;
        return <ThemeProvider theme={activeTheme}>{props.children}</ThemeProvider>;
    },
);
