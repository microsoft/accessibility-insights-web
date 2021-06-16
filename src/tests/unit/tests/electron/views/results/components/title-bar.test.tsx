// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ThemeInnerState } from 'common/components/theme';
import { StoreActionMessageCreatorImpl } from 'common/message-creators/store-action-message-creator-impl';
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { WindowFrameActionCreator } from 'electron/flux/action-creator/window-frame-action-creator';
import { WindowStateStoreData } from 'electron/flux/types/window-state-store-data';
import { MaximizeRestoreButtonProps } from 'electron/views/results/components/maximize-restore-button';
import { TitleBar, TitleBarProps } from 'electron/views/results/components/title-bar';
import { PlatformInfo } from 'electron/window-management/platform-info';
import { shallow } from 'enzyme';
import { Button } from 'office-ui-fabric-react';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, Mock, MockBehavior, Times } from 'typemoq';

describe('TitleBar', () => {
    const eventStub = new EventStubFactory().createMouseClickEvent() as React.MouseEvent<Button>;
    let windowFrameActionCreator: IMock<WindowFrameActionCreator>;
    let windowStateStoreData: WindowStateStoreData;
    let props: TitleBarProps;

    beforeEach(() => {
        windowFrameActionCreator = Mock.ofType<WindowFrameActionCreator>(
            undefined,
            MockBehavior.Strict,
        );
        windowStateStoreData = { routeId: 'resultsView', currentWindowState: 'maximized' };
        props = {
            deps: {
                windowFrameActionCreator: windowFrameActionCreator.object,
                platformInfo: Mock.ofType(PlatformInfo).object,
                storeActionMessageCreator: Mock.ofType(StoreActionMessageCreatorImpl).object,
                storesHub:
                    Mock.ofType<ClientStoresHub<ThemeInnerState>>(BaseClientStoresHub).object,
            },
            pageTitle: 'test page title',
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

    const maximizeButtonTestCases = [
        {
            label: 'maximize when on custom size',
            setupMock: setupVerifiableWindowMaximizeAction,
            isMaximized: false,
        }, // maximize validation
        {
            label: 'restore when on full screen',
            setupMock: setupVerifiableWindowRestoreActionFromFullScreen,
            isMaximized: true,
        }, // restore validation from full screen
        {
            label: 'restore when on maximized state',
            setupMock: setupVerifiableWindowRestoreActionFromMaximized,
            isMaximized: true,
        }, // restore validation from maximized state
    ];

    maximizeButtonTestCases.forEach(testCase => {
        it(`maximize-restore button should ${testCase.label}`, () => {
            testCase.setupMock();

            const rendered = shallow(<TitleBar {...props} />);
            const renderedElement = rendered.getElement();
            const renderedIcons = shallow(<div>{renderedElement.props.actionableIcons}</div>);
            const button = renderedIcons.findWhere(p => {
                return p.key() === 'maximize-restore';
            });

            const buttonProps = button.getElement().props as MaximizeRestoreButtonProps;

            expect(buttonProps.isMaximized).toBe(testCase.isMaximized);

            buttonProps.onClick();

            windowFrameActionCreator.verifyAll();
        });
    });
});
