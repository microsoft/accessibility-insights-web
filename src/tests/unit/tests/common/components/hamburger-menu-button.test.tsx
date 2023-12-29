// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { render } from '@testing-library/react';
import { IButtonProps, IconButton } from '@fluentui/react';
import {
    HamburgerMenuButton,
    HamburgerMenuButtonDeps,
    HamburgerMenuButtonProps,
} from 'common/components/hamburger-menu-button';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { VisualizationType } from 'common/types/visualization-type';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { LaunchPanelHeader } from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';
import { getMockComponentClassPropsForCall, mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('HamburgerMenuButton', () => {
    describe('renders', () => {
        mockReactComponents([IconButton]);
        const deps: HamburgerMenuButtonDeps = {
            launchPanelHeaderClickHandler: Mock.ofType(LaunchPanelHeaderClickHandler).object,
            popupActionMessageCreator: Mock.ofType(PopupActionMessageCreator).object,
        };

        const props: HamburgerMenuButtonProps = {
            deps,
            header: Mock.ofType(LaunchPanelHeader).object,
            popupWindow: Mock.ofType<Window>().object,
        };

        it('proper button and menu item props', () => {
            const renderResult = render(<HamburgerMenuButton {...props} />);
            expect(renderResult.asFragment()).toMatchSnapshot();
        });

        it('no down chevron menu icon', () => {
            render(<HamburgerMenuButton {...props} />);
            const testSubject = getMockComponentClassPropsForCall(IconButton).onRenderMenuIcon;

            expect(testSubject()).toBeNull();
        });
    });

    describe('user interaction', () => {
        const event = new EventStubFactory().createMouseClickEvent() as any;

        const headerMock = Mock.ofType<LaunchPanelHeader>();
        const popupWindowMock = Mock.ofType<Window>();

        let popupActionMessageCreatorMock: IMock<PopupActionMessageCreator>;
        let launchPanelHeaderClickHandlerMock: IMock<LaunchPanelHeaderClickHandler>;

        let buttonProps: IButtonProps;

        beforeEach(() => {
            popupActionMessageCreatorMock = Mock.ofType<PopupActionMessageCreator>();
            launchPanelHeaderClickHandlerMock = Mock.ofType<LaunchPanelHeaderClickHandler>();

            const props: HamburgerMenuButtonProps = {
                deps: {
                    launchPanelHeaderClickHandler: launchPanelHeaderClickHandlerMock.object,
                    popupActionMessageCreator: popupActionMessageCreatorMock.object,
                },
                header: headerMock.object,
                popupWindow: popupWindowMock.object,
            };

            render(<HamburgerMenuButton {...props} />);
            buttonProps = getMockComponentClassPropsForCall(IconButton);
        });

        it('handle fast-pass', () => {
            popupActionMessageCreatorMock.verify(
                handler => handler.openDetailsView(It.isAny(), It.isAny(), It.isAny(), It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('fast-pass').onClick(event);
            popupActionMessageCreatorMock.verify(
                handler =>
                    handler.openDetailsView(
                        It.isObjectWith(event),
                        VisualizationType.Issues,
                        TelemetryEventSource.HamburgerMenu,
                        DetailsViewPivotType.fastPass,
                    ),
                Times.once(),
            );
        });

        it('handles assessment', () => {
            popupActionMessageCreatorMock.verify(
                handler => handler.openDetailsView(It.isAny(), It.isAny(), It.isAny(), It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('assessment').onClick(event);
            popupActionMessageCreatorMock.verify(
                handler =>
                    handler.openDetailsView(
                        It.isObjectWith(event),
                        null,
                        TelemetryEventSource.HamburgerMenu,
                        DetailsViewPivotType.assessment,
                    ),
                Times.once(),
            );
        });

        it('handles quick-assess', () => {
            popupActionMessageCreatorMock.verify(
                handler => handler.openDetailsView(It.isAny(), It.isAny(), It.isAny(), It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('quick-assess').onClick(event);
            popupActionMessageCreatorMock.verify(
                handler =>
                    handler.openDetailsView(
                        It.isObjectWith(event),
                        null,
                        TelemetryEventSource.HamburgerMenu,
                        DetailsViewPivotType.quickAssess,
                    ),
                Times.once(),
            );
        });

        it('handles ad-hoc', () => {
            launchPanelHeaderClickHandlerMock.verify(
                handler => handler.openAdhocToolsPanel(It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('ad-hoc-tools').onClick(event);
            launchPanelHeaderClickHandlerMock.verify(
                handler => handler.openAdhocToolsPanel(headerMock.object),
                Times.once(),
            );
        });

        it('handles keyboards shortcuts', () => {
            popupActionMessageCreatorMock.verify(
                handler => handler.openShortcutConfigureTab(It.isAny()),
                Times.never(),
            );
            findMenuItemByKey('modify-shortcuts').onClick(event);
            popupActionMessageCreatorMock.verify(
                handler => handler.openShortcutConfigureTab(It.isObjectWith(event)),
                Times.once(),
            );
        });

        it('handles help', () => {
            launchPanelHeaderClickHandlerMock.verify(
                handler => handler.onClickLink(It.isAny(), It.isAny(), It.isAny()),
                Times.never(),
            );
            const helpMenuItem = findMenuItemByKey('help');
            helpMenuItem.onClick(event, helpMenuItem);
            launchPanelHeaderClickHandlerMock.verify(
                handler =>
                    handler.onClickLink(
                        popupWindowMock.object,
                        It.isObjectWith(event),
                        It.isObjectWith({
                            key: 'help',
                            iconProps: {
                                iconName: 'Unknown',
                            },
                            data: 'https://go.microsoft.com/fwlink/?linkid=2077937',
                            name: 'Help',
                        }),
                    ),
                Times.once(),
            );
        });

        it('handles third-party-notices', () => {
            launchPanelHeaderClickHandlerMock.verify(
                handler => handler.onClickLink(It.isAny(), It.isAny(), It.isAny()),
                Times.never(),
            );
            const noticesItem = findMenuItemByKey('third-party-notices');
            noticesItem.onClick(event, noticesItem);
            launchPanelHeaderClickHandlerMock.verify(
                handler =>
                    handler.onClickLink(
                        popupWindowMock.object,
                        It.isObjectWith(event),
                        It.isObjectWith({
                            key: 'third-party-notices',
                            iconProps: {
                                iconName: 'TextDocument',
                            },
                            data: '/NOTICE.html',
                            name: 'Third party notices',
                        }),
                    ),
                Times.once(),
            );
        });

        const findMenuItemByKey = (key: string) => {
            return buttonProps.menuProps.items.find(item => item.key === key);
        };
    });
});
