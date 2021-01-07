// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AxeResultsWithFrameLevel } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { isEmpty } from 'lodash';

export const getCellAndHeaderElementsFromResult = (
    result: AxeResultsWithFrameLevel,
    dom: Document,
) => {
    const elements = Array.from(dom.querySelectorAll(result.target[result.targetIndex]));
    const allElements = [...elements];
    elements.forEach(element => {
        const headersAttr = element.getAttribute('headers');
        if (isEmpty(headersAttr)) {
            return;
        }
        const headers = headersAttr.split(' ');
        headers.forEach(headerId => {
            const headerElement = dom.getElementById(headerId);
            if (headerElement) {
                allElements.push(headerElement);
            }
        });
    });

    return allElements;
};
