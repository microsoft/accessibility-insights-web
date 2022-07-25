// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { withAxeSetup } from 'scanner/axe-utils';
import {
    getNativeWidgetElementType,
    nativeWidgetsDefaultConfiguration,
    nativeWidgetSelector,
} from 'scanner/custom-rules/native-widgets-default';
import { It, Mock, Times } from 'typemoq';
import { testNativeWidgetConfiguration } from '../helpers';

describe('native widgets default', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('verify native widgets default configs', () => {
        it('should have correct props', () => {
            testNativeWidgetConfiguration(
                'native-widgets-default',
                'native-widgets-default-collector',
            );
            expect(nativeWidgetSelector).toBe(
                'button, input[list], input[type]:not([type="hidden"]), select, textarea',
            );
        });
    });

    describe('verify createNativeWidgetConfiguration', () => {
        it('creates expected configuration shape when default evaluate and matches are both overwritten', () => {
            testNativeWidgetConfiguration(
                'rule id',
                'check id',
                node => {
                    return false;
                },
                node => {
                    return true;
                },
            );
        });

        it('creates expected configuration shape when default evaluate is overwritten', () => {
            testNativeWidgetConfiguration('rule id', 'check id', node => {
                return false;
            });
        });

        it('creates expected configuration shape when neither default evaluate nor matches is overwritten', () => {
            testNativeWidgetConfiguration('rule id', 'check id');
        });
    });

    describe('evaluate', () => {
        it('sets correct data and returns true', () => {
            const dataSetterMock = Mock.ofInstance(data => {});
            const expectedData = {
                element: 'button',
                accessibleName: 'name',
                accessibleDescription: 'desc',
            };

            document.body.innerHTML = `
                <button id="element-under-test" aria-describedby="descriptor">name</button>
                <span id="descriptor">desc</span>
            `;
            const node = document.body.querySelector('#element-under-test');

            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());

            const result = withAxeSetup(() =>
                nativeWidgetsDefaultConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    node,
                ),
            );

            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        });
    });

    describe('getNativeWidgetElementType', () => {
        it('returns button properly', () => {
            const node = document.createElement('button');
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('button');
        });

        it('returns select properly', () => {
            const node = document.createElement('select');
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('select');
        });

        it('returns textarea properly', () => {
            const node = document.createElement('textarea');
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('textarea');
        });

        it('returns input with type properly', () => {
            const node = document.createElement('input');
            node.setAttribute('type', 'text');
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('input type="text"');
        });

        it('returns input list properly', () => {
            const node = document.createElement('input');
            node.setAttribute('list', '');
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('input list');
        });

        it('undefined when div', () => {
            const node = document.createElement('div');
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBeUndefined();
        });
    });
});
