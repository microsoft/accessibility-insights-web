// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';

import { ChromeAdapter } from '../../../../../background/browser-adapter';
import { PopupInitializer } from '../../../../../popup/scripts/popup-initializer';
import { TargetTabFinder, TargetTabInfo } from '../../../../../popup/scripts/target-tab-finder';

describe('PopupInitializerTests', () => {
    test('initializePopup', async done => {
        const targetTabStub: TargetTabInfo = {
            tab: {
                id: 1,
                url: 'url',
            },
            hasAccess: true,
        };

        const browserAdapterMock = Mock.ofType(ChromeAdapter);
        const targetTabFinder = Mock.ofType(TargetTabFinder);
        targetTabFinder
            .setup(b => b.getTargetTab())
            .returns(() => Promise.resolve(targetTabStub))
            .verifiable();

        const initializePopupMock = Mock.ofInstance(result => { });
        initializePopupMock.setup(i => i(It.isAny())).verifiable();
        const testSubject: PopupInitializer = new PopupInitializer(browserAdapterMock.object, targetTabFinder.object);
        (testSubject as any).initializePopup = initializePopupMock.object;

        const promise = testSubject.initialize();
        promise.then(result => {
            targetTabFinder.verifyAll();
            initializePopupMock.verifyAll();
            browserAdapterMock.verifyAll();
            done();
        });
    });
});

