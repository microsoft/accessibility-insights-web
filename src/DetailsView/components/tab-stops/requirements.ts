// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { link } from 'content/link';
import {
    TabStopRequirementContent,
    TabStopRequirementId,
    TabStopRequirementInfo,
} from 'types/tab-stop-requirement-info';

const partiallyAutomatedTag = ' (Partially automated)';
const manualTag = ' (Manual)';

export const requirements: (boolean) => TabStopRequirementInfo = (
    includeAutomationInfo: boolean,
) => {
    return {
        'keyboard-navigation': {
            name: 'Keyboard navigation',
            description: `All interactive elements can be reached using the Tab and arrow keys.${
                includeAutomationInfo ? partiallyAutomatedTag : ''
            }`,
            guidance: [link.WCAG_2_1_1],
        },
        'keyboard-traps': {
            name: 'Keyboard traps',
            description: `There are no interactive elements that “trap” input focus and prevent navigating away.${
                includeAutomationInfo ? partiallyAutomatedTag : ''
            }`,
            guidance: [link.WCAG_2_1_2],
        },
        'focus-indicator': {
            name: 'Focus indicator',
            description: `All interactive elements give a visible indication when they have input focus.${
                includeAutomationInfo ? manualTag : ''
            }`,
            guidance: [link.WCAG_2_4_7],
        },
        'tab-order': {
            name: 'Tab order',
            description: `The tab order is consistent with the logical order that's communicated visually.${
                includeAutomationInfo ? partiallyAutomatedTag : ''
            }`,
            guidance: [link.WCAG_2_4_3],
        },
        'input-focus': {
            name: 'Input focus',
            description: `Input focus does not move unexpectedly without the user initiating it.${
                includeAutomationInfo ? manualTag : ''
            }`,
            guidance: [link.WCAG_2_3_1],
        },
    };
};

export const requirementsList = (includeAutomationInfo: boolean) => {
    const requirementResults = requirements(includeAutomationInfo);
    return Object.keys(requirementResults).map((requirementId: TabStopRequirementId) => {
        return {
            ...(requirementResults[requirementId] as TabStopRequirementContent),
            id: requirementId,
        };
    });
};
