// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { UnifiedResolution } from 'common/types/store-data/unified-data-interface';
import { ResolutionType } from 'injected/adapters/scan-results-to-unified-results';
import { AxeNodeResult } from '../../scanner/iruleresults';

export type ResolutionCreator = (
    resolution: ResolutionType,
    data: ResolutionCreatorData,
) => UnifiedResolution;

interface ResolutionCreatorData {
    id: string;
    nodeResult: AxeNodeResult;
}

// split into two, one for fix and one for change.  Pass both into unified result sender, change up report & mocks, main window initializer too
export const getResolution: ResolutionCreator = (
    resolution: ResolutionType,
    data: ResolutionCreatorData,
) => {
    if (resolution === 'how-to-check') {
        return {
            howToFixSummary: data.failureSummary,
            'how-to-check-web': getHowToCheckTest(data.ruleID),
        };
    } else {
        return {
            howToFixSummary: data.failureSummary,
            'how-to-fix-web': {
                any: data.howToFix.oneOf,
                none: data.howToFix.none,
                all: data.howToFix.all,
            },
        };
    }
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
                "If the text is intended to be invisible, it passes.\nIf the text is intended to be visible, use Accessibility Insights for Windows (or the Colour Contrast Analyser if you're testing on a Mac) to manually verify that it has sufficient contrast compared to the background. If the background is an image or gradient, test an area where contrast appears to be lowest.\nFor detailed test instructions, see Assessment > Text legibility > Contrast.";
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
