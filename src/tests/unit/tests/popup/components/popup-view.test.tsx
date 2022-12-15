// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { NewTabLink } from 'common/components/new-tab-link';
import { DropdownClickHandler } from 'common/dropdown-click-handler';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import {
    LaunchPanelStoreData,
    LaunchPanelType,
} from 'common/types/store-data/launch-panel-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { shallow } from 'enzyme';
import { PopupActionMessageCreator } from 'popup/actions/popup-action-message-creator';
import { LaunchPanelHeader } from 'popup/components/launch-panel-header';
import {
    PopupView,
    PopupViewControllerDeps,
    PopupViewControllerState,
    PopupViewProps,
} from 'popup/components/popup-view';
import { DiagnosticViewClickHandler } from 'popup/handlers/diagnostic-view-toggle-click-handler';
import { PopupViewControllerHandler } from 'popup/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from 'popup/launch-pad-row-configuration-factory';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';
import { BaseDataBuilder } from '../../../common/base-data-builder';
import { IsSameObject } from '../../../common/typemoq-helper';

describe('PopupView', () => {
    const browserAdapterStub = {
        getManifest: getManifestStub,
    } as BrowserAdapter;

    const launchPanelStateStoreState: LaunchPanelStoreData = {
        launchPanelType: LaunchPanelType.LaunchPad,
    };
    const featureFlagStoreData = {};

    test('constructor', () => {
        const storesHubMock = createDefaultStoresHubMock(false);

        const props = createDefaultPropsBuilder(storesHubMock.object)
            .with('popupHandlers', {} as any)
            .build();

        (() => new PopupView(props))();

        storesHubMock.verifyAll();
    });

    test('render end-of-life message', () => {
        const storesHubMock = createDefaultStoresHubMock(false, false);

        const props = createDefaultPropsBuilder(storesHubMock.object)
            .with('popupHandlers', {} as any)
            .with('hasAccess', true)
            .build();

        const testObject = new PopupView(props);

        expect(testObject.render()).toMatchSnapshot();
    });

    test('renderFailureMsgPanelForChromeUrl', () => {
        const storesHubMock = createDefaultStoresHubMock();

        const props = createDefaultPropsBuilder(storesHubMock.object)
            .withDefaultTitleAndSubtitle()
            .with('popupHandlers', {
                gettingStartedDialogHandler: {} as any,
            } as any)
            .with('targetTabUrl', 'chrome://extensions')
            .with('hasAccess', false)
            .with('diagnosticViewToggleFactory', null)
            .build();

        const testObject = new PopupView(props);

        expect(testObject.render()).toMatchSnapshot();
    });

    test('renderFailureMsgPanelForFileUrl', () => {
        const storesHubMock = createDefaultStoresHubMock();

        const props = createDefaultPropsBuilder(storesHubMock.object)
            .withDefaultTitleAndSubtitle()
            .with('popupHandlers', {
                gettingStartedDialogHandler: {} as any,
            } as any)
            .with('targetTabUrl', 'file:///')
            .with('hasAccess', false)
            .with('diagnosticViewToggleFactory', null)
            .build();

        const wrapped = shallow(<PopupView {...props} />);
        expect(wrapped.getElement()).toMatchSnapshot();
    });

    function createDefaultPropsBuilder(storeHub: ClientStoresHub<any>): PopupViewPropsBuilder {
        return new PopupViewPropsBuilder()
            .withStoresHub(storeHub)
            .withBrowserAdapter(browserAdapterStub);
    }

    function createDefaultStoresHubMock(
        hasStores = true,
        hasStoreData = true,
    ): IMock<ClientStoresHub<any>> {
        const storesHubMock = Mock.ofType(ClientStoresHub);
        storesHubMock.setup(s => s.hasStores()).returns(() => hasStores);
        storesHubMock.setup(s => s.hasStoreData()).returns(() => hasStoreData);
        storesHubMock.setup(s => s.addChangedListenerToAllStores(It.isAny()));
        storesHubMock.setup(s => s.removeChangedListenerFromAllStores(It.isAny()));
        return storesHubMock;
    }

    function getManifestStub(): chrome.runtime.Manifest {
        return {
            version: '2',
        } as chrome.runtime.Manifest;
    }
});

class PopupViewPropsBuilder extends BaseDataBuilder<PopupViewProps> {
    public withDefaultTitleAndSubtitle(): PopupViewPropsBuilder {
        this.data.title = 'test title';
        return this;
    }
    public withStoresHub(storesHub: ClientStoresHub<any>): PopupViewPropsBuilder {
        this.data.deps = {
            ...this.data.deps,
            storesHub,
        };

        return this;
    }

    public withBrowserAdapter(browserAdapter: BrowserAdapter): PopupViewPropsBuilder {
        this.data.deps = {
            ...this.data.deps,
            browserAdapter,
        };

        return this;
    }
}
