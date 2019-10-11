// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { TitleBar, TitleBarProps } from 'electron/views/automated-checks/components/title-bar';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';

describe('TitleBar', () => {
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
    let browserWindowMock: IMock<BrowserWindow>;
    let windowStateActionCreator: IMock<WindowStateActionCreator>;
    let windowFrameActionCreator: IMock<WindowFrameActionCreator>;
    let windowStateStoreData: WindowStateStoreData;

    beforeEach(() => {
        browserWindowMock = Mock.ofType<BrowserWindow>(undefined, MockBehavior.Strict);
        windowStateActionCreator = Mock.ofType<WindowStateActionCreator>(undefined, MockBehavior.Strict);
        windowFrameActionCreator = Mock.ofType<WindowFrameActionCreator>(undefined, MockBehavior.Strict);
        windowStateStoreData = { routeId: 'resultsView', currentWindowState: 'maximized' };
    });

    it('renders', () => {
        const props = {
            deps: {
                currentWindow: Mock.ofType(BrowserWindow).object,
                windowStateActionCreator: Mock.ofType(WindowStateActionCreator).object,
                windowFrameActionCreator: Mock.ofType(WindowFrameActionCreator).object,
            },
            windowStateStoreData,
        } as TitleBarProps;

        const wrapper = shallow(<TitleBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    const setupVerifiableWindowMaximizeAction = () => {
        windowStateStoreData.currentWindowState = 'customSize';

        windowFrameActionCreator.setup(creator => creator.maximize()).verifiable(Times.once());
    };

    const setupVerifiableWindowRestoreAction = () => {
        windowStateStoreData.currentWindowState = 'maximized';
        windowFrameActionCreator.setup(creator => creator.restore()).verifiable(Times.once());
    };

    const setupVerifiableWindowMinimizeCall = () => {
        windowFrameActionCreator.setup(creator => creator.minimize()).verifiable(Times.once());
    };

    const setupVerifiableWindowCloseActionCall = () => {
        windowFrameActionCreator.setup(creator => creator.close()).verifiable(Times.once());
    };

    const buttonsAndSetups = [
        { id: '#maximize-button', setupMock: setupVerifiableWindowMaximizeAction }, // maximize validation
        { id: '#maximize-button', setupMock: setupVerifiableWindowRestoreAction }, // restore validation
        { id: '#minimize-button', setupMock: setupVerifiableWindowMinimizeCall },
        { id: '#close-button', setupMock: setupVerifiableWindowCloseActionCall },
    ];

    test.each(buttonsAndSetups)('test button %s', args => {
        args.setupMock();
        const props = {
            deps: {
                currentWindow: browserWindowMock.object,
                windowStateActionCreator: windowStateActionCreator.object,
                windowFrameActionCreator: windowFrameActionCreator.object,
            },
            windowStateStoreData,
        } as TitleBarProps;

        const rendered = shallow(<TitleBar {...props} />);
        const renderedElement = rendered.getElement();
        const renderedIcons = shallow(<div>{renderedElement.props.actionableIcons}</div>);

        const button = renderedIcons.find(args.id);

        button.simulate('click', eventStub);

        browserWindowMock.verifyAll();
        windowStateActionCreator.verifyAll();
    });
});
