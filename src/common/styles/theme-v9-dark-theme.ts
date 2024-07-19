// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { webDarkTheme } from '@fluentui/react-components';

// This is a copy of our ThemeDark from V9 slightly adjusted to account for the page background
// of FastPass-like content views using our "neutral2" instead of our "white" for a background color
// (because they use Card-like elements that want to keep "white" background colors for themselves).
export const ThemeV9DarkTheme = {
    ...webDarkTheme,
    colorNeutralBackground1: '#161616',
    colorNeutralForeground2: '#fff',
    colorCompoundBrandStrokeHover:'#ffffff'
};
