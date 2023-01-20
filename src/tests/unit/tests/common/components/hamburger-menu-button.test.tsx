// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ContextualMenu, IButtonProps, IconButton } from '@fluentui/react';
import {
    HamburgerMenuButton,
    HamburgerMenuButtonDeps,
    HamburgerMenuButtonProps,
} from 'common/components/hamburger-menu-button';
import { TelemetryEventSource } from 'common/extension-telemetry-events';
import { DetailsViewPivotType } from 'common/types/store-data/details-view-pivot-type';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { shallow } from 'enzyme';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { LaunchPanelHeader } from 'popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from 'popup/handlers/launch-panel-header-click-handler';
import * as React from 'react';
import { EventStubFactory } from 'tests/unit/common/event-stub-factory';
import { IMock, It, Mock, Times } from 'typemoq';

describe('HamburgerMenuButton', () => {
    describe('renders', () => {
        const deps: HamburgerMenuButtonDeps = {
            launchPanelHeaderClickHandler: Mock.ofType(LaunchPanelHeaderClickHandler).object,
            popupActionMessageCreator: Mock.ofType(PopupActionMessageCreator).object,
        };

        const props: HamburgerMenuButtonProps = {
            deps,
            header: Mock.ofType(LaunchPanelHeader).object,
            popupWindow: Mock.ofType<Window>().object,
            featureFlagData: {},
        };

        it('proper button and menu item props', () => {
            const testSubject = shallow(<HamburgerMenuButton {...props} />);
            expect(testSubject.getElement()).toMatchSnapshot();
        });

        it('no down chevron menu icon', () => {
            const wrapped = shallow(<HamburgerMenuButton {...props} />);
            const testSubject = wrapped.find<IButtonProps>(IconButton).prop('onRenderMenuIcon');

            expect(testSubject()).toBeNull();
        });

        it('does not render quick-assess menu item if feature flag is false', () => {
            props.featureFlagData = { quickAssess: false };
            const wrapped = shallow(<HamburgerMenuButton {...props} />);
            const testSubject = wrapped.find<IButtonProps>(IconButton).prop('menuProps').items;

            expect(testSubject.find(item => item.key === 'quick-assess')).toBeUndefined();
        });

        it('renders quick-assess menu item if feature flag is true', () => {
            props.featureFlagData = { quickAssess: true };
            const wrapped = shallow(<HamburgerMenuButton {...props} />);
            const testSubject = wrapped.find<IButtonProps>(IconButton).prop('menuProps').items;

            expect(testSubject.find(item => item.key === 'quick-assess')).toBeDefined();
        });
    });

    describe('user interaction', () => {
        const event = new EventStubFactory().createMouseClickEvent() as any;

        const headerMock = Mock.ofType<LaunchPanelHeader>();
        const popupWindowMock = Mock.ofType<Window>();

        let popupActionMessageCreatorMock: IMock<PopupActionMessageCreator>;
        let launchPanelHeaderClickHandlerMock: IMock<LaunchPanelHeaderClickHandler>;

        let buttonProps: IButtonProps;
        let featureFlagDataStub: FeatureFlagStoreData = { quickAssess: true };

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
                featureFlagData: featureFlagDataStub,
            };

            const testObject = shallow(<HamburgerMenuButton {...props} />);
            buttonProps = testObject.find(IconButton).props();
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
