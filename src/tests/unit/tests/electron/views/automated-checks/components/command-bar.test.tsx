// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { EnumHelper } from 'common/enum-helper';
import { FileURLProvider } from 'common/file-url-provider';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import {
    CommandBar,
    CommandBarProps,
    commandButtonRefreshId,
} from 'electron/views/automated-checks/components/command-bar';
import { mount, shallow } from 'enzyme';
import * as React from 'react';
import { getAutomationIdSelector } from 'tests/common/get-automation-id-selector';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

describe('CommandBar', () => {
    let fileURLProviderMock: IMock<FileURLProvider>;
    let reportHTMLStub: string;
    let fileURLStub: string;
    let featureFlagStoreDataStub: FeatureFlagStoreData;

    beforeEach(() => {
        fileURLProviderMock = Mock.ofType(FileURLProvider);
        reportHTMLStub = ' some report html ';
        fileURLStub = ' some url ';
        featureFlagStoreDataStub = {
            somefeatureflag: true,
        };
        prepareFileURLProviderMock();
    });

    describe('renders', () => {
        it('while status is <Scanning>', () => {
            const props = {
                deps: { scanActionCreator: null, fileURLProvider: fileURLProviderMock.object },
                scanStoreData: {
                    status: ScanStatus.Scanning,
                },
                reportHTML: reportHTMLStub,
                featureFlagStoreData: featureFlagStoreDataStub,
            } as CommandBarProps;

            const rendered = shallow(<CommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        const notScanningStatuses = EnumHelper.getNumericValues<ScanStatus>(ScanStatus)
            .filter(status => status !== ScanStatus.Scanning)
            .map(status => ScanStatus[status]);

        it.each(notScanningStatuses)('while status is <%s>', status => {
            const props = {
                deps: { scanActionCreator: null, fileURLProvider: fileURLProviderMock.object },
                scanStoreData: {
                    status: ScanStatus[status],
                },
                reportHTML: reportHTMLStub,
                featureFlagStoreData: featureFlagStoreDataStub,
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
                    fileURLProvider: fileURLProviderMock.object,
                },
                deviceStoreData: {
                    port,
                },
                scanStoreData: {
                    status: ScanStatus.Default,
                },
                reportHTML: reportHTMLStub,
                featureFlagStoreData: featureFlagStoreDataStub,
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
                    fileURLProvider: fileURLProviderMock.object,
                },
                scanStoreData: {
                    status: ScanStatus.Default,
                },
                reportHTML: reportHTMLStub,
                featureFlagStoreData: featureFlagStoreDataStub,
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

    function prepareFileURLProviderMock(): void {
        fileURLProviderMock
            .setup(provider => provider.provideURL([reportHTMLStub], 'text/html'))
            .returns(() => fileURLStub);
    }
});
