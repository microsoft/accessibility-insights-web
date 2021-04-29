// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NavigatorUtils } from 'common/navigator-utils';
import { FrameMessenger } from 'injected/frameCommunicators/frame-messenger';
import { IMock, Mock } from 'typemoq';
import { BrowserAdapter } from '../../../../../common/browser-adapters/browser-adapter';
import { HTMLElementUtils } from '../../../../../common/html-element-utils';
import { WindowUtils } from '../../../../../common/window-utils';
import { ClientUtils } from '../../../../../injected/client-utils';
import { DetailsDialogHandler } from '../../../../../injected/details-dialog-handler';
import { ShadowUtils } from '../../../../../injected/shadow-utils';
import { DrawerProvider } from '../../../../../injected/visualization/drawer-provider';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { HighlightBoxDrawer } from '../../../../../injected/visualization/highlight-box-drawer';
import { NullDrawer } from '../../../../../injected/visualization/null-drawer';
import { SingleTargetDrawer } from '../../../../../injected/visualization/single-target-drawer';
import { SVGDrawer } from '../../../../../injected/visualization/svg-drawer';

describe('DrawerProviderTests', () => {
    let testObject: DrawerProvider;
    let htmlElementUtils: IMock<HTMLElementUtils>;
    let windowUtils: IMock<WindowUtils>;
    let navigatorUtils: IMock<NavigatorUtils>;
    let shadowUtils: IMock<ShadowUtils>;
    let drawerUtils: IMock<DrawerUtils>;
    let clientUtils: IMock<ClientUtils>;
    let domStub: Document;
    let frameMessenger: IMock<FrameMessenger>;
    const browserAdapter = Mock.ofType<BrowserAdapter>();
    let detailsDialogHandlerMock: IMock<DetailsDialogHandler>;

    beforeEach(() => {
        htmlElementUtils = Mock.ofType(HTMLElementUtils);
        windowUtils = Mock.ofType(WindowUtils);
        navigatorUtils = Mock.ofType(NavigatorUtils);
        shadowUtils = Mock.ofType(ShadowUtils);
        drawerUtils = Mock.ofType(DrawerUtils);
        clientUtils = Mock.ofType(ClientUtils);
        detailsDialogHandlerMock = Mock.ofType<DetailsDialogHandler>();
        domStub = {} as Document;
        frameMessenger = Mock.ofType(FrameMessenger);
        const getRTLMock = Mock.ofInstance(() => null);

        testObject = new DrawerProvider(
            htmlElementUtils.object,
            windowUtils.object,
            navigatorUtils.object,
            shadowUtils.object,
            drawerUtils.object,
            clientUtils.object,
            domStub,
            frameMessenger.object,
            browserAdapter.object,
            getRTLMock.object,
            detailsDialogHandlerMock.object,
        );
    });

    const drawerYieldingFunctionNames = [
        'createHeadingsDrawer',
        'createLandmarksDrawer',
        'createIssuesDrawer',
        'createHighlightBoxDrawer',
        'createCustomWidgetsDrawer',
        'createNonTextComponentDrawer',
        'createTableHeaderAttributeDrawer',
    ];

    test.each(drawerYieldingFunctionNames)('%s', funcName => {
        const drawer = testObject[funcName]();
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
        expect(drawer).toBeInstanceOf(SVGDrawer);
    });

    test('getSVGDrawer: svg drawer v2 with non null config', () => {
        const configStub = {};
        const drawer = testObject.createSVGDrawer(configStub) as any;
        expect(drawer.formatter.givenConfiguration).toEqual(configStub);
        expect(drawer).toBeInstanceOf(SVGDrawer);
    });

    test('default case: null drawer', () => {
        const drawer = testObject.createNullDrawer();
        expect(drawer).toBeInstanceOf(NullDrawer);
    });
});
