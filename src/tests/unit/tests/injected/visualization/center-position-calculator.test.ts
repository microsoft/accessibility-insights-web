// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IPoint } from '@fluentui/utilities';
import { IMock, Mock, MockBehavior } from 'typemoq';
import { TabbableElementsHelper } from '../../../../../common/tabbable-elements-helper';
import { WindowUtils } from '../../../../../common/window-utils';
import { ClientUtils } from '../../../../../injected/client-utils';
import { CenterPositionCalculator } from '../../../../../injected/visualization/center-position-calculator';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';
import { TestDocumentCreator } from '../../../common/test-document-creator';
import { DrawerUtilsMockBuilder } from './drawer-utils-mock-builder';

describe('CenterPositionCalculatorTest', () => {
    let windowUtilsMock: IMock<WindowUtils>;
    let tabbableElementsHelperMock: IMock<TabbableElementsHelper>;
    let documentMock;
    const bodyStub = { bodyStub: true } as any;
    const styleStub = { styleStub: true } as any;

    beforeEach(() => {
        windowUtilsMock = Mock.ofType(WindowUtils);
        tabbableElementsHelperMock = Mock.ofType(TabbableElementsHelper);
        documentMock = {
            documentElement: { docElement: true },
            body: bodyStub,
        };
    });

    function createCenterPositionCalculator(drawerUtils: DrawerUtils): CenterPositionCalculator {
        const centerPositionCalculator = new CenterPositionCalculator(
            drawerUtils,
            windowUtilsMock.object,
            tabbableElementsHelperMock.object,
            new ClientUtils(window),
        );

        return centerPositionCalculator;
    }

    test('getElementCenterPosition', () => {
        const element = document.createElement('div');
        const expectedPosition: IPoint = {
            x: 12,
            y: 12,
        };

        setupDefaultWindowUtilsMock();
        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupGetContainerOffset(10)
            .setupGetContainerSize(4)
            .build();

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(element)).toEqual(
            expectedPosition,
        );

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: area outsied of doc', () => {
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="poly" coords="10,20,80,60,0,40" alt="Venus" href="venus.htm">
                    </map>
                `);

        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;

        setupDefaultWindowUtilsMock();
        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupIsOutsideOfDocument(true)
            .setupGetContainerOffsetNeverCall()
            .build();

        setupDefaultTabbableElementsHelperMock(area, map, img);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toBeNull();

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: default area', () => {
        const expectedPosition: IPoint = {
            x: 10,
            y: 10,
        };
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap"/>
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="default" coords="0,0" alt="Venus" href="venus.htm"/>
                    </map>
                `);
        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;

        setupDefaultWindowUtilsMock();

        const drawerUtilsMock = new DrawerUtilsMockBuilder(dom, styleStub)
            .setupGetContainerOffset(10)
            .setupGetContainerSize(4)
            .build();

        setupDefaultTabbableElementsHelperMock(area, map, img);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toEqual(expectedPosition);

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: circle area', () => {
        const expectedPosition: IPoint = {
            x: 100,
            y: 68,
        };
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="circle" coords="90,58,3" alt="Mercury" href="mercur.htm">
                    </map>
                `);
        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;
        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupGetContainerSizeNeverCall()
            .setupGetContainerOffset(10)
            .build();

        setupDefaultTabbableElementsHelperMock(area, map, img);

        setupDefaultWindowUtilsMock();

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toEqual(expectedPosition);

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: poly area', () => {
        const expectedPosition: IPoint = {
            x: 40,
            y: 50,
        };
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="poly" coords="10,20,80,60,0,40" alt="Venus" href="venus.htm">
                    </map>
                `);
        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;

        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupGetContainerOffset(10)
            .setupGetContainerSizeNeverCall()
            .build();

        setupDefaultWindowUtilsMock();
        setupDefaultTabbableElementsHelperMock(area, map, img);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toEqual(expectedPosition);

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: rect area', () => {
        const expectedPosition: IPoint = {
            x: 51,
            y: 73,
        };
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="rect" coords="0,0,82,126" alt="Sun" href="sun.htm">
                    </map>
                `);
        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;

        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupGetContainerOffset(10)
            .setupGetContainerSizeNeverCall()
            .build();

        setupDefaultWindowUtilsMock();
        setupDefaultTabbableElementsHelperMock(area, map, img);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toEqual(expectedPosition);

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: invalid area', () => {
        const expectedPosition: IPoint = {
            x: 10,
            y: 10,
        };
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap">
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="invalid" coords="0,0,82,126" alt="Sun" href="sun.htm">
                    </map>
                `);
        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;

        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupGetContainerOffset(10)
            .setupGetContainerSizeNeverCall()
            .build();

        setupDefaultWindowUtilsMock();
        setupDefaultTabbableElementsHelperMock(area, map, img);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toEqual(expectedPosition);

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition outside of doc', () => {
        const element = document.createElement('div');

        const drawerUtilsMock = new DrawerUtilsMockBuilder(documentMock, styleStub)
            .setupIsOutsideOfDocument(true)
            .setupGetContainerOffsetNeverCall()
            .build();

        setupDefaultWindowUtilsMock();

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(element)).toBeNull();

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: no coords', () => {
        const expectedPosition: IPoint = {
            x: 20,
            y: 20,
        };
        const dom = TestDocumentCreator.createTestDocument(`
                    <img id="img1" src="planets.gif" width="145" height="126" alt="Planets" usemap="#planetmap"/>
                    <map id="map1" name="planetmap">
                        <area id="id1" shape="default" alt="Venus" href="venus.htm"/>
                    </map>
                `);
        const img: HTMLImageElement = dom.querySelector('#img1') as HTMLImageElement;
        const area: HTMLElement = dom.querySelector('#id1') as HTMLElement;
        const map: HTMLMapElement = dom.querySelector('#map1') as HTMLMapElement;

        setupDefaultWindowUtilsMock();

        const drawerUtilsMock = new DrawerUtilsMockBuilder(dom, styleStub)
            .setupGetContainerOffset(20)
            .setupGetContainerSize(4)
            .build();

        setupDefaultTabbableElementsHelperMock(area, map, img);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(area)).toEqual(expectedPosition);

        drawerUtilsMock.verifyAll();
        windowUtilsMock.verifyAll();
    });

    test('getElementCenterPosition: handles null element', () => {
        const drawerUtilsMock = Mock.ofType(DrawerUtils, MockBehavior.Strict);

        const centerPositionCalculator = createCenterPositionCalculator(drawerUtilsMock.object);

        expect(centerPositionCalculator.getElementCenterPosition(null)).toBeNull();

        drawerUtilsMock.verifyAll();
    });

    function setupDefaultWindowUtilsMock(): void {
        windowUtilsMock
            .setup(w => w.getComputedStyle(bodyStub as any))
            .returns(() => styleStub as any);
        windowUtilsMock
            .setup(w => w.getComputedStyle(documentMock.documentElement))
            .returns(() => styleStub as any);
    }

    function setupDefaultTabbableElementsHelperMock(
        area: HTMLElement,
        map: HTMLMapElement,
        img: HTMLImageElement,
    ): void {
        tabbableElementsHelperMock.setup(t => t.getAncestorMap(area)).returns(() => map);
        tabbableElementsHelperMock.setup(t => t.getMappedImage(map)).returns(() => img);
    }
});
