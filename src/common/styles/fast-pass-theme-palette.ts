// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPartialTheme } from '@uifabric/styling';
import { DefaultThemePalette } from './default-theme-palette';

// This is a copy of our DefaultThemePalette slightly adjusted to account for the page background
// of FastPass-like content views using our "neutral2" instead of our "white" for a background color
// (because they use Card-like elements that want to keep "white" background colors for themselves).
export const FastPassThemePalette: IPartialTheme = {
    ...DefaultThemePalette,
    palette: {
        ...DefaultThemePalette.palette,

        white: '#f8f8f8', // $neutral-2 from color-definitions.scss

        // In the default theme, these correspond to $neutral-2, $neutral-4, and $neutral-8
        // To ensure these end up progressively darker than our adjusted $white, we apply
        // alpha-based versions of the same neutrals over the adjusted $white
        //
        // You can use a tool like https://borderleft.com/toolbox/rgba to calculate the values
        neutralLighterAlt: '#f3f3f3', // $neutral-alpha-2 over $neutral-2
        neutralLighter: '#eeeeee', // $neutral-alpha-4 over $neutral-2
        neutralLight: '#e4e4e4', // $neutral-alpha-8 over $neutral-2
    },
};
