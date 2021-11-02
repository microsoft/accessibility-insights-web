// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopRequirementContent, TabStopRequirementInfo } from 'types/tab-stop-requirement-info';

export const requirements: TabStopRequirementInfo = {
    'keyboard-navigation': {
        name: 'Keyboard navigation',
        description: 'All interactive elements can be reached using the Tab and arrow keys. ',
    },
    'keyboard-traps': {
        name: 'Keyboard traps',
        description:
            'There are no interactive elements that “trap” input focus and prevent navigating away.',
    },
    'focus-indicator': {
        name: 'Focus indicator',
        description:
            'All interactive elements give a visible indication when they have input focus.',
    },
    'tab-order': {
        name: 'Tab order',
        description:
            "The tab order is consistent with the logical order that's communicated visually.",
    },
    'input-focus': {
        name: 'Input focus',
        description: 'Input focus does not move unexpectedly without the user initiating it.',
    },
};

export const requirementsList = Object.keys(requirements).map(requirementId => {
    return {
        ...(requirements[requirementId] as TabStopRequirementContent),
        id: requirementId,
    };
});
