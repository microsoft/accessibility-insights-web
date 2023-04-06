// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { UrlParser } from 'common/url-parser';
import { UrlValidator } from 'common/url-validator';
import { TargetTabFinder } from 'popup/target-tab-finder';
import { IMock, Mock } from 'typemoq';
import type { Tabs } from 'webextension-polyfill';

describe('TargetTabFinderTest', () => {
    let testSubject: TargetTabFinder;
    let windowStub: Window;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let urlParserMock: IMock<UrlParser>;
    let urlValidatorMock: IMock<UrlValidator>;
    const tabId: number = 15;
    let tabStub: Tabs.Tab;

    beforeEach(() => {
        windowStub = {
            location: {
                href: 'some url',
            },
        } as any;

        tabStub = {
            id: tabId,
            title: 'some title',
            url: 'target page url',
        } as Tabs.Tab;

        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        urlParserMock = Mock.ofType(UrlParser);
        urlValidatorMock = Mock.ofType(UrlValidator);

        testSubject = new TargetTabFinder(
            windowStub,
            browserAdapterMock.object,
            urlValidatorMock.object,
            urlParserMock.object,
        );
    });

    type TestCase = {
        hasTabIdInUrl: boolean;
        isUrlSupported: boolean;
    };

    const testCases = [
        {
            hasTabIdInUrl: true,
            isUrlSupported: true,
        },
        {
            hasTabIdInUrl: true,
            isUrlSupported: false,
        },
        {
            hasTabIdInUrl: false,
            isUrlSupported: true,
        },
        {
            hasTabIdInUrl: false,
            isUrlSupported: false,
        },
    ];

    test.each(testCases)('get target tab info - %p', async (testCase: TestCase) => {
        if (testCase.hasTabIdInUrl) {
            setupGetTabIdParamFromUrl(tabId);
            setupGetTabCall();
        } else {
            setupGetTabIdParamFromUrl(null);
            setupTabQueryCall([tabStub]);
        }

        setupIsSupportedCall(testCase.isUrlSupported);
        const targetTab = await testSubject.getTargetTab();

        expect(targetTab).toEqual({
            tab: tabStub,
            hasAccess: testCase.isUrlSupported,
        });
    });

    it('throws an error if tabId URL parameter is not found', async () => {
        const testError = new Error('Tab not found');
        setupGetTabIdParamFromUrl(tabId);
        browserAdapterMock
            .setup(b => b.getTab(tabId))
            .returns(async () => {
                throw testError;
            });

        await expect(testSubject.getTargetTab()).rejects.toThrowError(testError);
    });

    it('throws an error there is neither a tabId URL parameter nor an active tab', async () => {
        setupTabQueryCall([]);

        await expect(testSubject.getTargetTab()).rejects.toThrowError(
            'No active tabs found for current window',
        );
    });

    function setupGetTabIdParamFromUrl(tabIdValue: number | null): void {
        urlParserMock
            .setup(p => p.getIntParam(windowStub.location.href, 'tabId'))
            .returns(() => tabIdValue);
    }

    function setupGetTabCall(): void {
        browserAdapterMock.setup(b => b.getTab(tabId)).returns(async () => tabStub as Tabs.Tab);
    }

    function setupTabQueryCall(returnValue: Tabs.Tab[]): void {
        browserAdapterMock
            .setup(adapter => adapter.tabsQuery({ active: true, currentWindow: true }))
            .returns(() => Promise.resolve(returnValue));
    }

    function setupIsSupportedCall(isSupported: boolean): void {
        urlValidatorMock
            .setup(v => v.isSupportedUrl(tabStub.url))
            .returns(() => Promise.resolve(isSupported));
    }
});
