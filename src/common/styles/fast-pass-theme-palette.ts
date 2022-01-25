// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPartialTheme } from '@uifabric/styling';
import { DefaultThemePalette } from './default-theme-palette';

// From color-definitions.scss
const neutral2 = '#f8f8f8';
const neutral4 = '#f4f4f4';
const neutral6 = '#f2f2f2';

// This is a copy of our DefaultThemePalette slightly adjusted to account for the page background
// of FastPass-like content views using our "neutral2" instead of our "white" for a background color
// (because they use Card-like elements that want to keep "white" background colors for themselves).
export const FastPassThemePalette: IPartialTheme = {
    ...DefaultThemePalette,
    palette: {
        ...DefaultThemePalette.palette,
        white: neutral2,
        neutralLighterAlt: neutral4,
        neutralLighter: neutral6,
    },
};
