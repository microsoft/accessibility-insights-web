// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { difference } from 'lodash';
import { hasCustomWidgetMarkup, withAxeSetup } from 'scanner/axe-utils';
import {
    evaluateWidgetFunction,
    widgetFunctionConfiguration,
} from 'scanner/custom-rules/widget-function';
import { It, Mock, Times } from 'typemoq';
import { testNativeWidgetConfiguration } from '../helpers';

declare let axe;

describe('widget function', () => {
    describe('verify widget function configs', () => {
        it('should have correct props', () => {
            testNativeWidgetConfiguration(
                'widget-function',
                'widget-function-collector',
                evaluateWidgetFunction,
                hasCustomWidgetMarkup,
            );
        });
    });

    describe('evaluate', () => {
        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('sets correct data and returns true', () => {
            const dataSetterMock = Mock.ofInstance(data => {});
            const expectedData = {
                element: 'button',
                accessibleName: 'name',
                role: 'role',
                ariaAttributes: {
                    'aria-valuetext': 'valuetext',
                },
                tabIndex: 'tabindex',
            };

            document.body.innerHTML = `
                <button id="element-under-test" role="role" tabindex="tabindex" aria-valuetext="valuetext">name</button>
            `;
            const node = document.body.querySelector('#element-under-test');

            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());

            const result = withAxeSetup(() =>
                widgetFunctionConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    node,
                ),
            );

            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        });

        const applicableAriaAttributes = [
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

        it.each(applicableAriaAttributes)('extracts attribute %s', attribute => {
            const dataSetterMock = Mock.ofInstance(data => {});
            const expectedData = {
                ariaAttributes: {
                    [attribute]: 'value',
                },
            };

            document.body.innerHTML = `
                <button id="element-under-test" role="custom" ${attribute}="value">name</button>
            `;
            const node = document.body.querySelector('#element-under-test');

            dataSetterMock.setup(m => m(It.isObjectWith(expectedData))).verifiable(Times.once());

            withAxeSetup(() =>
                widgetFunctionConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    node,
                ),
            );

            dataSetterMock.verifyAll();
        });

        const allAriaAttributes = Object.getOwnPropertyNames(
            axe.commons.aria.lookupTable.attributes,
        );
        const overlappingHTMLAttributes = allAriaAttributes.map(s => s.replace('aria-', ''));
        const allAttributes = allAriaAttributes.concat(overlappingHTMLAttributes);
        const nonapplicableAttributes = difference(allAttributes, applicableAriaAttributes);

        it.each(nonapplicableAttributes)('does not extract attribute %s', attribute => {
            const dataSetterMock = Mock.ofInstance(data => {});
            const expectedData = {
                ariaAttributes: {},
            };

            document.body.innerHTML = `
                <button id="element-under-test" role="custom" ${attribute}="value">name</button>
            `;
            const node = document.body.querySelector('#element-under-test');

            dataSetterMock.setup(m => m(It.isObjectWith(expectedData))).verifiable(Times.once());

            withAxeSetup(() =>
                widgetFunctionConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    node,
                ),
            );

            dataSetterMock.verifyAll();
        });
    });
});
