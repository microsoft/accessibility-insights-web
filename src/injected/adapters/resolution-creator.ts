// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DictionaryStringTo } from 'types/common-types';
import { AxeNodeResult } from '../../scanner/iruleresults';

export type ResolutionCreator = (data: ResolutionCreatorData) => DictionaryStringTo<any>;

export interface ResolutionCreatorData {
    id: string;
    nodeResult: AxeNodeResult;
}

export const getFixResolution: ResolutionCreator = (data: ResolutionCreatorData) => {
    return {
        'how-to-fix-web': {
            any: data.nodeResult.any.map(checkResult => checkResult.message),
            none: data.nodeResult.none.map(checkResult => checkResult.message),
            all: data.nodeResult.all.map(checkResult => checkResult.message),
        },
    };
};

export const getCheckResolution: ResolutionCreator = (data: ResolutionCreatorData) => {
    return {
        'how-to-check-web': getHowToCheckTest(data.id),
    };
};

const getHowToCheckTest = (ruleID: string) => {
    let checkText: string;
    switch (ruleID) {
        case 'aria-input-field-name': {
            checkText =
                "Inspect the element using the Accessibility pane in the browser Developer Tools to verify that the field's accessible name is complete without its associated <label>.";
            break;
        }
        case 'color-contrast': {
            checkText =
                "If the text is intended to be invisible, it passes.\nIf the text is intended to be visible, use Accessibility Insights for Windows (or the Colour Contrast Analyser if you're testing on a Mac) to manually verify that it has sufficient contrast compared to the background. If the background is an image or gradient, test an area where contrast appears to be lowest.\nFor detailed test instructions, see Assessment > Adaptable content > Contrast.";
            break;
        }
        case 'link-in-text-block': {
            checkText =
                "Manually verify that the link text EITHER has a contrast ratio of at least 3:1 compared to surrounding text OR has a distinct visual style (such as underlined, bolded, or italicized). To measure contrast, use Accessibility Insights for Windows (or the Colour Contrast Analyser if you're testing on a Mac).";
            break;
        }
        case 'th-has-data-cells': {
            checkText =
                'Examine the header cell in the context of the table to verify that it has no data cells.';
            break;
        }
        default: {
            checkText =
                "No 'How to check' guidance has been supplied.  Please contact the Accessibility Insights team.";
            break;
        }
    }
    return checkText;
};
