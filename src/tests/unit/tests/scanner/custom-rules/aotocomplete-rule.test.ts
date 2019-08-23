// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';
import { autocompleteRuleConfiguration } from '../../../../../scanner/custom-rules/autocomplete-rule';
import { TestDocumentCreator } from './../../../common/test-document-creator';

describe('aotocompleteRule', () => {
    describe('verify autocomplete rule configs', () => {
        it('should have correct props', () => {
            expect(autocompleteRuleConfiguration.rule.id).toBe('autocomplete');
            expect(autocompleteRuleConfiguration.rule.selector).toEqual(
                'input[type="text"],\
input[type="search"],\
input[type="url"],\
input[type="tel"],\
input[type="email"],\
input[type="password"],\
input[type="date"],\
input[type="date-time"],\
input[type="date-time-local"],\
input[type="range"],\
input[type="color"]',
            );
            expect(autocompleteRuleConfiguration.rule.any[0]).toBe('autocomplete');
            expect(autocompleteRuleConfiguration.rule.any.length).toBe(1);
            expect(autocompleteRuleConfiguration.checks[0].id).toBe('autocomplete');
        });
    });

    describe('verify evaluate', () => {
        let dataSetterMock: IMock<(data) => void>;
        let testDom: Document;

        beforeEach(() => {
            dataSetterMock = Mock.ofInstance(data => {});
        });

        it.each(['text', 'search', 'url', 'tel', 'email', 'password', 'date', 'date-time', 'date-time-local', 'range', 'color'])(
            'validate input with type %s is collected by rule',
            (inputType: string) => {
                testDom = TestDocumentCreator.createTestDocument(`
                    <input type="${inputType}" id="test-node">
                `);
                const node = testDom.querySelector('#test-node');
                const expectedData = {
                    inputType,
                    autocomplete: null,
                };
                dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
                const result = autocompleteRuleConfiguration.checks[0].evaluate.call({ data: dataSetterMock.object }, node);
                expect(result).toBe(true);
            },
        );

        it.each(['on', 'off'])('should pick autocomplete value', (autocomplete: string) => {
            testDom = TestDocumentCreator.createTestDocument(`
                    <input type="text" autocomplete="${autocomplete}" id="test-node">
                `);
            const node = testDom.querySelector('#test-node');
            const expectedData = {
                inputType: 'text',
                autocomplete,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            const result = autocompleteRuleConfiguration.checks[0].evaluate.call({ data: dataSetterMock.object }, node);
            expect(result).toBe(true);
        });
    });
});
