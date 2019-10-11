// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { WindowStateActionCreator } from 'electron/flux/action-creator/window-state-action-creator';
import { TitleBar, TitleBarProps } from 'electron/views/automated-checks/components/title-bar';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';

describe('TitleBar', () => {
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
    let browserWindowMock: IMock<BrowserWindow>;
    let windowStateActionCreator: IMock<WindowStateActionCreator>;

    beforeEach(() => {
        browserWindowMock = Mock.ofType<BrowserWindow>(undefined, MockBehavior.Strict);
        windowStateActionCreator = Mock.ofType<WindowStateActionCreator>(undefined, MockBehavior.Strict);
    });

    it('renders', () => {
        const props = {
            deps: {
                currentWindow: null,
                windowStateActionCreator: null,
            },
        } as TitleBarProps;

        const wrapper = shallow(<TitleBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    const setupBrowserMockForMaximizeRestore = () => {
        windowStateActionCreator
            .setup(creator => creator.setWindowState({ currentWindowState: 'restoredOrMaximized' }))
            .verifiable(Times.once());
    };

    const setupBrowserMockForMinimize = () => {
        windowStateActionCreator.setup(creator => creator.setWindowState({ currentWindowState: 'minimized' })).verifiable(Times.once());
    };

    const setupBrowserMockForClose = () => {
        browserWindowMock.setup(creator => creator.close()).verifiable(Times.once());
    };

    const buttonsAndSetups = [
        { id: '#maximize-button', setupMock: setupBrowserMockForMaximizeRestore },
        { id: '#minimize-button', setupMock: setupBrowserMockForMinimize },
        { id: '#close-button', setupMock: setupBrowserMockForClose },
    ];

    test.each(buttonsAndSetups)('test button %s', args => {
        args.setupMock();
        const props = {
            deps: {
                currentWindow: browserWindowMock.object,
                windowStateActionCreator: windowStateActionCreator.object,
            },
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
