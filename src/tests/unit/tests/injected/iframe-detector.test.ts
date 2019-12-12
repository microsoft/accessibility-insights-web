// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IframeDetector, QuerySelectable } from 'injected/iframe-detector';
import { IMock, Mock } from 'typemoq';

describe('IframeDetector', () => {
    let testSubject: IframeDetector;
    let documentMock: IMock<QuerySelectable>;

    beforeEach(() => {
        documentMock = Mock.ofType<QuerySelectable>();
        testSubject = new IframeDetector(documentMock.object);
    });

    test('there are iframes detected', () => {
        const elementStub = {} as HTMLIFrameElement;
        documentMock.setup(dm => dm.querySelector('iframe')).returns(() => elementStub);

        expect(testSubject.hasIframes()).toEqual(true);
    });

    test('there are no iframes detected', () => {
        documentMock.setup(dm => dm.querySelector('iframe')).returns(() => null);

        expect(testSubject.hasIframes()).toEqual(false);
    });
});
