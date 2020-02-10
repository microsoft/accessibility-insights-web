// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { EnumHelper } from 'common/enum-helper';
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { CommandBar, CommandBarProps } from 'electron/views/automated-checks/components/command-bar';
import { mount, shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { Mock, MockBehavior, Times } from 'typemoq';

describe('CommandBar', () => {
    describe('renders', () => {
        it('while status is <Scanning>', () => {
            const props = {
                deps: { scanActionCreator: null },
                scanStoreData: {
                    status: ScanStatus.Scanning,
                },
            } as CommandBarProps;

            const rendered = shallow(<CommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });

        const notScanningStatuses = EnumHelper.getNumericValues<ScanStatus>(ScanStatus)
            .filter(status => status !== ScanStatus.Scanning)
            .map(status => ScanStatus[status]);

        it.each(notScanningStatuses)('while status is <%s>', status => {
            const props = {
                deps: { scanActionCreator: null },
                scanStoreData: {
                    status: ScanStatus[status],
                },
            } as CommandBarProps;

            const rendered = shallow(<CommandBar {...props} />);

            expect(rendered.getElement()).toMatchSnapshot();
        });
    });

    test('start over click', () => {
        const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;

        const port = 111;

        const scanActionCreatorMock = Mock.ofType<ScanActionCreator>(undefined, MockBehavior.Strict);
        scanActionCreatorMock.setup(creator => creator.scan(port)).verifiable(Times.once());

        const props = {
            deps: {
                scanActionCreator: scanActionCreatorMock.object,
            },
            deviceStoreData: {
                port,
            },
            scanStoreData: {
                status: ScanStatus.Default,
            },
        } as CommandBarProps;

        const rendered = mount(<CommandBar {...props} />);
        const button = rendered.find('button[name="Start over"]');

        button.simulate('click', eventStub);

        scanActionCreatorMock.verifyAll();
    });
});
