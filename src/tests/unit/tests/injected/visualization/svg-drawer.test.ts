// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { TabbedElementData } from 'common/types/store-data/visualization-scan-result-data';
import {
    AssessmentVisualizationInstance,
    TabStopVisualizationInstance,
} from 'injected/frameCommunicators/html-element-axe-results-helper';
import { IMock, It, Mock, Times } from 'typemoq';

import { getDefaultFeatureFlagsWeb } from '../../../../../common/feature-flags';
import { WindowUtils } from '../../../../../common/window-utils';
import { ShadowUtils } from '../../../../../injected/shadow-utils';
import { CenterPositionCalculator } from '../../../../../injected/visualization/center-position-calculator';
import { DrawerInitData } from '../../../../../injected/visualization/drawer';
import { FocusIndicator } from '../../../../../injected/visualization/focus-indicator';
import { SVGDrawerConfiguration } from '../../../../../injected/visualization/formatter';
import { SVGNamespaceUrl } from '../../../../../injected/visualization/svg-constants';
import { SVGDrawer } from '../../../../../injected/visualization/svg-drawer';
import { SVGShapeFactory } from '../../../../../injected/visualization/svg-shape-factory';
import { SVGSolidShadowFilterFactory } from '../../../../../injected/visualization/svg-solid-shadow-filter-factory';
import { TabStopsFormatter } from '../../../../../injected/visualization/tab-stops-formatter';
import { TabbedItem, TabbedItemType } from '../../../../../injected/visualization/tabbed-item';
import { TestDocumentCreator } from '../../../common/test-document-creator';
import { DrawerUtilsMockBuilder } from './drawer-utils-mock-builder';

