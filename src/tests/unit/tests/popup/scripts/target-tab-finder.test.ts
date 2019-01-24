// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, It, Mock } from 'typemoq';

import { BrowserAdapter } from '../../../../../background/browser-adapter';
import { ITab } from '../../../../../common/itab';
import { UrlParser } from '../../../../../common/url-parser';
import { UrlValidator } from '../../../../../common/url-validator';
import { TargetTabFinder } from '../../../../../popup/scripts/target-tab-finder';

describe('TargetTabFinderTest', () => {
    let testSubject: TargetTabFinder;
    let windowStub: Window;
    let browserAdapterMock: IMock<BrowserAdapter>;
    let urlParserMock: IMock<UrlParser>;
    let urlValidatorMock: IMock<UrlValidator>;
    const tabId: number = 15;
    let tabStub: ITab;

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

        testSubject = new TargetTabFinder(windowStub, browserAdapterMock.object, urlValidatorMock.object, urlParserMock.object);
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

    test.each(testCases)('get target tab info - %o', async (testCase: TestCase) => {
        if (testCase.hasTabIdInUrl) {
            setupGetTabIdParamFromUrl(tabId);
            setupGetTabCall();
        } else {
            setupGetTabIdParamFromUrl(NaN);
            setupTabQueryCall();
        }

        setupIsSupportedCall(testCase.isUrlSupported);
        const targetTab = await testSubject.getTargetTab();

        expect(targetTab).toEqual({
            tab: tabStub,
            hasAccess: testCase.isUrlSupported,
        });
    });

    function setupGetTabIdParamFromUrl(tabIdValue: number) {
        urlParserMock.setup(p => p.getIntParam(windowStub.location.href, 'tabId')).returns(() => tabIdValue);
    }

    function setupGetTabCall() {
        browserAdapterMock
            .setup(b => b.getTab(tabId, It.isAny()))
            .callback((id, cb) => {
                cb(tabStub);
            });
    }

    function setupTabQueryCall() {
        browserAdapterMock
            .setup(b =>
                b.tabsQuery(
                    {
                        active: true,
                        currentWindow: true,
                    },
                    It.isAny(),
                ),
            )
            .callback((id, cb) => {
                cb([tabStub]);
            });
    }

    function setupIsSupportedCall(isSupported: boolean) {
        urlValidatorMock.setup(v => v.isSupportedUrl(tabStub.url, browserAdapterMock.object)).returns(() => Promise.resolve(isSupported));
    }
});
