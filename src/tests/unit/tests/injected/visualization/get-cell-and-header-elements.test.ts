// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { AxeResultsWithFrameLevel } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { getCellAndHeaderElementsFromResult } from 'injected/visualization/get-cell-and-header-elements';
import { TestDocumentCreator } from 'tests/unit/common/test-document-creator';

describe(getCellAndHeaderElementsFromResult, () => {
    let testDom: Document;
    const singleHeaderCellId = 'cell-with-one-header';
    const multiHeaderCellId = 'cell-with-two-headers';
    const noHeadersCellId = 'cell-with-no-headers';
    const emptyHeadersCellId = 'cell-with-empty-headers';
    const headerId1 = 'header1';
    const headerId2 = 'header2';
    const headerId3 = 'header3';

    beforeEach(() => {
        testDom = TestDocumentCreator.createTestDocument(`
        <table>
            <tr>
                <th id="${headerId1}">header1</th>
                <th id="${headerId2}">header2</th>
                <th id="${headerId3}">header3</th>
            </tr>
            <tr>
                <td id="${singleHeaderCellId}" headers="${headerId1}">cell1</td>
                <td id="${multiHeaderCellId}" headers="${headerId2} ${headerId3}">cell2</td>
                <td id="${noHeadersCellId}">cell3</td>
                <td id="${emptyHeadersCellId}">cell4</td>
            </tr>
        </table>
        `);
    });

    it.each([
        ['cell has one header', singleHeaderCellId, [headerId1]],
        ['cell has two headers', multiHeaderCellId, [headerId2, headerId3]],
        ['cell has no headers', noHeadersCellId, []],
        ['cell has an empty headers attribute', emptyHeadersCellId, []],
    ])('%s', (_, targetCellId, headerIds) => {
        const result = createResult(targetCellId);

        const elements = getCellAndHeaderElementsFromResult(result, testDom);

        expect(elements.length).toBe(1 + headerIds.length);

        const elementIds = elements.map(element => element.getAttribute('id'));
        expect(elementIds).toContain(targetCellId);
        headerIds.forEach(id => expect(elementIds).toContain(id));
    });

    function createResult(targetId: string): AxeResultsWithFrameLevel {
        return {
            ruleResults: {},
            target: [`#${targetId}`],
            targetIndex: 0,
        };
    }
});
