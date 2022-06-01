// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { WebExtensionBrowserAdapter } from 'common/browser-adapters/webextension-browser-adapter';
import { IMock, It, Mock, Times } from 'typemoq';

import { IsSupportedBrowser } from '../../../../common/is-supported-browser';
import { Logger } from '../../../../common/logging/logger';
import { PopupInitializer } from '../../../../popup/popup-initializer';
import { TargetTabFinder, TargetTabInfo } from '../../../../popup/target-tab-finder';

describe('PopupInitializerTests', () => {
    let targetTabStub: TargetTabInfo;
    let browserAdapterMock: IMock<WebExtensionBrowserAdapter>;
    let targetTabFinderMock: IMock<TargetTabFinder>;
    let isSupportedBrowserMock: IMock<IsSupportedBrowser>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        targetTabStub = {
            tab: {
                id: 1,
                url: 'url',
            },
            hasAccess: true,
        };

        browserAdapterMock = Mock.ofType<WebExtensionBrowserAdapter>();
        targetTabFinderMock = Mock.ofType(TargetTabFinder);
        loggerMock = Mock.ofType<Logger>();
        isSupportedBrowserMock = Mock.ofType<IsSupportedBrowser>();
    });

    test('initializePopup: valid browser', async () => {
        const initializePopupMock = Mock.ofInstance(result => {});
        isSupportedBrowserMock.setup(isValid => isValid()).returns(() => true);

        targetTabFinderMock
            .setup(finder => finder.getTargetTab())
            .returns(() => Promise.resolve(targetTabStub))
            .verifiable();

        initializePopupMock.setup(init => init(It.isAny())).verifiable();
        const testSubject: PopupInitializer = new PopupInitializer(
            browserAdapterMock.object,
            targetTabFinderMock.object,
            isSupportedBrowserMock.object,
            loggerMock.object,
        );
        (testSubject as any).initializePopup = initializePopupMock.object;

        await testSubject.initialize();

        targetTabFinderMock.verifyAll();
        initializePopupMock.verifyAll();
        browserAdapterMock.verifyAll();
    });

    test('initializePopup: invalid browser', async () => {
        const useIncompatibleBrowserRendererMock = Mock.ofInstance(result => {});
        isSupportedBrowserMock.setup(isValid => isValid()).returns(() => false);

        targetTabFinderMock
            .setup(finder => finder.getTargetTab())
            .returns(() => Promise.resolve(targetTabStub))
            .verifiable(Times.never());

        useIncompatibleBrowserRendererMock.setup(renderer => renderer(It.isAny())).verifiable();
        const testSubject: PopupInitializer = new PopupInitializer(
            browserAdapterMock.object,
            targetTabFinderMock.object,
            isSupportedBrowserMock.object,
            loggerMock.object,
        );
        (testSubject as any).useIncompatibleBrowserRenderer =
            useIncompatibleBrowserRendererMock.object;

        const promise = await testSubject.initialize();

        targetTabFinderMock.verifyAll();
        expect(promise).toBeUndefined();
    });
});
