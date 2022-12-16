// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { ClientStoresHub } from 'common/stores/client-stores-hub';
import { shallow } from 'enzyme';
import { PopupView, PopupViewProps } from 'popup/components/popup-view';
import * as React from 'react';
import { IMock, It, Mock } from 'typemoq';
import { BaseDataBuilder } from '../../../common/base-data-builder';

describe('PopupView', () => {
    const browserAdapterStub = {
        getManifest: getManifestStub,
    } as BrowserAdapter;

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
