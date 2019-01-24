// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, Times } from 'typemoq';

import {
    ILaunchPanelHeaderProps,
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
} from '../../../../../../popup/scripts/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from '../../../../../../popup/scripts/handlers/launch-panel-header-click-handler';

describe('FeedbackMenuClickHandlerTest', () => {
    let testObject: LaunchPanelHeaderClickHandler;

    beforeEach(() => {
        testObject = new LaunchPanelHeaderClickHandler();
    });

    test('onClickLink', () => {
        const itemStub = {
            data: 'url',
        } as any;

        const openTabMock = Mock.ofInstance(url => {});
        openTabMock.setup(ot => ot(itemStub.data)).verifiable();

        const windowStub = {
            open: openTabMock.object,
        } as any;

        const eventStub = {} as any;

        testObject.onClickLink(windowStub, eventStub, itemStub);

        openTabMock.verifyAll();
    });

    test('onClickLink null item', () => {
        const itemStub = null;

        const openTabMock = Mock.ofInstance(url => {});
        openTabMock.setup(ot => ot(It.isAny())).verifiable(Times.never());

        const windowStub = {
            open: openTabMock.object,
        } as any;

        const eventStub = {} as any;

        testObject.onClickLink(windowStub, eventStub, itemStub);

        openTabMock.verifyAll();
    });

    test('onCollapseMenuClick', () => {
        const setStateMock = Mock.ofInstance((state: any) => {});
        const stateStub = {
            target: 'currentTarget',
            isContextMenuVisible: true,
        };
        const eventStub = {
            currentTarget: 'currentTarget',
        };
        setStateMock.setup(sm => sm(It.isValue(stateStub))).verifiable();

        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: null,
            dropdownClickHandler: null,
        };

        const props: ILaunchPanelHeaderProps = {
            deps: deps,
            title: 'title',
            subtitle: 'subtitle',
            clickhandler: null,
            supportLinkHandler: null,
            popupWindow: null,
            featureFlags: null,
            openAdhocToolsPanel: null,
            dropdownClickHandler: null,
        };
        const header = new LaunchPanelHeader(props);
        header.setState = setStateMock.object;

        testObject.onOpenContextualMenu(header, eventStub as any);

        setStateMock.verifyAll();
    });

    test('onDismissFeedbackMenu', () => {
        const setStateMock = Mock.ofInstance((state: any) => {});
        const stateStub = {
            isContextMenuVisible: false,
        };
        const eventStub = {
            currentTarget: 'currentTarget',
        };
        setStateMock.setup(sm => sm(It.isValue(stateStub))).verifiable();

        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: null,
            dropdownClickHandler: null,
        };

        const props: ILaunchPanelHeaderProps = {
            deps: deps,
            title: 'title',
            subtitle: 'subtitle',
            clickhandler: null,
            supportLinkHandler: null,
            popupWindow: null,
            featureFlags: null,
            openAdhocToolsPanel: null,
            dropdownClickHandler: null,
        };
        const header = new LaunchPanelHeader(props);
        header.setState = setStateMock.object;

        testObject.onDismissFeedbackMenu(header, eventStub as any);

        setStateMock.verifyAll();
    });

    test('openAdhocToolsPanel', () => {
        const openAdhocToolsPanelMock = Mock.ofInstance(() => {});
        openAdhocToolsPanelMock.setup(o => o()).verifiable();

        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: null,
            dropdownClickHandler: null,
        };

        const props: ILaunchPanelHeaderProps = {
            deps: deps,
            title: 'title',
            subtitle: 'subtitle',
            openAdhocToolsPanel: openAdhocToolsPanelMock.object,
            clickhandler: {
                onDismissFeedbackMenu: () => {},
            } as any,
            supportLinkHandler: null,
            popupWindow: null,
            featureFlags: null,
            dropdownClickHandler: null,
        };

        const header = new LaunchPanelHeader(props);

        testObject.openAdhocToolsPanel(header);

        openAdhocToolsPanelMock.verifyAll();
    });
});
