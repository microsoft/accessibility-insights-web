// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { difference, map } from 'lodash';
import { GlobalMock, GlobalScope, It, Mock, MockBehavior, Times } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';
import {
    evaluateWidgetFunction,
    widgetFunctionConfiguration,
} from '../../../../../scanner/custom-rules/widget-function';
import { createNodeStub, testNativeWidgetConfiguration } from '../helpers';

declare let axe;

describe('widget function', () => {
    describe('verify widget function configs', () => {
        it('should have correct props', () => {
            testNativeWidgetConfiguration(
                'widget-function',
                'widget-function-collector',
                evaluateWidgetFunction,
                AxeUtils.hasCustomWidgetMarkup,
            );
        });
    });

    describe('evaluate', () => {
        it('sets correct data and returns true', () => {
            const getAttributesMock = GlobalMock.ofInstance(
                AxeUtils.getAttributes,
                'getAttributes',
                AxeUtils,
                MockBehavior.Strict,
            );
            const getAccessibleTextMock = GlobalMock.ofInstance(
                AxeUtils.getAccessibleText,
                'getAccessibleText',
                AxeUtils,
                MockBehavior.Strict,
            );

            const dataSetterMock = Mock.ofInstance(data => {});
            const expectedData = {
                element: 'button',
                accessibleName: 'name',
                role: 'role',
                ariaAttributes: {
                    'aria-property': 'value',
                },
                tabIndex: 'tabindex',
            };

            const nodeStub = createNodeStub(expectedData.element, {
                role: expectedData.role,
                tabindex: expectedData.tabIndex,
                'aria-property': 'value',
            });

            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());
            getAttributesMock
                .setup(m => m(It.isValue(nodeStub), It.isAny()))
                .returns(v => expectedData.ariaAttributes);
            getAccessibleTextMock.setup(m => m(nodeStub)).returns(n => expectedData.accessibleName);

            let result;
            GlobalScope.using(getAttributesMock, getAccessibleTextMock).with(() => {
                result = widgetFunctionConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    nodeStub,
                );
            });
            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        });
    });
});

describe('verify widget function data', () => {
    const getAccessibleTextMock = GlobalMock.ofInstance(
        AxeUtils.getAccessibleText,
        'getAccessibleText',
        AxeUtils,
        MockBehavior.Loose,
    );

    const fixture = createTestFixture('test_fixture', '');

    const allAriaAttributes = Object.getOwnPropertyNames(axe.commons.aria.lookupTable.attributes);
    const overlappingHTMLAttributes = map(allAriaAttributes, s => s.replace('aria-', ''));
    const allAttributes = allAriaAttributes.concat(overlappingHTMLAttributes);
    const expectedAttributes = [
        'aria-autocomplete',
        'aria-checked',
        'aria-expanded',
        'aria-level',
        'aria-modal',
        'aria-multiline',
        'aria-multiselectable',
        'aria-orientation',
        'aria-placeholder',
        'aria-pressed',
        'aria-readonly',
        'aria-required',
        'aria-selected',
        'aria-sort',
        'aria-valuemax',
        'aria-valuemin',
        'aria-valuenow',
        'aria-valuetext',
    ];
    const unexpectedAttributes = difference(allAttributes, expectedAttributes);

    const context = {
        _data: null,
        data: function (d): void {
            // tslint:disable-next-line:no-invalid-this
            this._data = d;
        },
    };

    beforeEach(() => {
        context._data = null;
    });

    expectedAttributes.forEach((attribute: string) => {
        it('expects attribute ' + attribute, () => {
            fixture.innerHTML =
                `
        <div id="myElement"
        ` +
                attribute +
                `="value" />
        `;

            const node = fixture.querySelector('#myElement');

            GlobalScope.using(getAccessibleTextMock).with(() => {
                widgetFunctionConfiguration.checks[0].evaluate.call(context, node);
            });
            expect(context._data.ariaAttributes[attribute]).toEqual('value');
        });
    }); // for expected attributes

    unexpectedAttributes.forEach((attribute: string) => {
        it('does not expect attribute ' + attribute, () => {
            fixture.innerHTML =
                `
        <div id="myElement"
        ` +
                attribute +
                `="value" />
        `;

            const node = fixture.querySelector('#myElement');

            GlobalScope.using(getAccessibleTextMock).with(() => {
                widgetFunctionConfiguration.checks[0].evaluate.call(context, node);
            });
            expect(context._data.ariaAttributes[attribute]).toBeUndefined();
        });
    }); // for unexpected attributes
});

function createTestFixture(id: string, content: string): HTMLDivElement {
    const testFixture: HTMLDivElement = document.createElement('div');
    testFixture.setAttribute('id', id);
    document.body.appendChild(testFixture);
    testFixture.innerHTML = content;
    return testFixture;
}
