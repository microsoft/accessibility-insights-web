// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export interface GuidanceTag {
    id: string;
    displayText: string;
}

export const guidanceTags = {
    WCAG_2_1: {
        id: 'WCAG_2_1',
        displayText: 'New for WCAG 2.1',
    },
    WCAG_2_2: {
        id: 'WCAG_2_2',
        displayText: 'New for WCAG 2.2',
    },
    BEST_PRACTICE: {
        id: 'BEST_PRACTICE',
        displayText: 'Best Practice',
    },
    AI_SCAN: {
        id: 'AI_SCAN',
        displayText: 'AI suggested',
    },
    PREVIEW_FEATURE: {
        id: 'PREVIEW_FEATURE',
        displayText: 'Preview',
    },
    EXPERIMENTAL_FEATURE: {
        id: 'EXPERIMENTAL_FEATURE',
        displayText: 'Experimental',
    },
};

export interface GuidanceLink {
    href: string;
    text: string;
    tags?: GuidanceTag[];
}
