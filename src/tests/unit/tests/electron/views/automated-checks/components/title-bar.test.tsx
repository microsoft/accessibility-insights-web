// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserWindow } from 'electron';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

import { TitleBar, TitleBarProps } from 'electron/views/automated-checks/components/title-bar';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';

describe('TitleBar', () => {
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
    let browserWindowMock: IMock<BrowserWindow>;

    beforeEach(() => {
        browserWindowMock = Mock.ofType<BrowserWindow>(undefined, MockBehavior.Strict);
    });

    it('renders', () => {
        const props = {
            deps: {
                currentWindow: null,
            },
        } as TitleBarProps;

        const wrapper = shallow(<TitleBar {...props} />);

        expect(wrapper.getElement()).toMatchSnapshot();
    });

    const setupBrowserMockForMaximize = () => {
        browserWindowMock
            .setup(creator => creator.isMaximized())
            .returns(() => false)
            .verifiable(Times.once());
        browserWindowMock.setup(creator => creator.maximize()).verifiable(Times.once());
    };

    const setupBrowserMockForRestore = () => {
        browserWindowMock
            .setup(creator => creator.isMaximized())
            .returns(() => true)
            .verifiable(Times.once());
        browserWindowMock.setup(creator => creator.restore()).verifiable(Times.once());
    };

    const setupBrowserMockForMinimize = () => {
        browserWindowMock.setup(creator => creator.minimize()).verifiable(Times.once());
    };

    const setupBrowserMockForClose = () => {
        browserWindowMock.setup(creator => creator.close()).verifiable(Times.once());
    };

    const buttonsAndSetups = [
        { id: '#maximize-button', setupMock: setupBrowserMockForMaximize },
        { id: '#minimize-button', setupMock: setupBrowserMockForMinimize },
        { id: '#close-button', setupMock: setupBrowserMockForClose },
        { id: '#maximize-button', setupMock: setupBrowserMockForRestore },
    ];

    test.each(buttonsAndSetups)('test button %s', args => {
        args.setupMock();
        const props = {
            deps: {
                currentWindow: browserWindowMock.object,
            },
        } as TitleBarProps;

        const rendered = shallow(<TitleBar {...props} />);
        const button = rendered.find(args.id);

        button.simulate('click', eventStub);

        browserWindowMock.verifyAll();
    });
});
