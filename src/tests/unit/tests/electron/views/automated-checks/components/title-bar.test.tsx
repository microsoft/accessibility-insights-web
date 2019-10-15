// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { PlatformInfo } from 'electron/platform-info';
import { TitleBar, TitleBarProps } from 'electron/views/automated-checks/components/title-bar';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react/lib/Button';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('TitleBar', () => {
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
    let windowFrameActionCreator: IMock<WindowFrameActionCreator>;
    let windowStateStoreData: WindowStateStoreData;
    let props: TitleBarProps;

    beforeEach(() => {
        windowFrameActionCreator = Mock.ofType<WindowFrameActionCreator>(undefined, MockBehavior.Strict);
        windowStateStoreData = { routeId: 'resultsView', currentWindowState: 'maximized' };
        props = {
            deps: {
                windowFrameActionCreator: windowFrameActionCreator.object,
                platformInfo: Mock.ofType(PlatformInfo).object,
            },
            windowStateStoreData,
        };
    });

    it('renders', () => {
        props.deps.windowFrameActionCreator = Mock.ofType(WindowFrameActionCreator).object;
        const wrapper = shallow(<TitleBar {...props} />);

        const element = wrapper.getElement();
        expect(element).toMatchSnapshot();
    });

    const setupVerifiableWindowMaximizeAction = () => {
        windowStateStoreData.currentWindowState = 'customSize';

        windowFrameActionCreator.setup(creator => creator.maximize()).verifiable(Times.once());
    };

    const setupVerifiableWindowRestoreActionFromMaximized = () => {
        windowStateStoreData.currentWindowState = 'maximized';
        windowFrameActionCreator.setup(creator => creator.restore()).verifiable(Times.once());
    };

    const setupVerifiableWindowRestoreActionFromFullScreen = () => {
        windowStateStoreData.currentWindowState = 'fullScreen';
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
        { id: '#maximize-button', setupMock: setupVerifiableWindowRestoreActionFromFullScreen }, // restore validation from full screen
        { id: '#maximize-button', setupMock: setupVerifiableWindowRestoreActionFromMaximized }, // restore validation from maximized state
        { id: '#minimize-button', setupMock: setupVerifiableWindowMinimizeCall },
        { id: '#close-button', setupMock: setupVerifiableWindowCloseActionCall },
    ];

    buttonsAndSetups.forEach(testCase => {
        it(`test button - ${testCase.id}`, () => {
            testCase.setupMock();

            const rendered = shallow(<TitleBar {...props} />);
            const renderedElement = rendered.getElement();
            const renderedIcons = shallow(<div>{renderedElement.props.actionableIcons}</div>);

            const button = renderedIcons.find(testCase.id);

            button.simulate('click', eventStub);

            windowFrameActionCreator.verifyAll();
        });
    });
});
