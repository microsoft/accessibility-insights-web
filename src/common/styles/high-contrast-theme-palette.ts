// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPartialTheme } from '@fluentui/style-utilities';

export const HighContrastThemePalette: IPartialTheme = {
    // basic palette from https://developer.microsoft.com/en-us/fabric#/styles/themegenerator with white text and #161616 background
    palette: {
        themePrimary: '#2b88d8',
        themeLighterAlt: '#eff6fc',
        themeLighter: '#deecf9',
        themeLight: '#c7e0f4',
        themeTertiary: '#71afe5',
        themeSecondary: '#2b88d8',
        // themeDarkAlt changed from default #106ebe to match design
        // used as icon color in ActionButtons but no semantic slot yet
        themeDarkAlt: '#ffffff',
        themeDark: '#005a9e',
        themeDarker: '#004578',
        neutralLighterAlt: '#212121',
        neutralLighter: '#2a2a2a',
        neutralLight: '#393939',
        neutralQuaternaryAlt: '#424242',
        neutralQuaternary: '#494949',
        neutralTertiaryAlt: '#686868',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#161616',
    },
    semanticColors: {
        link: '#FFFF00',
        linkHovered: '#D0D000',
        menuIcon: '#FFFFFF',
        disabledText: '#C285FF',
        primaryButtonBackground: '#38A9FF',
        primaryButtonBackgroundPressed: '#2184D0',
        inputBackgroundChecked: '#38A9FF',
    },
};
