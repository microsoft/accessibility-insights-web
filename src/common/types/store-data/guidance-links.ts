// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface GuidanceTag {
    id: string;
    displayText: string;
}

export const guidanceTags = {
    WCAG_2_2: {
        id: 'WCAG_2_2',
        displayText: 'New for WCAG 2.2',
    },
    WCAG_2_1: {
        id: 'WCAG_2_1',
        displayText: 'New for WCAG 2.1',
    },
    BEST_PRACTICE: {
        id: 'BEST_PRACTICE',
        displayText: 'Best Practice',
    },
};

export interface GuidanceLink {
    href: string;
    text: string;
    tags?: GuidanceTag[];
}
