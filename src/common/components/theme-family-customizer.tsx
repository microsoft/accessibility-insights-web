// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ThemeProvider, PartialTheme } from '@fluentui/react';
import { FluentProvider, webDarkTheme, webLightTheme } from '@fluentui/react-components';
import { NamedFC } from 'common/react/named-fc';
import { DefaultTheme } from 'common/styles/default-theme';
import { FastPassTheme } from 'common/styles/fast-pass-theme';
import { FastPassV9Theme } from 'common/styles/fast-pass-v9-theme';
import { HighContrastTheme } from 'common/styles/high-contrast-theme';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import * as React from 'react';

export type ThemeFamily = 'default' | 'fast-pass';

const themeFamilyDefaultThemes: { [themeFamily in ThemeFamily]: PartialTheme } = {
    default: DefaultTheme,
    'fast-pass': FastPassTheme,
};

const themeFamilyDefaultV9Themes: { [themeFamily in ThemeFamily] } = {
    default: webLightTheme,
    'fast-pass': FastPassV9Theme,
};

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
        const defaultV9Theme = themeFamilyDefaultV9Themes[props.themeFamily]
        const activeTheme = isHighContrastEnabled ? HighContrastTheme : defaultTheme;
        const activeV9Theme = isHighContrastEnabled ? { ...webDarkTheme, colorNeutralBackground1: '#161616 ' } : defaultV9Theme;
        return <ThemeProvider applyTo="body" theme={activeTheme}><FluentProvider theme={activeV9Theme}>{props.children}</FluentProvider></ThemeProvider>;
    },
);
