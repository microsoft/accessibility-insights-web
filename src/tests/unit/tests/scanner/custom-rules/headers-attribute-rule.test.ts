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
        const headerId = 'header-id';
        const cellId = 'cell-id';
        testDom = TestDocumentCreator.createTestDocument(`
            <table>
                <tr>
                    <th id="${headerId}">header1</th>
                    <div id="not-a-header">not a header</div>
                </tr>
                <tr>
                    <td id="${cellId}">cell1</td>
                    <div id="not-a-cell">not a cell</div>
                </tr>
            </table>
        `);
        const nodes = Array.from(
            testDom.querySelectorAll(headersAttributeRuleConfiguration.rule.selector),
        );
        expect(nodes.length).toBe(2);
        const nodeIds = nodes.map(node => node.getAttribute('id'));
        expect(nodeIds).toContain(headerId);
        expect(nodeIds).toContain(cellId);
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
