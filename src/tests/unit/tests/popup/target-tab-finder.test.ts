// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { Tab } from 'common/itab';
import { UrlParser } from 'common/url-parser';
import { UrlValidator } from 'common/url-validator';
import { TargetTabFinder } from 'popup/target-tab-finder';
import { IMock, It, Mock } from 'typemoq';
import { Tabs } from 'webextension-polyfill-ts';

describe('TargetTabFinderTest', () => {
    let testSubject: TargetTabFinder;
    let windowStub: Window;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let urlParserMock: IMock<UrlParser>;
    let urlValidatorMock: IMock<UrlValidator>;
    const tabId: number = 15;
    let tabStub: Tab;

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
        };

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
            setupTabQueryCall();
        }

        setupIsSupportedCall(testCase.isUrlSupported);
        const targetTab = await testSubject.getTargetTab();

        expect(targetTab).toEqual({
            tab: tabStub,
            hasAccess: testCase.isUrlSupported,
        });
    });

    test('no tab found', async () => {
        setupGetTabIdParamFromUrl(tabId);
        browserAdapterMock
            .setup(b => b.getTab(tabId, It.isAny(), It.isAny()))
            .callback((id, cb, reject) => {
                reject();
            });
        setupIsSupportedCall(true);
        await testSubject
            .getTargetTab()
            .catch(error => expect(error).toEqual(`Tab with Id ${tabId} not found`));
    });

    function setupGetTabIdParamFromUrl(tabIdValue: number | null): void {
        urlParserMock
            .setup(p => p.getIntParam(windowStub.location.href, 'tabId'))
            .returns(() => tabIdValue);
    }

    function setupGetTabCall(): void {
        browserAdapterMock
            .setup(b => b.getTab(tabId, It.isAny(), It.isAny()))
            .callback((id, cb, reject) => {
                cb(tabStub);
            });
    }

    function setupTabQueryCall(): void {
        browserAdapterMock
            .setup(adapter => adapter.tabsQuery({ active: true, currentWindow: true }))
            .returns(() => Promise.resolve([tabStub as Tabs.Tab]));
    }

    function setupIsSupportedCall(isSupported: boolean): void {
        urlValidatorMock
            .setup(v => v.isSupportedUrl(tabStub.url))
            .returns(() => Promise.resolve(isSupported));
    }
});
