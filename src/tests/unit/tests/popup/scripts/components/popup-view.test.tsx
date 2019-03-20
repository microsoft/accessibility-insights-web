// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import { ChromeAdapter } from '../../../../../../background/browser-adapter';
import { NewTabLink } from '../../../../../../common/components/new-tab-link';
import { DropdownClickHandler } from '../../../../../../common/dropdown-click-handler';
import { StoreActionMessageCreator } from '../../../../../../common/message-creators/store-action-message-creator';
import { BaseClientStoresHub } from '../../../../../../common/stores/base-client-stores-hub';
import { ICommandStoreData } from '../../../../../../common/types/store-data/icommand-store-data';
import { ILaunchPanelStoreData } from '../../../../../../common/types/store-data/ilaunch-panel-store-data';
import { UserConfigurationStoreData } from '../../../../../../common/types/store-data/user-configuration-store';
import { PopupActionMessageCreator } from '../../../../../../popup/scripts/actions/popup-action-message-creator';
import { LaunchPanelHeader } from '../../../../../../popup/scripts/components/launch-panel-header';
import {
    LaunchPanelType,
    PopupView,
    PopupViewControllerDeps,
    PopupViewControllerState,
    PopupViewProps,
} from '../../../../../../popup/scripts/components/popup-view';
import { DiagnosticViewClickHandler } from '../../../../../../popup/scripts/handlers/diagnostic-view-toggle-click-handler';
import { PopupViewControllerHandler } from '../../../../../../popup/scripts/handlers/popup-view-controller-handler';
import { LaunchPadRowConfigurationFactory } from '../../../../../../popup/scripts/launch-pad-row-configuration-factory';
import { SupportLinkHandler } from '../../../../../../popup/support-link-handler';
import { BaseDataBuilder } from '../../../../common/base-data-builder';
import { ShortcutCommandsTestData } from '../../../../common/sample-test-data';
import { IsSameObject } from '../../../../common/typemoq-helper';
import { VisualizationStoreDataBuilder } from '../../../../common/visualization-store-data-builder';

