// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { EnumHelper } from 'common/enum-helper';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanMetadata, ToolData } from 'common/types/store-data/unified-data-interface';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import {
    CommandBar,
    CommandBarDeps,
    CommandBarProps,
    commandButtonRefreshId,
} from 'electron/views/results/components/command-bar';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { ReportGenerator } from 'reports/report-generator';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('CommandBar', () => {
    let featureFlagStoreDataStub: FeatureFlagStoreData;
    let cardsViewDataStub: CardsViewModel;
    let reportGeneratorMock: IMock<ReportGenerator>;
    let scanMetadataStub: ScanMetadata;
    let scanDateStub: Date;

    beforeEach(() => {
        featureFlagStoreDataStub = {
            somefeatureflag: true,
        };
        cardsViewDataStub = {} as CardsViewModel;
        scanDateStub = new Date(0);
        scanMetadataStub = {
            timespan: {
                scanComplete: scanDateStub,
            },
            toolData: {} as ToolData,
            targetAppInfo: {
                name: 'scan target name',
            },
        };
        reportGeneratorMock = Mock.ofType(ReportGenerator);
    });

    describe('renders', () => {
        it('while status is <Scanning>', () => {
            const props = {
                deps: {
                    scanActionCreator: null,
                    reportGenerator: reportGeneratorMock.object,
                } as CommandBarDeps,
                scanStoreData: {
                    status: ScanStatus.Scanning,
                },
                cardsViewData: cardsViewDataStub,
                featureFlagStoreData: featureFlagStoreDataStub,
                scanMetadata: scanMetadataStub,
            } as CommandBarProps;

            const rendered = shallow(<CommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        it('does not create report export when scan metadata is null', () => {
            const props = {
                deps: {
                    scanActionCreator: null,
                    reportGenerator: reportGeneratorMock.object,
                } as CommandBarDeps,
                scanStoreData: {
                    status: ScanStatus.Scanning,
                },
                cardsViewData: cardsViewDataStub,
                featureFlagStoreData: featureFlagStoreDataStub,
                scanMetadata: null,
            } as CommandBarProps;
            const rendered = shallow(<CommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        const notScanningStatuses = EnumHelper.getNumericValues<ScanStatus>(ScanStatus)
            .filter(status => status !== ScanStatus.Scanning)
            .map(status => ScanStatus[status]);

        it.each(notScanningStatuses)('while status is <%s>', status => {
            const props = {
                deps: {
                    scanActionCreator: null,
                    reportGenerator: reportGeneratorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus[status],
                },
                cardsViewData: cardsViewDataStub,
                featureFlagStoreData: featureFlagStoreDataStub,
                scanMetadata: scanMetadataStub,
            } as CommandBarProps;

            const rendered = shallow(<CommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    describe('user interaction', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent() as any;

        it('handles start over click', () => {
            const port = 111;

            const scanActionCreatorMock = Mock.ofType<ScanActionCreator>(
                undefined,
                MockBehavior.Strict,
            );
            scanActionCreatorMock.setup(creator => creator.scan(port)).verifiable(Times.once());

            const props = {
                deps: {
                    scanActionCreator: scanActionCreatorMock.object,
                    reportGenerator: reportGeneratorMock.object,
                },
                scanPort: port,
                scanStoreData: {
                    status: ScanStatus.Default,
                },
                cardsViewData: cardsViewDataStub,
                featureFlagStoreData: featureFlagStoreDataStub,
                scanMetadata: scanMetadataStub,
            } as CommandBarProps;

            const rendered = mount(<CommandBar {...props} />);

            const buttonSelector = `button${getAutomationIdSelector(commandButtonRefreshId)}`;
            const button = rendered.find(buttonSelector);

            button.simulate('click', eventStub);

            scanActionCreatorMock.verifyAll();
        });

        it('handles settings click', () => {
            const dropdownClickHandlerMock = Mock.ofType<DropdownClickHandler>();

            const props = {
                deps: {
                    dropdownClickHandler: dropdownClickHandlerMock.object,
                    reportGenerator: reportGeneratorMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Default,
                },
                cardsViewData: cardsViewDataStub,
                featureFlagStoreData: featureFlagStoreDataStub,
                scanMetadata: scanMetadataStub,
            } as CommandBarProps;

            const rendered = mount(<CommandBar {...props} />);
            const button = rendered.find('button[aria-label="settings"]');

            button.simulate('click', eventStub);

            dropdownClickHandlerMock.verify(
                handler => handler.openSettingsPanelHandler(It.isAny()),
                Times.once(),
            );
        });
    });
});
