// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock, Times } from 'typemoq';

import { ChromeAdapter } from '../../../../background/browser-adapters/browser-adapter';
import { Logger } from '../../../../common/logging/logger';
import { PopupInitializer } from '../../../../popup/popup-initializer';
import { TargetTabFinder, TargetTabInfo } from '../../../../popup/target-tab-finder';

describe('PopupInitializerTests', () => {
    let targetTabStub: TargetTabInfo;
    let browserAdapterMock: IMock<ChromeAdapter>;
    let targetTabFinderMock: IMock<TargetTabFinder>;
    let loggerMock: IMock<Logger>;

    beforeEach(() => {
        targetTabStub = {
            tab: {
                id: 1,
                url: 'url',
            },
            hasAccess: true,
        };

        browserAdapterMock = Mock.ofType(ChromeAdapter);
        targetTabFinderMock = Mock.ofType(TargetTabFinder);
        loggerMock = Mock.ofType<Logger>();
    });

    test('initializePopup: valid browser', async () => {
        const initializePopupMock = Mock.ofInstance(result => {});
        const validUserAgent: IUAParser.IBrowser = {
            name: 'Chrome',
        } as IUAParser.IBrowser;

        targetTabFinderMock
            .setup(b => b.getTargetTab())
            .returns(() => Promise.resolve(targetTabStub))
            .verifiable();

        initializePopupMock.setup(i => i(It.isAny())).verifiable();
        const testSubject: PopupInitializer = new PopupInitializer(
            browserAdapterMock.object,
            targetTabFinderMock.object,
            validUserAgent,
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
        const invalidUserAgent: IUAParser.IBrowser = {
            name: 'Edge',
        } as IUAParser.IBrowser;

        targetTabFinderMock
            .setup(b => b.getTargetTab())
            .returns(() => Promise.resolve(targetTabStub))
            .verifiable(Times.never());

        useIncompatibleBrowserRendererMock.setup(i => i(It.isAny())).verifiable();
        const testSubject: PopupInitializer = new PopupInitializer(
            browserAdapterMock.object,
            targetTabFinderMock.object,
            invalidUserAgent,
            loggerMock.object,
        );
        (testSubject as any).useIncompatibleBrowserRenderer = useIncompatibleBrowserRendererMock.object;

        const promise = await testSubject.initialize();

        targetTabFinderMock.verifyAll();
        expect(promise).toBeUndefined();
    });
});
