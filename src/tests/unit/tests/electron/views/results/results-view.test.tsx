// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DateProvider } from 'common/date-provider';
import {
    CardSelectionViewData,
    getCardSelectionViewData,
    ResultsHighlightStatus,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { getCardViewData } from 'common/rule-based-view-model-provider';
import { ResultsFilter } from 'common/types/results-filter';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import {
    CardRuleResult,
    CardRuleResultsByStatus,
    CardsViewModel,
} from 'common/types/store-data/card-view-model';
import {
    PlatformData,
    ToolData,
    UnifiedResult,
    UnifiedRule,
    UnifiedScanResultStoreData,
} from 'common/types/store-data/unified-data-interface';
import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { DeviceConnectionStatus } from 'electron/flux/types/device-connection-status';
import { LeftNavStoreData } from 'electron/flux/types/left-nav-store-data';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { TabStopsStoreData } from 'electron/flux/types/tab-stops-store-data';
import { ContentPageInfo, ContentPagesInfo } from 'electron/types/content-page-info';
import { LeftNavItemKey } from 'electron/types/left-nav-item-key';
import { TitleBar } from 'electron/views/results/components/title-bar';
import { ResultsView, ResultsViewProps } from 'electron/views/results/results-view';
import { TestView } from 'electron/views/results/test-view';
import { ScreenshotView } from 'electron/views/screenshot/screenshot-view';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { screenshotViewModelProvider } from 'electron/views/screenshot/screenshot-view-model-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('ResultsView', () => {
    const initialSelectedKey: LeftNavItemKey = 'automated-checks';
    let isResultHighlightUnavailableStub: IsResultHighlightUnavailable;
    let props: ResultsViewProps;
    let screenshotViewModelProviderMock = Mock.ofInstance(screenshotViewModelProvider);
    let getCardSelectionViewDataMock = Mock.ofInstance(getCardSelectionViewData);
    let getUnifiedRuleResultsMock = Mock.ofInstance(getCardViewData);
    let getDateFromTimestampMock: IMock<(timestamp: string) => Date>;
    let scanPort: number;
    const resultsFilter: ResultsFilter = _ => true;

    beforeEach(() => {
        scanPort = 11111;
        isResultHighlightUnavailableStub = () => null;
        const cardSelectionStoreData = {} as CardSelectionStoreData;
        const resultsHighlightStatus = {
            'highlighted-uid-1': 'visible',
            'not-highlighted-uid-1': 'hidden',
        } as ResultsHighlightStatus;

        const timeStampStub = 'test timestamp';
        const scanDate = new Date(Date.UTC(0, 1, 2, 3));
        const toolDataStub: ToolData = {
            applicationProperties: { name: 'some app' },
        } as ToolData;

        const cardSelectionViewDataStub = {
            resultsHighlightStatus: resultsHighlightStatus,
        } as CardSelectionViewData;

        const rulesStub = [{ description: 'test-rule-description' } as UnifiedRule];
        const resultsStub = [
            { uid: 'highlighted-uid-1' },
            { uid: 'not-highlighted-uid-1' },
        ] as UnifiedResult[];

        const unifiedScanResultStoreData: UnifiedScanResultStoreData = {
            targetAppInfo: {
                name: 'test-target-app-name',
            },
            rules: rulesStub,
            results: resultsStub,
            toolInfo: toolDataStub,
            timestamp: timeStampStub,
            platformInfo: {
                deviceName: 'TEST DEVICE',
            } as PlatformData,
        };

        const leftNavStoreData: LeftNavStoreData = {
            selectedKey: initialSelectedKey,
            leftNavVisible: true,
        };

        const tabStopsStoreData: TabStopsStoreData = {
            focusTracking: true,
        };

        const ruleResultsByStatusStub = {
            fail: [{ id: 'test-fail-id' } as CardRuleResult],
        } as CardRuleResultsByStatus;

        const cardsViewData = {
            cards: ruleResultsByStatusStub,
        } as CardsViewModel;

        const screenshotViewModelStub = {
            screenshotData: {
                base64PngData: 'this should appear in snapshotted ScreenshotView props',
            },
        } as ScreenshotViewModel;

        const contentPagesInfo = createContentPagesInfo();

        screenshotViewModelProviderMock = Mock.ofInstance(screenshotViewModelProvider);
        getCardSelectionViewDataMock = Mock.ofInstance(getCardSelectionViewData);
        getUnifiedRuleResultsMock = Mock.ofInstance(getCardViewData);
        getDateFromTimestampMock = Mock.ofInstance(DateProvider.getDateFromTimestamp);

        props = {
            deps: {
                scanActionCreator: Mock.ofType(ScanActionCreator).object,
                leftNavActionCreator: Mock.ofType(LeftNavActionCreator).object,
                getCardsViewData: getUnifiedRuleResultsMock.object,
                getCardSelectionViewData: getCardSelectionViewDataMock.object,
                screenshotViewModelProvider: screenshotViewModelProviderMock.object,
                isResultHighlightUnavailable: isResultHighlightUnavailableStub,
                contentPagesInfo: contentPagesInfo,
                getDateFromTimestamp: getDateFromTimestampMock.object,
            },
            cardSelectionStoreData,
            androidSetupStoreData: {
                scanPort: scanPort,
                selectedDevice: {
                    id: 'some-id',
                },
            },
            scanStoreData: {},
            deviceConnectionStoreData: { status: DeviceConnectionStatus.Unknown },
            userConfigurationStoreData: {
                isFirstTime: false,
            },
            detailsViewStoreData: {
                currentPanel: {},
            },
            unifiedScanResultStoreData,
            leftNavStoreData,
            tabStopsStoreData,
        } as ResultsViewProps;

        getCardSelectionViewDataMock
            .setup(getData =>
                getData(
                    cardSelectionStoreData,
                    unifiedScanResultStoreData,
                    isResultHighlightUnavailableStub,
                    resultsFilter,
                ),
            )
            .returns(() => cardSelectionViewDataStub)
            .verifiable(Times.once());

        getUnifiedRuleResultsMock
            .setup(getter => getter(rulesStub, resultsStub, cardSelectionViewDataStub))
            .returns(() => cardsViewData)
            .verifiable(Times.once());

        screenshotViewModelProviderMock
            .setup(provider => provider(unifiedScanResultStoreData, ['highlighted-uid-1']))
            .returns(() => screenshotViewModelStub)
            .verifiable(Times.once());
        getDateFromTimestampMock.setup(gd => gd(timeStampStub)).returns(() => scanDate);
    });

    const createContentPagesInfo = (): ContentPagesInfo => {
        const leftNavItemKeys: LeftNavItemKey[] = ['automated-checks', 'needs-review'];
        const contentPagesInfo = {} as ContentPagesInfo;
        leftNavItemKeys.forEach(
            key =>
                (contentPagesInfo[key] = {
                    title: `test-${key}-title`,
                    description: <>test {key} description</>,
                    resultsFilter: resultsFilter,
                    visualHelperSection: ScreenshotView,
                } as ContentPageInfo),
        );

        return contentPagesInfo;
    };

    const scanStatuses = [
        undefined,
        ScanStatus[ScanStatus.Scanning],
        ScanStatus[ScanStatus.Failed],
        ScanStatus[ScanStatus.Completed],
    ];

    it.each(scanStatuses)('when status scan <%s>', scanStatusName => {
        props.scanStoreData.status = ScanStatus[scanStatusName];

        props.deviceConnectionStoreData.status =
            props.scanStoreData.status === ScanStatus.Failed
                ? DeviceConnectionStatus.Disconnected
                : DeviceConnectionStatus.Connected;

        const wrapped = shallow(<ResultsView {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();
        getCardSelectionViewDataMock.verifyAll();
        getUnifiedRuleResultsMock.verifyAll();
        screenshotViewModelProviderMock.verifyAll();
    });

    it('triggers scan when first mounted', () => {
        const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
        scanActionCreatorMock.setup(creator => creator.scan(scanPort)).verifiable(Times.once());
        props.deps.scanActionCreator = scanActionCreatorMock.object;
        props.androidSetupStoreData.scanPort = scanPort;

        shallow(<ResultsView {...props} />);

        scanActionCreatorMock.verifyAll();
    });

    describe('right content panel info', () => {
        it('renders with default/initial value', () => {
            const expectedTitle = `test-${initialSelectedKey}-title`;

            const wrapped = shallow(<ResultsView {...props} />);

            expect(wrapped.find(TitleBar).props().pageTitle).toEqual(expectedTitle);
            expect(wrapped.find(TestView).getElement()).toMatchSnapshot();
        });

        it('changes when left nav selected key changes', () => {
            const changedSelectedKey = 'needs-review';
            const expectedTitle = `test-${changedSelectedKey}-title`;

            props.leftNavStoreData.selectedKey = changedSelectedKey;

            const wrapped = shallow(<ResultsView {...props} />);

            expect(wrapped.find(TitleBar).props().pageTitle).toEqual(expectedTitle);
            expect(wrapped.find(TestView).getElement()).toMatchSnapshot();
        });
    });
});
