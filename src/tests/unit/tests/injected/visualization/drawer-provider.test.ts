// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';
import { ClientBrowserAdapter } from '../../../../../common/client-browser-adapter';
import { HTMLElementUtils } from '../../../../../common/html-element-utils';
import { WindowUtils } from '../../../../../common/window-utils';
import { ClientUtils } from '../../../../../injected/client-utils';
import { FrameCommunicator } from '../../../../../injected/frameCommunicators/frame-communicator';
import { ShadowUtils } from '../../../../../injected/shadow-utils';
import { Drawer } from '../../../../../injected/visualization/drawer';
import { DrawerProvider } from '../../../../../injected/visualization/drawer-provider';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { HighlightBoxDrawer } from '../../../../../injected/visualization/highlight-box-drawer';
import { NullDrawer } from '../../../../../injected/visualization/null-drawer';
import { SingleTargetDrawer } from '../../../../../injected/visualization/single-target-drawer';
import { SVGDrawerV2 } from '../../../../../injected/visualization/svg-drawer-v2';

describe('DrawerProviderTests', () => {
    let testObject: DrawerProvider;
    let htmlElementUtils: IMock<HTMLElementUtils>;
    let windowUtils: IMock<WindowUtils>;
    let shadowUtils: IMock<ShadowUtils>;
    let drawerUtils: IMock<DrawerUtils>;
    let clientUtils: IMock<ClientUtils>;
    let domStub: Document;
    let frameCommunicator: IMock<FrameCommunicator>;
    const clientBrowserAdapter = Mock.ofType<ClientBrowserAdapter>();

    beforeEach(() => {
        htmlElementUtils = Mock.ofType(HTMLElementUtils);
        windowUtils = Mock.ofType(WindowUtils);
        shadowUtils = Mock.ofType(ShadowUtils);
        drawerUtils = Mock.ofType(DrawerUtils);
        clientUtils = Mock.ofType(ClientUtils);
        domStub = {} as Document;
        frameCommunicator = Mock.ofType(FrameCommunicator);
        const getRTLMock = Mock.ofInstance(() => null);

        testObject = new DrawerProvider(
            htmlElementUtils.object,
            windowUtils.object,
            shadowUtils.object,
            drawerUtils.object,
            clientUtils.object,
            domStub,
            frameCommunicator.object,
            clientBrowserAdapter.object,
            getRTLMock.object,
        );
    });

    const drawerYieldingFunctionNames = [
        'createHeadingsDrawer',
        'createLandmarksDrawer',
        'createIssuesDrawer',
        'createHighlightBoxDrawer',
        'createCustomWidgetsDrawer',
    ];

    test.each(drawerYieldingFunctionNames)('%s', funcName => {
        const drawer: Drawer = testObject[funcName]();
        expect(drawer).toBeInstanceOf(HighlightBoxDrawer);
    });

    test('getSingleTargetDrawer', () => {
        const injectedClassName = 'test';
        const drawer = testObject.createSingleTargetDrawer(injectedClassName);
        expect(drawer).toBeInstanceOf(SingleTargetDrawer);
    });

    test('getSVGDrawer: svg drawer v2 with null/no config', () => {
        const drawer = testObject.createSVGDrawer() as any;
        expect(drawer.formatter.givenConfiguration).toBeNull();
        expect(drawer).toBeInstanceOf(SVGDrawerV2);
    });

    test('getSVGDrawer: svg drawer v2 with non null config', () => {
        const configStub = {};
        const drawer = testObject.createSVGDrawer(configStub) as any;
        expect(drawer.formatter.givenConfiguration).toEqual(configStub);
        expect(drawer).toBeInstanceOf(SVGDrawerV2);
    });

    test('default case: null drawer', () => {
        const drawer = testObject.createNullDrawer();
        expect(drawer).toBeInstanceOf(NullDrawer);
    });
});
