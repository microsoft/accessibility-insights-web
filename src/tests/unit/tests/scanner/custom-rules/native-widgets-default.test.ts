// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, It, Mock, MockBehavior, Times } from 'typemoq';

import * as AxeUtils from '../../../../../scanner/axe-utils';
import {
    getNativeWidgetElementType,
    nativeWidgetsDefaultConfiguration,
    nativeWidgetSelector,
} from '../../../../../scanner/custom-rules/native-widgets-default';
import { createNodeStub, testNativeWidgetConfiguration } from '../helpers';

describe('native widgets default', () => {
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
            const getAccessibleDescriptionMock = GlobalMock.ofInstance(
                AxeUtils.getAccessibleDescription,
                'getAccessibleDescription',
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
                accessibleDescription: 'desc',
            };

            const nodeStub = createNodeStub(expectedData.element, {});

            dataSetterMock.setup(m => m(It.isValue(expectedData))).verifiable(Times.once());
            getAccessibleDescriptionMock
                .setup(m => m(nodeStub))
                .returns(v => expectedData.accessibleDescription);
            getAccessibleTextMock.setup(m => m(nodeStub)).returns(n => expectedData.accessibleName);

            let result;
            GlobalScope.using(getAccessibleDescriptionMock, getAccessibleTextMock).with(() => {
                result = nativeWidgetsDefaultConfiguration.checks[0].evaluate.call(
                    { data: dataSetterMock.object },
                    nodeStub,
                );
            });

            expect(result).toBe(true);
            dataSetterMock.verifyAll();
        });
    });

    describe('getNativeWidgetElementType', () => {
        it('returns button properly', () => {
            const node = createNodeStub('button', {});
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('button');
        });

        it('returns select properly', () => {
            const node = createNodeStub('select', {});
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('select');
        });

        it('returns textarea properly', () => {
            const node = createNodeStub('textarea', {});
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('textarea');
        });

        it('returns input with type properly', () => {
            const node = createNodeStub('input', {
                type: 'text',
            });
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('input type="text"');
        });

        it('returns input list properly', () => {
            const node = createNodeStub('input', {
                list: null,
            });
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBe('input list');
        });

        it('undefined when div', () => {
            const node = createNodeStub('div', {});
            const elementType = getNativeWidgetElementType(node);
            expect(elementType).toBeUndefined();
        });
    });
});
