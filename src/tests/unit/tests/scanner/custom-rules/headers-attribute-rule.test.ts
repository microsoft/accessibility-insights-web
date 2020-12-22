// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { headersAttributeRuleConfiguration } from 'scanner/custom-rules/headers-attribute-rule';
import { TestDocumentCreator } from '../../../common/test-document-creator';

describe('HeadersAttributeRule', () => {
    let testDom: Document;
    const headersAttributeCheckId = 'headers-attribute';

    it('should have correct props', () => {
        expect(headersAttributeRuleConfiguration.rule.id).toBe(headersAttributeCheckId);
        expect(headersAttributeRuleConfiguration.rule.any[0]).toBe(headersAttributeCheckId);
        expect(headersAttributeRuleConfiguration.rule.any.length).toBe(1);
        expect(headersAttributeRuleConfiguration.checks[0].id).toBe(headersAttributeCheckId);
    });

    it('selects table cells and headers', () => {
        const expectedIds = ['header1', 'header2', 'header3', 'cell1', 'cell2'];
        testDom = TestDocumentCreator.createTestDocument(`
            <table>
                <tr>
                    <th id="${expectedIds[0]}">header1</th>
                    <div role="columnheader" id="${expectedIds[1]}">header2</div>
                    <div role="rowheader" id="${expectedIds[2]}">header3</div>
                    <div id="not-a-header">not a header</div>
                </tr>
                <tr>
                    <td id="${expectedIds[3]}">cell1</td>
                    <div role="cell" id="${expectedIds[4]}">cell2</div>
                    <div id="not-a-cell">not a cell</div>
                </tr>
            </table>
        `);
        const nodes = testDom.querySelectorAll(headersAttributeRuleConfiguration.rule.selector);
        expect(nodes.length).toBe(expectedIds.length);
        nodes.forEach(node => {
            const nodeId = node.getAttribute('id');
            expect(expectedIds.indexOf(nodeId)).not.toEqual(-1);
        });
    });

    describe('matches', () => {
        const cellWithHeadersId = 'cell-with-headers';
        const cellWithoutHeadersId = 'cell-without-headers';
        const headerId = 'h1';
        beforeEach(() => {
            testDom = TestDocumentCreator.createTestDocument(`
            <table>
                <tr>
                    <th id="${headerId}">header</th>
                    <td id="${cellWithHeadersId}" headers="${headerId}">cell1</td>
                    <td id="${cellWithoutHeadersId}">cell2</td>
                </tr>
            </table>
            `);
        });

        it('Matches element with headers attribute', () => {
            const element = testDom.querySelector(`#${cellWithHeadersId}`);

            expect(headersAttributeRuleConfiguration.rule.matches(element, null)).toBeTruthy();
        });

        it('does not match elements without headers attribute', () => {
            const cellElement = testDom.querySelector(`#${cellWithoutHeadersId}`);
            const headerElement = testDom.querySelector(`#${headerId}`);

            expect(headersAttributeRuleConfiguration.rule.matches(cellElement, null)).toBeFalsy();
            expect(headersAttributeRuleConfiguration.rule.matches(headerElement, null)).toBeFalsy();
        });
    });
});
