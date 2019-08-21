// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, Times } from 'typemoq';

import { frameTitleConfiguration } from '../../../../../scanner/custom-rules/frame-title';

describe('FrameTitleRule', () => {
    describe('selector and check', () => {
        it('should return the type and title of iframes', () => {
            const selector = frameTitleConfiguration.rule.selector;
            const pageTitle = 'This is my iframe title';

            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            const elementStub = {
                title: pageTitle,
                tagName: 'iframe',
            };
            const expectedData = {
                frameType: 'iframe',
                frameTitle: pageTitle,
            };

            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            expect(iframe.matches(selector)).toBeTruthy();
            frameTitleConfiguration.checks[0].evaluate.call({ data: dataSetterMock.object }, elementStub);
            dataSetterMock.verifyAll();
        });
    });

    describe('selector and check', () => {
        it('should return the type and title of frameset frames', () => {
            const selector = frameTitleConfiguration.rule.selector;
            const pageTitle = 'This is my frame title';

            const frameset = document.createElement('frameset');
            const frame = document.createElement('frame');
            frameset.appendChild(frame);
            document.body.appendChild(frameset);

            const elementStub = {
                title: pageTitle,
                tagName: 'frame',
            };
            const expectedData = {
                frameType: 'frame',
                frameTitle: pageTitle,
            };

            const dataSetterMock = Mock.ofInstance(data => {});
            dataSetterMock.setup(d => d(It.isValue(expectedData))).verifiable(Times.once());

            expect(frame.matches(selector)).toBeTruthy();
            frameTitleConfiguration.checks[0].evaluate.call({ data: dataSetterMock.object }, elementStub);
            dataSetterMock.verifyAll();
        });
    });
});
