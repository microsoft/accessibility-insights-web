// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { headerRuleConfiguration } from '../../../../../scanner/custom-rules/header-rule';
import { TestDocumentCreator } from '../../../common/test-document-creator';

describe('HeaderRule', () => {
    let testDom: Document;
    describe('selector', () => {
        it('should have correct props', () => {
            expect(headerRuleConfiguration.rule.id).toBe('collect-headers');
            expect(headerRuleConfiguration.rule.selector).toEqual(
                'th,[role=columnheader],[role=rowheader]',
            );
            expect(headerRuleConfiguration.rule.any[0]).toBe('collect-headers');
            expect(headerRuleConfiguration.rule.any.length).toBe(1);
            expect(headerRuleConfiguration.checks[0].id).toBe('collect-headers');
        });

        describe('validate selector', () => {
            it('should only pick header elements', () => {
                testDom = TestDocumentCreator.createTestDocument(`
                <table>
                    <tr>
                        <th id="node-1">header1</th>
                        <div role="columnheader" id="node-2">header2</div>
                        <div role="rowheader" id="node-3">header3</div>
                        <div id="node-4"> not a header </div>
                    </tr>
                </table>
                `);
                const nodes = testDom.querySelectorAll(headerRuleConfiguration.rule.selector);
                expect(nodes.length).toBe(3);
                const headerIds = [
                    nodes[0].getAttribute('id'),
                    nodes[1].getAttribute('id'),
                    nodes[2].getAttribute('id'),
                ];
                expect(headerIds.indexOf('node-1')).not.toEqual(-1);
                expect(headerIds.indexOf('node-2')).not.toEqual(-1);
                expect(headerIds.indexOf('node-3')).not.toEqual(-1);
            });
        });
    });
});
