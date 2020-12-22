// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResultsWithFrameLevel } from 'injected/frameCommunicators/html-element-axe-results-helper';

export const getCellAndHeaderElementsFromResult = (
    result: AxeResultsWithFrameLevel,
    dom: Document,
) => {
    const elements = Array.from(dom.querySelectorAll(result.target[result.targetIndex]));
    const allElements = [...elements];
    elements.forEach(element => {
        const headers = element.getAttribute('headers')?.split(' ');
        if (headers) {
            headers.forEach(headerId => {
                const headerElement = dom.querySelector(`#${headerId}`);
                if (headerElement) {
                    allElements.push(headerElement);
                }
            });
        }
    });

    return allElements;
};
