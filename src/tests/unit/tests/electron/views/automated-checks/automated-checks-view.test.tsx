// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    CardSelectionViewData,
    getCardSelectionViewData,
    ResultsHighlightStatus,
} from 'common/get-card-selection-view-data';
import { IsResultHighlightUnavailable } from 'common/is-result-highlight-unavailable';
import { getCardViewData } from 'common/rule-based-view-model-provider';
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
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import {
    AutomatedChecksView,
    AutomatedChecksViewProps,
} from 'electron/views/automated-checks/automated-checks-view';
import { DeviceDisconnectedPopup } from 'electron/views/device-disconnected-popup/device-disconnected-popup';
import { ScreenshotViewModel } from 'electron/views/screenshot/screenshot-view-model';
import { screenshotViewModelProvider } from 'electron/views/screenshot/screenshot-view-model-provider';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('AutomatedChecksView', () => {
    let isResultHighlightUnavailableStub: IsResultHighlightUnavailable;
    let props: AutomatedChecksViewProps;
    let screenshotViewModelProviderMock = Mock.ofInstance(screenshotViewModelProvider);
    let getCardSelectionViewDataMock = Mock.ofInstance(getCardSelectionViewData);
    let getUnifiedRuleResultsMock = Mock.ofInstance(getCardViewData);

    beforeEach(() => {
        isResultHighlightUnavailableStub = () => null;
        const cardSelectionStoreData = {} as CardSelectionStoreData;
        const resultsHighlightStatus = {
            'highlighted-uid-1': 'visible',
            'not-highlighted-uid-1': 'hidden',
        } as ResultsHighlightStatus;
        const timeStampStub = 'test timestamp';
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

        screenshotViewModelProviderMock = Mock.ofInstance(screenshotViewModelProvider);
        getCardSelectionViewDataMock = Mock.ofInstance(getCardSelectionViewData);
        getUnifiedRuleResultsMock = Mock.ofInstance(getCardViewData);

        props = {
            deps: {
                scanActionCreator: Mock.ofType(ScanActionCreator).object,
                getCardsViewData: getUnifiedRuleResultsMock.object,
                getCardSelectionViewData: getCardSelectionViewDataMock.object,
                screenshotViewModelProvider: screenshotViewModelProviderMock.object,
                isResultHighlightUnavailable: isResultHighlightUnavailableStub,
            },
            cardSelectionStoreData,
            androidSetupStoreData: {},
            scanStoreData: {},
            userConfigurationStoreData: {
                isFirstTime: false,
            },
            detailsViewStoreData: {
                currentPanel: {},
            },
            unifiedScanResultStoreData,
        } as AutomatedChecksViewProps;

        getCardSelectionViewDataMock
            .setup(getData =>
                getData(
                    cardSelectionStoreData,
                    unifiedScanResultStoreData,
                    isResultHighlightUnavailableStub,
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
    });

    const scanStatuses = [
        undefined,
        ScanStatus[ScanStatus.Scanning],
        ScanStatus[ScanStatus.Failed],
        ScanStatus[ScanStatus.Completed],
    ];

    it.each(scanStatuses)('when status scan <%s>', scanStatusName => {
        props.scanStoreData.status = ScanStatus[scanStatusName];

        const wrapped = shallow(<AutomatedChecksView {...props} />);

        expect(wrapped.getElement()).toMatchSnapshot();

        getCardSelectionViewDataMock.verifyAll();
        getUnifiedRuleResultsMock.verifyAll();
        screenshotViewModelProviderMock.verifyAll();
    });

    it('triggers scan when first mounted', () => {
        const scanPort = 11111;

        const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
        scanActionCreatorMock.setup(creator => creator.scan(scanPort)).verifiable(Times.once());
        props.deps.scanActionCreator = scanActionCreatorMock.object;
        props.androidSetupStoreData.scanPort = scanPort;

        shallow(<AutomatedChecksView {...props} />);

        scanActionCreatorMock.verifyAll();
    });

    describe('DeviceDisconnectedPopup event handlers', () => {
        it('onRescanDevice', () => {
            const scanPort = 11111;

            const scanActionCreatorMock = Mock.ofType(ScanActionCreator);
            props.deps.scanActionCreator = scanActionCreatorMock.object;
            props.scanStoreData.status = ScanStatus.Failed;
            props.androidSetupStoreData.scanPort = scanPort;
            const wrapped = shallow(<AutomatedChecksView {...props} />);

            scanActionCreatorMock.reset(); // this mock is used on componentDidMount, which is not in the scope of this unit test

            wrapped.find(DeviceDisconnectedPopup).prop('onRescanDevice')();

            scanActionCreatorMock.verify(creator => creator.scan(scanPort), Times.once());
        });
    });
});