describe('SVGDrawer', () => {
    let fakeDocument: Document;
    let svgShapeFactoryMock: IMock<SVGShapeFactory>;
    let formatterMock: IMock<TabStopsFormatter>;
    let shadowUtilsMock: IMock<ShadowUtils>;
    let shadowContainer: HTMLElement;
    let windowUtilsMock: IMock<WindowUtils>;
    let filterFactoryMock: IMock<SVGSolidShadowFilterFactory>;
    let centerPositionCalculatorMock: IMock<CenterPositionCalculator>;
    const styleStub = {
        overflowX: 100,
        overflowY: 100,
    };
    const containerClass = 'svg-drawer-test';

    beforeEach(() => {
        fakeDocument = TestDocumentCreator.createTestDocument();
        windowUtilsMock = Mock.ofType(WindowUtils);
        filterFactoryMock = Mock.ofType(SVGSolidShadowFilterFactory);
        centerPositionCalculatorMock = Mock.ofType(CenterPositionCalculator);
        formatterMock = Mock.ofType(TabStopsFormatter);
        svgShapeFactoryMock = Mock.ofType(SVGShapeFactory);
        shadowUtilsMock = Mock.ofType(ShadowUtils);
        shadowContainer = fakeDocument.createElement('div');
        shadowUtilsMock.setup(x => x.getShadowContainer()).returns(() => shadowContainer);
    });

    function createDrawerInfo(
        elementResults: AssessmentVisualizationInstance[] | null,
    ): DrawerInitData {
        return {
            data: elementResults,
            featureFlagStoreData: getDefaultFeatureFlagsWeb(),
        };
    }

    test('initialize', () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
            <div id='id3'></div>
        `;

        const expectedAllVisualizedItems: TabbedItem[] = [
            {
                element: fakeDocument.querySelector('#id1'),
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id1',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: fakeDocument.querySelector('#id2'),
                tabOrder: undefined,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id2',
                itemType: TabbedItemType.MissingItem,
                isFailure: true,
            },
            {
                element: fakeDocument.querySelector('#id3'),
                tabOrder: 2,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id3',
                itemType: undefined,
                isFailure: true,
            },
        ];
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: {},
                itemType: TabbedItemType.MissingItem,
            },
            {
                target: ['#id3'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub).build();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            null,
            null,
            null,
            null,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect((testSubject as any).allVisualizedItems).toEqual(expectedAllVisualizedItems);
        drawerUtilsMock.verifyAll();
    });

    test('initialize with TabbedElementData element', () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";

        const element = fakeDocument.querySelector('#id1');
        const expectedAllVisualizedItems: TabbedItem[] = [
            {
                element: element,
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id1',
                itemType: undefined,
                isFailure: undefined,
            },
        ];
        const tabbedElements: TabbedElementData[] = [
            {
                tabOrder: 1,
                timestamp: 60,
                html: 'test',
                target: ['#id1'],
                instanceId: 'some instance id',
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub).build();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            null,
            null,
            null,
            null,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements as any));
        expect((testSubject as any).allVisualizedItems).toEqual(expectedAllVisualizedItems);
        drawerUtilsMock.verifyAll();
    });

    test('initialize: validate existing elements should not redraw', () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
            <div id='id3'></div>
        `;

        const element1 = fakeDocument.querySelector('#id1');
        const element2 = fakeDocument.querySelector('#id2');

        const existingTabbedElements: TabbedItem[] = [
            {
                element: element1,
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id1',
                isFailure: false,
                itemType: undefined,
            },
        ];

        const expectedAllVisualizedItems: TabbedItem[] = [
            {
                element: element1,
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: false,
                selector: '#id1',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element2,
                tabOrder: 2,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id2',
                itemType: undefined,
                isFailure: false,
            },
        ];

        const newInstances: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub).build();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            null,
            null,
            null,
            null,
        );

        (testSubject as any).allVisualizedItems = existingTabbedElements;
        testSubject.initialize(createDrawerInfo(newInstances));
        expect((testSubject as any).allVisualizedItems).toEqual(expectedAllVisualizedItems);
        drawerUtilsMock.verifyAll();
    });

    test('initialize: redraw element 2 which was the last tab ordered item but not the last visualized item', () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
            <div id='id3'></div>
            <div id='id4'></div>
        `;

        const element1 = fakeDocument.querySelector('#id1');
        const element2 = fakeDocument.querySelector('#id2');
        const element3 = fakeDocument.querySelector('#id3');
        const element4 = fakeDocument.querySelector('#id4');

        const expectedAllVisualizedItems: TabbedItem[] = [
            {
                element: element1,
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: false,
                selector: '#id1',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element2,
                tabOrder: 2,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id2',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element3,
                tabOrder: undefined,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id3',
                itemType: undefined,
                isFailure: true,
            },
            {
                element: element4,
                tabOrder: 3,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id4',
                itemType: undefined,
                isFailure: false,
            },
        ];

        const initialInstances: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
            {
                target: ['#id3'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: {},
            },
        ];

        const newInstances = [
            ...initialInstances,
            {
                target: ['#id4'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 3 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub).build();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            null,
            null,
            null,
            null,
        );

        testSubject.initialize(createDrawerInfo(initialInstances));
        testSubject.initialize(createDrawerInfo(newInstances));
        expect((testSubject as any).allVisualizedItems).toEqual(expectedAllVisualizedItems);
        drawerUtilsMock.verifyAll();
    });

    test('initialize: verify tab order change', () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
            <div id='id3'></div>
            <div id='id4'></div>
        `;

        const element1 = fakeDocument.querySelector('#id1');
        const element2 = fakeDocument.querySelector('#id2');
        const element3 = fakeDocument.querySelector('#id3');
        const element4 = fakeDocument.querySelector('#id4');

        const existingTabbedElements: TabbedItem[] = [
            {
                element: element1,
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id1',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element3,
                tabOrder: 2,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id3',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element4,
                tabOrder: 3,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id4',
                itemType: undefined,
                isFailure: false,
            },
        ];

        const expectedAllVisualizedItems: TabbedItem[] = [
            {
                element: element1,
                tabOrder: 1,
                focusIndicator: undefined,
                shouldRedraw: false,
                selector: '#id1',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element2,
                tabOrder: 2,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id2',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element3,
                tabOrder: 3,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id3',
                itemType: undefined,
                isFailure: false,
            },
            {
                element: element4,
                tabOrder: 4,
                focusIndicator: undefined,
                shouldRedraw: true,
                selector: '#id4',
                itemType: undefined,
                isFailure: false,
            },
        ];

        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
            {
                target: ['#id3'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 3 },
            },
            {
                target: ['#id4'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 4 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub).build();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            null,
            null,
            null,
            null,
        );

        (testSubject as any).allVisualizedItems = existingTabbedElements;

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect((testSubject as any).allVisualizedItems).toEqual(expectedAllVisualizedItems);
        drawerUtilsMock.verifyAll();
    });

    test('removeFocusIndicator', () => {
        const removeMock = Mock.ofInstance(() => {});
        const focusIndicatorMock: FocusIndicator = {
            circle: {
                remove: removeMock.object,
            } as any,
            line: {
                remove: removeMock.object,
            } as any,
            tabIndexLabel: {
                remove: removeMock.object,
            } as any,
            failureLabel: {
                remove: removeMock.object,
            } as any,
        };
        removeMock.setup(r => r()).verifiable(Times.exactly(4));

        const testSubject = new SVGDrawer(
            null,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            null,
            null,
            null,
            null,
            null,
        );

        (testSubject as any).removeFocusIndicator(focusIndicatorMock);

        removeMock.verifyAll();
    });

    test('svg has proper size and a filter child (inside a defs child)', async () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";
        const element = fakeDocument.querySelector<HTMLElement>('#id1');
        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig();
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
        ];
        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();

        setupFilterFactoryDefault(fakeDocument);
        setupWindowUtilsMockDefault(styleStub);

        formatterMock
            .setup(f => f.getDrawerConfiguration(element, null))
            .returns(() => drawerConfig)
            .verifiable();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));

        await testSubject.drawLayout();

        const svg = shadowContainer.querySelector('svg');

        expect(svg).toBeDefined();

        const svgHeight = svg.getAttribute('height');
        expect(svgHeight).toBe('100px');

        const svgWidth = svg.getAttribute('width');
        expect(svgWidth).toBe('100px');

        const defs = svg.querySelector('defs');

        expect(defs).toBeDefined();

        const filter = defs.querySelector('filter');

        expect(filter).toBeDefined();

        drawerUtilsMock.verifyAll();
    });

    test('verify focus indicator drawn on the first tabbable element', async () => {
        fakeDocument.body.innerHTML = "<div id='id1'></div>";

        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig();
        const element = fakeDocument.querySelector<HTMLElement>('#id1');
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();
        setupWindowUtilsMockDefault(styleStub);
        setupFilterFactoryDefault(fakeDocument);
        setupCenterPositionCalculatorDefault();
        setupSVGshapeFactoryDefault(fakeDocument);
        formatterMock
            .setup(f => f.getDrawerConfiguration(element, null))
            .returns(() => drawerConfig)
            .verifiable();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect(testSubject.isOverlayEnabled).toBe(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        const circles = findFocusIndicatorCircles();
        const lines = findFocusIndicatorLines();
        const labels = findFocusIndicatorLabels();

        drawerUtilsMock.verifyAll();
        expect(circles.length).toBe(1);
        expect(lines.length).toBe(0);
        expect(labels.length).toBe(0);
    });

    test('draw circles with line in between without solid focus line and tab index label', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig(false, false);
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();
        setupWindowUtilsMockDefault(styleStub);
        setupFilterFactoryDefault(fakeDocument);
        setupCenterPositionCalculatorDefault();
        setupSVGshapeFactoryDefault(fakeDocument);
        formatterMock
            .setup(f => f.getDrawerConfiguration(It.isAny(), null))
            .returns(() => drawerConfig)
            .verifiable();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect(testSubject.isOverlayEnabled).toBe(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        const circles = findFocusIndicatorCircles();
        const lines = findFocusIndicatorLines();
        const labels = findFocusIndicatorLabels();

        drawerUtilsMock.verifyAll();

        expect(circles.length).toBe(2);
        expect(lines.length).toBe(1);
        expect(labels.length).toBe(0);
    });

    test('draw circles with line in between with solid line and tab index label', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        // pass true or false in createTestDrawingConfig falseto set showDetailedTabOrder parameter in config
        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig();
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();
        setupWindowUtilsMockDefault(styleStub);
        setupFilterFactoryDefault(fakeDocument);
        setupCenterPositionCalculatorDefault();
        setupSVGshapeFactoryDefault(fakeDocument);
        formatterMock
            .setup(f => f.getDrawerConfiguration(It.isAny(), null))
            .returns(() => drawerConfig)
            .verifiable();
        centerPositionCalculatorMock
            .setup(c => c.getElementCenterPosition(fakeDocument.getElementById('id1')))
            .returns(element => null)
            .verifiable();
        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect(testSubject.isOverlayEnabled).toBe(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        const circles = findFocusIndicatorCircles();
        const lines = findFocusIndicatorLines();
        const labels = findFocusIndicatorLabels();

        drawerUtilsMock.verifyAll();

        expect(circles.length).toBe(2);
        expect(lines.length).toBe(0);
        expect(labels.length).toBe(1);
    });

    test('draw circles with failures', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
            <div id='id3'></div>
            <div id='id4'></div>
            <div id='id5'></div>
        `;

        // pass true or false in createTestDrawingConfig falseto set showDetailedTabOrder parameter in config
        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig();
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                itemType: TabbedItemType.MissingItem,
                propertyBag: {},
            },
            {
                target: ['#id3'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
            {
                target: ['#id4'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 3 },
                itemType: TabbedItemType.ErroredItem,
            },
            {
                target: ['#id5'],
                requirementResults: null,
                isFailure: true,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: {},
                itemType: TabbedItemType.ErroredItem,
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();
        setupWindowUtilsMockDefault(styleStub);
        setupFilterFactoryDefault(fakeDocument);
        setupCenterPositionCalculatorDefault();
        setupSVGshapeFactoryDefault(fakeDocument);
        formatterMock
            .setup(f => f.getDrawerConfiguration(It.isAny(), null))
            .returns(() => drawerConfig)
            .verifiable();
        centerPositionCalculatorMock
            .setup(c => c.getElementCenterPosition(fakeDocument.getElementById('id1')))
            .returns(element => null)
            .verifiable();
        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect(testSubject.isOverlayEnabled).toBe(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        const circles = findFocusIndicatorCircles();
        const lines = findFocusIndicatorLines();
        const labels = findFocusIndicatorLabels();
        const failureLabels = findFailureLabels();

        drawerUtilsMock.verifyAll();

        expect(circles.length).toBe(4);
        expect(lines.length).toBe(1);
        expect(labels.length).toBe(4);
        expect(failureLabels.length).toBe(3);
    });

    test('break graph', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig();
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 3 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();
        setupWindowUtilsMockDefault(styleStub);
        setupFilterFactoryDefault(fakeDocument);
        setupCenterPositionCalculatorDefault();
        setupSVGshapeFactoryDefault(fakeDocument);
        formatterMock
            .setup(f => f.getDrawerConfiguration(It.isAny(), null))
            .returns(() => drawerConfig)
            .verifiable();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect(testSubject.isOverlayEnabled).toBe(false);

        await testSubject.drawLayout();

        expect(testSubject.isOverlayEnabled).toBe(true);

        const circles = findFocusIndicatorCircles();
        const lines = findFocusIndicatorLines();
        const labels = findFocusIndicatorLabels();

        drawerUtilsMock.verifyAll();

        expect(circles.length).toBe(2);
        expect(lines.length).toBe(0);
        expect(labels.length).toBe(1);
    });

    test('eraseLayout', async () => {
        fakeDocument.body.innerHTML = `
            <div id='id1'></div>
            <div id='id2'></div>
        `;

        const drawerConfig: SVGDrawerConfiguration = createTestDrawingConfig();
        const tabbedElements: TabStopVisualizationInstance[] = [
            {
                target: ['#id1'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 1 },
            },
            {
                target: ['#id2'],
                requirementResults: null,
                isFailure: false,
                isVisualizationEnabled: false,
                ruleResults: null,
                propertyBag: { tabOrder: 2 },
            },
        ];

        const drawerUtilsMock = new DrawerUtilsMockBuilder(fakeDocument, styleStub)
            .setupGetDocSize(100)
            .build();
        setupWindowUtilsMockDefault(styleStub);
        setupFilterFactoryDefault(fakeDocument);
        setupCenterPositionCalculatorDefault();
        setupSVGshapeFactoryDefault(fakeDocument);
        formatterMock
            .setup(f => f.getDrawerConfiguration(It.isAny(), null))
            .returns(() => drawerConfig)
            .verifiable();

        const testSubject = new SVGDrawer(
            fakeDocument,
            containerClass,
            windowUtilsMock.object,
            shadowUtilsMock.object,
            drawerUtilsMock.object,
            formatterMock.object,
            centerPositionCalculatorMock.object,
            filterFactoryMock.object,
            svgShapeFactoryMock.object,
        );

        testSubject.initialize(createDrawerInfo(tabbedElements));
        expect(testSubject.isOverlayEnabled).toBeFalsy();

        await testSubject.drawLayout();
        expect(testSubject.isOverlayEnabled).toBe(true);
        testSubject.eraseLayout();

        expect(testSubject.isOverlayEnabled).toBeFalsy();

        const circles = findFocusIndicatorCircles();
        const lines = findFocusIndicatorLines();
        const labels = findFocusIndicatorLabels();

        drawerUtilsMock.verifyAll();

        expect(circles.length).toBe(0);
        expect(lines.length).toBe(0);
        expect(labels.length).toBe(0);
    });

    function createTestDrawingConfig(
        showSolidFocusLine = true,
        showTabIndexedLabel = true,
    ): SVGDrawerConfiguration {
        const drawerConfig: SVGDrawerConfiguration = {
            circle: {
                stroke: '#777777',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: '16',
            },
            focusedCircle: {
                stroke: '#C71585',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: '16',
            },
            erroredCircle: {
                stroke: '#E81123',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: '16',
            },
            missingCircle: {
                stroke: '#E81123',
                strokeWidth: '2',
                fill: '#ffffff',
                ellipseRy: '16',
                ellipseRx: '16',
                strokeDasharray: '2 2',
            },
            tabIndexLabel: {
                fontColor: '#000000',
                textAnchor: 'middle',
                showTabIndexedLabel: showTabIndexedLabel,
            },
            erroredTabIndexLabel: {
                fontColor: '#E81123',
                textAnchor: 'middle',
                showTabIndexedLabel: true,
            },
            line: {
                stroke: '#777777',
                strokeWidth: '2',
                showSolidFocusLine: showSolidFocusLine,
            },
            focusedLine: {
                stroke: '#C71585',
                strokeWidth: '3',
                strokeDasharray: '7 3',
            },
            failureBoxConfig: {
                background: '#E81123',
                fontColor: '#FFFFFF',
                text: '!',
                boxWidth: '10px',
                fontSize: '10',
            },
        };

        return drawerConfig;
    }

    function findFocusIndicatorLines(): NodeListOf<Element> {
        const lines = shadowContainer.querySelectorAll('.insights-svg-line');
        return lines;
    }

    function findFocusIndicatorCircles(): NodeListOf<Element> {
        const circles = shadowContainer.querySelectorAll('.insights-svg-focus-indicator');
        return circles;
    }

    function findFocusIndicatorLabels(): NodeListOf<Element> {
        const labels = shadowContainer.querySelectorAll('.insights-svg-focus-indicator-text');
        return labels;
    }

    function findFailureLabels(): NodeListOf<Element> {
        const labels = shadowContainer.querySelectorAll('.insights-svg-failure-label');
        return labels;
    }

    function setupCenterPositionCalculatorDefault(): void {
        centerPositionCalculatorMock
            .setup(c => c.getElementCenterPosition(It.isAny()))
            .returns(element => {
                return {
                    x: 100,
                    y: 100,
                };
            });
    }

    function setupWindowUtilsMockDefault(style): void {
        const windowMock = {};

        windowUtilsMock.setup(it => it.getComputedStyle(It.isAny())).returns(() => style as any);

        windowUtilsMock
            .setup(w => w.getTopWindow())
            .returns(() => {
                return windowMock as any;
            });

        windowUtilsMock
            .setup(w => w.getWindow())
            .returns(() => {
                return windowMock as any;
            });
    }

    function setupFilterFactoryDefault(dom): void {
        filterFactoryMock
            .setup(f => f.createFilter())
            .returns(() => {
                const doc = dom.ownerDocument || (dom as Document);
                const filter = doc.createElementNS(SVGNamespaceUrl, 'filter');
                return filter;
            })
            .verifiable();
    }

    function setupSVGshapeFactoryDefault(dom): void {
        const doc = dom.ownerDocument || (dom as Document);
        svgShapeFactoryMock
            .setup(s => s.createCircle(It.isAny(), It.isAny()))
            .returns(() => {
                const circle = doc.createElementNS(SVGNamespaceUrl, 'ellipse');
                circle.setAttributeNS(null, 'class', 'insights-svg-focus-indicator');
                return circle;
            });

        svgShapeFactoryMock
            .setup(s => s.createLine(It.isAny(), It.isAny(), It.isAny(), It.isAny(), It.isAny()))
            .returns(() => {
                const line = doc.createElementNS(SVGNamespaceUrl, 'line');
                line.setAttributeNS(null, 'class', 'insights-svg-line');
                return line;
            });

        svgShapeFactoryMock
            .setup(s => s.createTabIndexLabel(It.isAny(), It.isAny(), It.isAny()))
            .returns((center, config, tabOrder) => {
                const text = doc.createElementNS(SVGNamespaceUrl, 'text');
                text.setAttributeNS(null, 'class', 'insights-svg-focus-indicator-text');
                text.innerHTML = `<span>${tabOrder}</span>`;
                return text;
            });

        svgShapeFactoryMock
            .setup(s => s.createFailureLabel(It.isAny(), It.isAny()))
            .returns(() => {
                const label = doc.createElementNS(SVGNamespaceUrl, 'text');
                label.setAttributeNS(null, 'class', 'insights-svg-failure-label');
                return label;
            });
    }
});
