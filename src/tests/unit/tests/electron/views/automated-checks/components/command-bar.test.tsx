// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanActionCreator } from 'electron/flux/action-creator/scan-action-creator';
import { CommandBar, CommandBarProps } from 'electron/views/automated-checks/components/command-bar';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { Mock, MockBehavior, Times } from 'typemoq';

describe('CommandBar', () => {
    test('render', () => {
        const props = { deps: { scanActionCreator: null } } as CommandBarProps;

        const rendered = shallow(<CommandBar {...props} />);

        expect(rendered.getElement()).toMatchSnapshot();
    });

    test('rescan click', () => {
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
        } as CommandBarProps;

        const rendered = shallow(<CommandBar {...props} />);
        const button = rendered.find('[text="Rescan"]');

        button.simulate('click', eventStub);

        scanActionCreatorMock.verifyAll();
    });
});
