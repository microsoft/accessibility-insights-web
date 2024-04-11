// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock, MockBehavior, Times } from 'typemoq';

import {
    LaunchPanelHeader,
    LaunchPanelHeaderDeps,
    LaunchPanelHeaderProps,
    LaunchPanelHeaderState,
} from '../../../../../popup/components/launch-panel-header';
import { LaunchPanelHeaderClickHandler } from '../../../../../popup/handlers/launch-panel-header-click-handler';

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
        };
        const eventStub = {
            currentTarget: 'currentTarget',
        };
        setStateMock.setup(sm => sm(It.isValue(stateStub))).verifiable();

        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: null,
            dropdownClickHandler: null,
            launchPanelHeaderClickHandler: null,
        };

        const props: LaunchPanelHeaderProps = {
            deps: deps,
            title: 'title',
            subtitle: 'subtitle',
            popupWindow: null,
            featureFlags: null,
            openAdhocToolsPanel: null,
        };
        const header = new LaunchPanelHeader(props);
        header.setState = setStateMock.object;

        testObject.onOpenContextualMenu(header, eventStub as any);

        setStateMock.verifyAll();
    });

    test('openAdhocToolsPanel', () => {
        const openAdhocToolsPanelMock = Mock.ofInstance(() => {});
        openAdhocToolsPanelMock.setup(o => o()).verifiable();

        const deps: LaunchPanelHeaderDeps = {
            popupActionMessageCreator: null,
            dropdownClickHandler: null,
            launchPanelHeaderClickHandler: testObject,
        };

        const props: LaunchPanelHeaderProps = {
            deps: deps,
            title: 'title',
            subtitle: 'subtitle',
            openAdhocToolsPanel: openAdhocToolsPanelMock.object,
            popupWindow: null,
            featureFlags: null,
        };

        const header = new LaunchPanelHeader(props);

        const setStateMock = Mock.ofInstance(
            (state: LaunchPanelHeaderState) => {},
            MockBehavior.Strict,
        );

        header.setState = setStateMock.object;

        testObject.openAdhocToolsPanel(header);

        openAdhocToolsPanelMock.verifyAll();
        setStateMock.verifyAll();
    });
});
