// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { TabStopEvent } from 'common/types/tab-stop-event';

export const FocusOrderIssueCalculator = (
    previouslySeen: TabStopEvent[],
    newElements: TabStopEvent[],
    calculated: string[],
) => {
    let expectedElementIndex = previouslySeen.length;
    const totalNewTabbedElementLength = previouslySeen.length + newElements.length;
    let actualElemIndex = 0;
    while (
        expectedElementIndex < totalNewTabbedElementLength &&
        actualElemIndex < newElements.length
    ) {
        const expectedElem = calculated[expectedElementIndex];
        const actualElem = newElements[actualElemIndex];

        if (!areEqualElements(expectedElem, actualElem)) {
            console.log('Found an inconsistency');
        }

        expectedElementIndex++;
        actualElemIndex++;
    }
};

function areEqualElements(expectedElem: string, actualElem: TabStopEvent) {
    console.log('status: ' + (expectedElem === actualElem.html));
    return expectedElem === actualElem.html;
}
