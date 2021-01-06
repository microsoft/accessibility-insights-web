// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentVisualizationInstance } from 'injected/frameCommunicators/html-element-axe-results-helper';
import { FailureInstanceFormatter } from 'injected/visualization/failure-instance-formatter';
import { TableHeadersAttributeFormatter } from 'injected/visualization/table-headers-formatter';

describe(TableHeadersAttributeFormatter, () => {
    let testSubject: TableHeadersAttributeFormatter;

    beforeEach(() => {
        testSubject = new TableHeadersAttributeFormatter();
    });

    describe('getDrawerConfiguration', () => {
        test.each`
            elementType | headers      | role    | id
            ${'td'}     | ${'headers'} | ${null} | ${null}
            ${'td'}     | ${'headers'} | ${null} | ${'id'}
            ${'th'}     | ${null}      | ${null} | ${'id'}
            ${'th'}     | ${'headers'} | ${null} | ${'id'}
        `(
            '- $elementType headers=$headers role=$role id=$id',
            ({ elementType, headers, role, id }) => {
                const testElement = getTestElement(elementType, headers, role, id);

                const config = testSubject.getDrawerConfiguration(testElement, null);

                expect(config).toMatchSnapshot();
            },
        );

        test('no failure box', () => {
            const testElement = getTestElement('td', 'headers', null, null);

            const config = testSubject.getDrawerConfiguration(testElement, null);

            expect(config.failureBoxConfig).toBeNull();
        });

        test('with failure box', () => {
            const data = { isFailure: true } as AssessmentVisualizationInstance;
            const testElement = getTestElement('td', 'headers', null, null);

            const config = testSubject.getDrawerConfiguration(testElement, data);

            expect(config.failureBoxConfig).toEqual(FailureInstanceFormatter.failureBoxConfig);
        });
    });

    test('verify getDialogRenderer', () => {
        expect(testSubject.getDialogRenderer()).toBeNull();
    });

    function getTestElement(
        elementType: string,
        headers: string | null,
        role: string | null,
        id: string | null,
    ): HTMLElement {
        const element = document.createElement(elementType);
        if (headers) {
            element.setAttribute('headers', headers);
        }
        if (role) {
            element.setAttribute('role', role);
        }
        if (id) {
            element.setAttribute('id', id);
        }

        return element;
    }
});
