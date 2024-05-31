// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { webLightTheme } from "@fluentui/react-components";


// This is a copy of our DefaultThemePalette slightly adjusted to account for the page background
// of FastPass-like content views using our "neutral2" instead of our "white" for a background color
// (because they use Card-like elements that want to keep "white" background colors for themselves).
export const FastPassV9Theme = {
    ...webLightTheme,
        // In the default theme, the below progression goes $neutral-0, $neutral-2, $neutral-4,
        // $neutral-8. In Fast Pass content panes, we instead start from $neutral-2 because
        // $neutral-0 is reserved for Card component backgrounds. To form a consistent color
        // progression, we apply -alpha versions of the original neutrals on top of $neutral-2.
        //
        // You can use a tool like https://borderleft.com/toolbox/rgba to calculate the values
        colorNeutralBackground1: '#f8f8f8', // $neutral-2 from color-definitions.scss
        neutralLighterAlt: '#f3f3f3', // $neutral-alpha-2 over $neutral-2
        neutralLighter: '#eeeeee', // $neutral-alpha-4 over $neutral-2
        neutralLight: '#e4e4e4', // $neutral-alpha-8 over $neutral-2

};
