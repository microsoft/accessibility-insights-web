// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, Times } from 'typemoq';

import { headingConfiguration } from '../../../../../scanner/custom-rules/heading-rule';

describe('HeadingRule', () => {
    describe('evaluateCodedHeadings for heading with aria level', () => {
        it('should return aria heading level', () => {
            const elementStub = {
                innerText: 'H5',
                getAttribute: attr => '5',
            };
            const expectedData = {
                headingLevel: 5,
                headingText: 'H5',
            };
            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            headingConfiguration.checks[0].evaluate.call(
                { data: dataSetterMock.object },
                elementStub,
            );
            dataSetterMock.verifyAll();
        });
    });

    describe('evaluateCodedHeadings for heading with coded level', () => {
        it('should return coded heading level', () => {
            const elementStub = {
                innerText: 'H2',
                getAttribute: attr => null,
                tagName: {
                    match: regex => ['H', '2'],
                },
            };
            const expectedData = {
                headingLevel: 2,
                headingText: 'H2',
            };
            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());
            headingConfiguration.checks[0].evaluate.call(
                { data: dataSetterMock.object },
                elementStub,
            );
            dataSetterMock.verifyAll();
        });
    });

    describe('selector', () => {
        it('should return true for all elements with h tag', () => {
            const selector = headingConfiguration.rule.selector;
            const h1 = document.createElement('h1');
            const h2 = document.createElement('h2');
            const h3 = document.createElement('h3');
            const h4 = document.createElement('h4');
            const h5 = document.createElement('h5');
            const h6 = document.createElement('h6');
            const headingRoleDiv = document.createElement('div');
            headingRoleDiv.setAttribute('role', 'heading');
            const nonHeadingElement = document.createElement('div');
            expect(h1.matches(selector)).toBeTruthy();
            expect(h2.matches(selector)).toBeTruthy();
            expect(h3.matches(selector)).toBeTruthy();
            expect(h4.matches(selector)).toBeTruthy();
            expect(h5.matches(selector)).toBeTruthy();
            expect(h6.matches(selector)).toBeTruthy();
            expect(headingRoleDiv.matches(selector)).toBeTruthy();
            expect(nonHeadingElement.matches(selector)).toBeFalsy();
        });
    });
});
