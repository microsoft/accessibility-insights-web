// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, Times } from 'typemoq';

import { pageConfiguration } from '../../../../scanner/custom-rules/page-title';

describe('PageTitleRule', () => {
    describe('selector and check', () => {
        it('should return the title of the page', () => {
            const selector = pageConfiguration.rule.selector;
            const check = pageConfiguration.checks[0];
            const pageTitle = 'This is my page title';

            document.title = pageTitle;

            const expectedData = {
                pageTitle: pageTitle,
            };
            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            expect(document.documentElement.matches(selector)).toBeTruthy();
            check.evaluate.call({ data: dataSetterMock.object }, null);
            dataSetterMock.verifyAll();
        });
    });

    describe('rule check', () => {
        it('should not have set data if the page does not have title', () => {
            const selector = pageConfiguration.rule.selector;
            const check = pageConfiguration.checks[0];

            document.title = '';

            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(d => d({})).verifiable(Times.never());

            expect(document.documentElement.matches(selector)).toBeTruthy();
            check.evaluate.call({ data: dataSetterMock.object }, null);
            dataSetterMock.verifyAll();
        });
    });
});
