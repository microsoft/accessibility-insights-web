// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, It, Mock, MockBehavior, Times } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';
import { cuesConfiguration, evaluateCues } from '../../../../../scanner/custom-rules/cues-rule';
import { createNodeStub, testNativeWidgetConfiguration } from '../helpers';

describe('cues rule', () => {
    describe('verify cues configs', () => {
        it('should have correct props', () => {
            testNativeWidgetConfiguration('cues', 'cues-collector', evaluateCues);
        });
    });

    describe('evaluate', () => {
        it('sets correct html cues and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: 'name',
                htmlCues: {
                    readonly: null,
                    disabled: null,
                    required: null,
                },
                ariaCues: {},
            };

            testCuesEvaluateWithData(expectedData, expectedData.htmlCues);
        });

        it('sets correct aria cues and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: 'name',
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
                accessibleName: 'name',
                ariaCues: {
                    'aria-readonly': '  ',
                    'aria-disabled': '  ',
                    'aria-required': '  ',
                },
                htmlCues: {},
            };

            testCuesEvaluateWithData(expectedData, expectedData.ariaCues);
        });

        it('treats empty values as null and returns true', () => {
            const expectedData = {
                element: 'button',
                accessibleName: 'name',
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
    });
});

function testCuesEvaluateWithData(expectedData, nodeData): void {
    const nodeStub = createNodeStub(expectedData.element, nodeData);
    const getAccessibleTextMock = GlobalMock.ofInstance(
        AxeUtils.getAccessibleText,
        'getAccessibleText',
        AxeUtils,
        MockBehavior.Strict,
    );

    const dataSetterMock = Mock.ofInstance(data => {});

    dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());
    getAccessibleTextMock.setup(m => m(nodeStub)).returns(n => expectedData.accessibleName);

    let result;
    GlobalScope.using(getAccessibleTextMock).with(() => {
        result = cuesConfiguration.checks[0].evaluate.call(
            { data: dataSetterMock.object },
            nodeStub,
        );
    });

    expect(result).toBe(true);
    dataSetterMock.verifyAll();
}
