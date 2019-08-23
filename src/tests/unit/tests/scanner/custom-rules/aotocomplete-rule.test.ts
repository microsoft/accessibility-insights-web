// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { GlobalMock, GlobalScope, IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { autocompleteRuleConfiguration } from '../../../../../scanner/custom-rules/autocomplete-rule';

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
        let fixture: HTMLElement;
        let dataSetterMock: IMock<(data) => void>;
        let axe;

        beforeEach(() => {
            fixture = document.createElement('div');
            fixture.setAttribute('id', 'test-fixture');
            document.body.appendChild(fixture);
            dataSetterMock = Mock.ofInstance(data => {});
            axe = Axe as any;
        });

        afterEach(() => {
            document.body.querySelector('#test-fixture').remove();
        });

        it.each(['text', 'search', 'url', 'tel', 'email', 'password', 'date', 'date-time', 'date-time-local', 'range', 'color'])(
            'validate input with type %s is collected by rule',
            (inputType: string) => {
                const node = document.createElement('input');
                node.setAttribute('type', inputType);
                fixture.appendChild(node);
                const expectedData = {
                    inputType,
                    autocomplete: null,
                };
                dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
                const result = autocompleteRuleConfiguration.checks[0].evaluate.call({ data: dataSetterMock.object }, node);
                expect(result).toBeTruthy();
            },
        );

        it.each(['on', 'off'])('should pick autocomplete value', (autocomplete: string) => {
            const node = document.createElement('input');
            node.setAttribute('type', 'text');
            node.setAttribute('autocomplete', autocomplete);
            fixture.appendChild(node);
            const expectedData = {
                inputType: 'text',
                autocomplete: null,
            };
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            const result = autocompleteRuleConfiguration.checks[0].evaluate.call({ data: dataSetterMock.object }, node);
            expect(result).toBeTruthy();
        });
    });
});