describe('PopupView', () => {
    const browserAdapterMock = Mock.ofType(ChromeAdapter);
    const commandStoreState: ICommandStoreData = {
        commands: ShortcutCommandsTestData,
    };
    const launchPanelStateStoreState: ILaunchPanelStoreData = {
        launchPanelType: LaunchPanelType.LaunchPad,
    };
    const featureFlagStoreData = {};

    afterEach(() => {
        browserAdapterMock.reset();
    });

    test('constructor', () => {
        const manifestStub = getManifestStub();
        const storesHubMock = createDefaultStoresHubMock(false);

        browserAdapterMock
            .setup(ba => ba.getManifest())
            .returns(() => manifestStub)
            .verifiable(Times.once());

        const props = createDefaultPropsBuilder(storesHubMock.object)
            .with('popupHandlers', {} as any)
            .build();

        const testObject = new PopupView(props);

        storesHubMock.verifyAll();
    });

    test('render spinner', () => {
        const manifestStub = getManifestStub();

        const storesHubMock = createDefaultStoresHubMock(false, false);

        browserAdapterMock
            .setup(ba => ba.getManifest())
            .returns(() => manifestStub)
            .verifiable(Times.once());

        const props = createDefaultPropsBuilder(storesHubMock.object)
            .with('popupHandlers', {} as any)
            .with('hasAccess', true)
            .build();

        const testObject = new PopupView(props);

        expect(testObject.render()).toMatchSnapshot();
    });

    describe('render actual content', () => {
        let actionMessageCreatorStrictMock: IMock<PopupActionMessageCreator>;
        let dropdownClickHandlerMock: IMock<DropdownClickHandler>;
        let handlerMock: IMock<PopupViewControllerHandler>;
        let storesHubMock: IMock<BaseClientStoresHub<any>>;
        let clickHandlerMock: IMock<DiagnosticViewClickHandler>;
        let storeState: PopupViewControllerState;
        let deps: PopupViewControllerDeps;
        const manifestStub = getManifestStub();
        const rowConfigStub = {};
        const shortcutModifyHandlerStub = {};
        const visualizationStoreState = new VisualizationStoreDataBuilder().build();
        const launchPadRowConfigurationFactoryMock = Mock.ofType(LaunchPadRowConfigurationFactory);
        const popupViewStoreActionMessageCreatorMock = Mock.ofType(StoreActionMessageCreator);
        const userConfigStoreData: UserConfigurationStoreData = {
            isFirstTime: true,
            enableTelemetry: false,
            enableHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
        };

        beforeEach(() => {
            actionMessageCreatorStrictMock = Mock.ofType<PopupActionMessageCreator>(null, MockBehavior.Strict);
            dropdownClickHandlerMock = Mock.ofType(DropdownClickHandler);
            handlerMock = Mock.ofType(PopupViewControllerHandler);
            clickHandlerMock = Mock.ofType(DiagnosticViewClickHandler);
            storesHubMock = createDefaultStoresHubMock();
            browserAdapterMock
                .setup(ba => ba.getManifest())
                .returns(() => manifestStub)
                .verifiable();
            launchPadRowConfigurationFactoryMock
                .setup(l =>
                    l.createRowConfigs(It.isAny(), IsSameObject(actionMessageCreatorStrictMock.object), IsSameObject(handlerMock.object)),
                )
                .returns(() => rowConfigStub as any)
                .verifiable();

            storeState = {
                visualizationStoreData: visualizationStoreState,
                launchPanelStateStoreData: launchPanelStateStoreState,
                featureFlagStoreData: featureFlagStoreData,
                commandStoreData: commandStoreState,
                userConfigurationStoreData: userConfigStoreData,
            };

            deps = {
                popupActionMessageCreator: actionMessageCreatorStrictMock.object,
                dropdownClickHandler: dropdownClickHandlerMock.object,
            } as PopupViewControllerDeps;
        });

        test('render toggles view: launch pad', () => {
            actionMessageCreatorStrictMock.setup(acm => acm.openLaunchPad(launchPanelStateStoreState.launchPanelType)).verifiable();
            const props = createDefaultPropsBuilder(storesHubMock.object)
                .withDefaultTitleAndSubtitle()
                .with('deps', deps)
                .with('popupHandlers', {
                    diagnosticViewClickHandler: clickHandlerMock.object,
                    popupViewControllerHandler: handlerMock.object,
                    launchPanelHeaderClickHandler: null,
                    supportLinkHandler: new SupportLinkHandler(null, null),
                    shortcutModifyHandler: shortcutModifyHandlerStub as any,
                })
                .with('hasAccess', true)
                .with('launchPadRowConfigurationFactory', launchPadRowConfigurationFactoryMock.object)
                .with('storeState', storeState)
                .build();
            props.deps.storesHub = storesHubMock.object;
            props.deps.storeActionMessageCreator = popupViewStoreActionMessageCreatorMock.object;

            actionMessageCreatorStrictMock.setup(amc => amc.openTutorial(It.isAny()));

            const rendered = shallow(<PopupView {...props} />);

            expect(rendered.debug()).toMatchSnapshot();

            const Subtitle = () => rendered.find(LaunchPanelHeader).prop('subtitle') as JSX.Element;
            const renderedSubtitle = shallow(<Subtitle />);
            expect(renderedSubtitle.debug()).toMatchSnapshot('subtitle');
            const link = renderedSubtitle.find(NewTabLink);

            link.simulate('click');
            actionMessageCreatorStrictMock.verify(ac => ac.openTutorial(It.isAny()), Times.once());

            handlerMock.verifyAll();
        });

        test('render toggles view: ad-hoc tools', () => {
            const adHocLaunchPanelStateStoreState: ILaunchPanelStoreData = {
                launchPanelType: LaunchPanelType.AdhocToolsPanel,
            };
            storeState.launchPanelStateStoreData = adHocLaunchPanelStateStoreState;
            actionMessageCreatorStrictMock.setup(acm => acm.openLaunchPad(adHocLaunchPanelStateStoreState.launchPanelType)).verifiable();
            const props = createDefaultPropsBuilder(storesHubMock.object)
                .withDefaultTitleAndSubtitle()
                .with('deps', deps)
                .with('popupHandlers', {
                    diagnosticViewClickHandler: clickHandlerMock.object,
                    popupViewControllerHandler: handlerMock.object,
                    launchPanelHeaderClickHandler: null,
                    supportLinkHandler: new SupportLinkHandler(null, null),
                    shortcutModifyHandler: shortcutModifyHandlerStub as any,
                })
                .with('hasAccess', true)
                .with('launchPadRowConfigurationFactory', launchPadRowConfigurationFactoryMock.object)
                .with('storeState', storeState)
                .build();
            props.deps.storesHub = storesHubMock.object;
            props.deps.storeActionMessageCreator = popupViewStoreActionMessageCreatorMock.object;

            const rendered = shallow(<PopupView {...props} />);

            expect(rendered.debug()).toMatchSnapshot();

            handlerMock.verifyAll();
        });

        test('renderAdHocToolsPanel', () => {
            const launchPanelStateStoreStateStub = {
                launchPanelType: LaunchPanelType.AdhocToolsPanel,
            };

            storeState.launchPanelStateStoreData = launchPanelStateStoreStateStub;

            actionMessageCreatorStrictMock.setup(acm => acm.openLaunchPad(launchPanelStateStoreStateStub.launchPanelType)).verifiable();

            const props = createDefaultPropsBuilder(storesHubMock.object)
                .withDefaultTitleAndSubtitle()
                .with('deps', deps)
                .with('popupHandlers', {
                    diagnosticViewClickHandler: null,
                    popupViewControllerHandler: handlerMock.object,
                    launchPanelHeaderClickHandler: null,
                    supportLinkHandler: new SupportLinkHandler(null, null),
                    shortcutModifyHandler: null,
                })
                .with('hasAccess', true)
                .with('diagnosticViewToggleFactory', null)
                .with('launchPadRowConfigurationFactory', launchPadRowConfigurationFactoryMock.object)
                .with('storeState', storeState)
                .build();
            props.deps.storesHub = storesHubMock.object;
            props.deps.storeActionMessageCreator = popupViewStoreActionMessageCreatorMock.object;
            const rendered = shallow(<PopupView {...props} />);

            expect(rendered.debug()).toMatchSnapshot();
            handlerMock.verifyAll();
        });
    });

    test('renderFailureMsgPanelForChromeUrl', () => {
        const manifestStub = getManifestStub();

        browserAdapterMock.setup(ba => ba.getManifest()).returns(() => manifestStub);

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
        const manifestStub = getManifestStub();

        browserAdapterMock.setup(ba => ba.getManifest()).returns(() => manifestStub);
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
        // const testObject = new PopupView(props);

        // expect(testObject.render()).toMatchSnapshot();
    });

    function createDefaultPropsBuilder(storeHub: BaseClientStoresHub<any>): PopupViewPropsBuilder {
        return new PopupViewPropsBuilder().withStoresHub(storeHub).with('browserAdapter', browserAdapterMock.object);
    }

    function createDefaultStoresHubMock(hasStores = true, hasStoreData = true): IMock<BaseClientStoresHub<any>> {
        const storesHubMock = Mock.ofType(BaseClientStoresHub);
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
    public withStoresHub(storesHub: BaseClientStoresHub<any>): PopupViewPropsBuilder {
        this.data = {
            deps: {
                storesHub,
            },
        } as PopupViewProps;
        return this;
    }
}
