// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as AxeUtils from 'scanner/axe-utils';
import { cuesConfiguration, evaluateCues } from 'scanner/custom-rules/cues-rule';
import { It, Mock, Times } from 'typemoq';

import { testNativeWidgetConfiguration } from '../helpers';

describe('cues rule', () => {
    describe('verify cues configs', () => {
        it('should have correct props', () => {
            testNativeWidgetConfiguration('cues', 'cues-collector', evaluateCues);
        });
    });

    describe('evaluate', () => {
        let testButton: HTMLButtonElement;
        let testButtonAccessibleName: string;
        beforeEach(() => {
            testButton = document.createElement('button');
            testButtonAccessibleName = 'test-button-name';
            testButton.setAttribute('aria-label', testButtonAccessibleName);
            document.body.appendChild(testButton);
        });
        afterEach(() => {
            document.body.removeChild(testButton);
        });

        it('sets correct html cues and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: testButtonAccessibleName,
                htmlCues: {
                    readonly: 'true',
                    disabled: 'false',
                    required: 'true',
                },
                ariaCues: {},
            };

            testCuesEvaluateWithData(expectedData, expectedData.htmlCues);
        });

        it('sets correct aria cues and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: testButtonAccessibleName,
                ariaCues: {
                    'aria-readonly': 'false',
                    'aria-disabled': 'false',
                    'aria-required': 'true',
                },
                htmlCues: {},
            };

            testCuesEvaluateWithData(expectedData, expectedData.ariaCues);
        });

        it('maintains whitespace in aria cues and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: testButtonAccessibleName,
                ariaCues: {
                    'aria-readonly': '  ',
                    'aria-disabled': '  ',
                    'aria-required': '  ',
                },
                htmlCues: {},
            };

            testCuesEvaluateWithData(expectedData, expectedData.ariaCues);
        });

        it('treats empty aria values as null and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: testButtonAccessibleName,
                ariaCues: {
                    'aria-readonly': null,
                    'aria-disabled': null,
                    'aria-required': null,
                },
                htmlCues: {},
            };

            testCuesEvaluateWithData(expectedData, {
                'aria-readonly': '',
                'aria-disabled': '',
                'aria-required': '',
            });
        });

        it('treats empty html values as null and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: testButtonAccessibleName,
                ariaCues: {},
                htmlCues: {
                    readonly: null,
                    disabled: null,
                    required: null,
                },
            };

            testCuesEvaluateWithData(expectedData, {
                readonly: '',
                disabled: '',
                required: '',
            });
        });

        function testCuesEvaluateWithData(expectedData, nodeAttrs): void {
            for (const attrName in nodeAttrs) {
                testButton.setAttribute(attrName, nodeAttrs[attrName]);
            }

            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());

            const result = AxeUtils.withAxeSetup(() =>
                cuesConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    testButton,
                ),
            );

            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        }
    });
});
