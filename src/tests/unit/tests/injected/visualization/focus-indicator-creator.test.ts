// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CenterPositionCalculator } from 'injected/visualization/center-position-calculator';
import { FocusIndicator } from 'injected/visualization/focus-indicator';
import { FocusIndicatorCreator } from 'injected/visualization/focus-indicator-creator';
import {
    CircleConfiguration,
    Formatter,
    StrokeConfiguration,
    SVGDrawerConfiguration,
    TextConfiguration,
    FailureBoxConfig,
} from 'injected/visualization/formatter';
import { Point } from 'injected/visualization/point';
import { SVGShapeFactory } from 'injected/visualization/svg-shape-factory';
import { SVGSolidShadowFilterFactory } from 'injected/visualization/svg-solid-shadow-filter-factory';
import { TabbedItem, TabbedItemType } from 'injected/visualization/tabbed-item';
import { IMock, It, Mock } from 'typemoq';

describe('FocusIndicatorCreator', () => {
    let centerPositionCalculatorMock: IMock<CenterPositionCalculator>;
    let svgShapeFactoryMock: IMock<SVGShapeFactory>;
    let filterFactoryMock: IMock<SVGSolidShadowFilterFactory>;
    let formatterMock: IMock<Formatter>;

    let testSubject: FocusIndicatorCreator;

    beforeEach(() => {
        centerPositionCalculatorMock = Mock.ofType(CenterPositionCalculator);
        svgShapeFactoryMock = Mock.ofType(SVGShapeFactory);
        filterFactoryMock = Mock.ofType(SVGSolidShadowFilterFactory);
        formatterMock = Mock.ofType<Formatter>();

        testSubject = new FocusIndicatorCreator(
            centerPositionCalculatorMock.object,
            svgShapeFactoryMock.object,
            filterFactoryMock.object,
        );
    });

    describe('createFocusIndicator', () => {
        test('center position is null', () => {
            const tabbedItems = [{}] as TabbedItem[];
            const index = 0;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(It.isAny()))
                .returns(() => null);

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, true, null),
            ).toBeUndefined();
        });

        test('for one tab item without any previous item', () => {
            const elementStub = {} as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                },
            ] as TabbedItem[];
            const index = 0;
            const pointStub = { x: 123 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: null,
                tabIndexLabel: null,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.focusedCircle);

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for the last tabbed item that has a connecting previous item', () => {
            const elementStub = { innerHTML: 'first element' } as Element;
            const elementTwoStub = { innerHTML: 'second element' } as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                    tabOrder: 0,
                },
                {
                    element: elementTwoStub,
                    tabOrder: 1,
                },
            ] as TabbedItem[];
            const index = 1;
            const pointStub = { x: 123 } as Point;
            const elementTwoPointStub = { x: 456 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedLine = {
                innerHTML: 'expected line',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: expectedLine,
                tabIndexLabel: null,
            } as FocusIndicator;
            const filterIdStub = 'some filter id';

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementTwoStub))
                .returns(() => elementTwoPointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementTwoStub, drawerConfig);
            setupExpectedCircle(expectedCircle, elementTwoPointStub, drawerConfig.focusedCircle);
            setupExpectedLine(
                expectedLine,
                pointStub,
                elementTwoPointStub,
                drawerConfig.focusedLine,
                filterIdStub,
                drawerConfig.focusedCircle.ellipseRx,
            );

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a tab item with a large jump between tab order from the previous item', () => {
            const elementStub = { innerHTML: 'first element' } as Element;
            const elementTwoStub = { innerHTML: 'second element' } as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                    tabOrder: 0,
                },
                {
                    element: elementTwoStub,
                    tabOrder: 100000,
                },
            ] as TabbedItem[];
            const index = 1;
            const elementTwoPointStub = { x: 456 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: null,
                tabIndexLabel: null,
            } as FocusIndicator;
            const filterIdStub = 'some filter id';

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementTwoStub))
                .returns(() => elementTwoPointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementTwoStub, drawerConfig);
            setupExpectedCircle(expectedCircle, elementTwoPointStub, drawerConfig.focusedCircle);

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for the first tabbed item in an array of many tabbed items', () => {
            const elementStub = { innerHTML: 'first element' } as Element;
            const elementTwoStub = { innerHTML: 'second element' } as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                    tabOrder: 0,
                },
                {
                    element: elementTwoStub,
                    tabOrder: 1,
                },
            ] as TabbedItem[];
            const index = 0;
            const pointStub = { x: 123 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: null,
                tabIndexLabel: null,
            } as FocusIndicator;
            const filterIdStub = 'some filter id';

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.focusedCircle);

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a tab item where the previous tab item center position is null', () => {
            const elementStub = { innerHTML: 'first element' } as Element;
            const elementTwoStub = { innerHTML: 'second element' } as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                    tabOrder: 0,
                },
                {
                    element: elementTwoStub,
                    tabOrder: 1,
                },
            ] as TabbedItem[];
            const index = 1;
            const elementTwoPointStub = { x: 456 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: null,
                tabIndexLabel: null,
            } as FocusIndicator;
            const filterIdStub = 'some filter id';

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => null);

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementTwoStub))
                .returns(() => elementTwoPointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementTwoStub, drawerConfig);
            setupExpectedCircle(expectedCircle, elementTwoPointStub, drawerConfig.focusedCircle);

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a non-last tab item where the config specifies showSolidFocusLine to be false', () => {
            const elementStub = { innerHTML: 'first element' } as Element;
            const elementTwoStub = { innerHTML: 'second element' } as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                    tabOrder: 0,
                },
                {
                    element: elementTwoStub,
                    tabOrder: 1,
                },
                {
                    tabOrder: 2,
                },
            ] as TabbedItem[];
            const index = 1;
            const pointStub = { x: 123 } as Point;
            const elementTwoPointStub = { x: 456 } as Point;
            const drawerConfig = getDrawerConfigStub(false, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedLabel = {
                innerHTML: 'expected label',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: null,
                tabIndexLabel: expectedLabel,
            } as FocusIndicator;
            const filterIdStub = 'some filter id';

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementTwoStub))
                .returns(() => elementTwoPointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementTwoStub, drawerConfig);
            setupExpectedCircle(expectedCircle, elementTwoPointStub, drawerConfig.circle);
            setupExpectedLabel(
                expectedLabel,
                elementTwoPointStub,
                drawerConfig.tabIndexLabel,
                tabbedItems[index].tabOrder.toString(),
            );

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, false, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a non-last tab item where the config specifies showTabIndexedLabel to be false', () => {
            const elementStub = { innerHTML: 'first element' } as Element;
            const elementTwoStub = { innerHTML: 'second element' } as Element;
            const tabbedItems = [
                {
                    element: elementStub,
                    tabOrder: 0,
                },
                {
                    element: elementTwoStub,
                    tabOrder: 1,
                },
                {
                    tabOrder: 2,
                },
            ] as TabbedItem[];
            const index = 1;
            const pointStub = { x: 123 } as Point;
            const elementTwoPointStub = { x: 456 } as Point;
            const drawerConfig = getDrawerConfigStub(true, false);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedLine = {
                innerHTML: 'expected line',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: expectedLine,
                tabIndexLabel: null,
            } as FocusIndicator;
            const filterIdStub = 'some filter id';

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementTwoStub))
                .returns(() => elementTwoPointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementTwoStub, drawerConfig);
            setupExpectedCircle(expectedCircle, elementTwoPointStub, drawerConfig.circle);
            setupExpectedLine(
                expectedLine,
                pointStub,
                elementTwoPointStub,
                drawerConfig.line,
                filterIdStub,
                drawerConfig.circle.ellipseRx,
            );

            expect(
                testSubject.createFocusIndicator(tabbedItems, index, false, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });
    });

    describe('createFocusIndicatorForFailure', () => {
        test('centerPosition of element is null', () => {
            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(It.isAny()))
                .returns(() => null);

            expect(
                testSubject.createFocusIndicatorForFailure({} as TabbedItem, null),
            ).toBeUndefined();
        });

        test('for tab item with a non ErroredItem item type', () => {
            const elementStub = {} as Element;
            const item = {
                element: elementStub,
            } as TabbedItem;
            const pointStub = { x: 123 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedTabIndexLabel = {
                innerHTML: 'expected tab index label',
            } as Element;
            const expectedFailureLabel = {
                innerHTML: 'expected failure label',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                tabIndexLabel: expectedTabIndexLabel,
                failureLabel: expectedFailureLabel,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.missingCircle);
            setupExpectedLabel(
                expectedTabIndexLabel,
                pointStub,
                drawerConfig.erroredTabIndexLabel,
                'X',
            );
            setupExpectedFailureLabel(
                expectedFailureLabel,
                pointStub,
                drawerConfig.failureBoxConfig,
            );

            expect(testSubject.createFocusIndicatorForFailure(item, formatterMock.object)).toEqual(
                expectedFocusIndicator,
            );
        });

        test('for tab item with an ErroredItem item type and no tab order', () => {
            const elementStub = {} as Element;
            const item = {
                element: elementStub,
                itemType: TabbedItemType.ErroredItem,
            } as TabbedItem;
            const pointStub = { x: 123 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedTabIndexLabel = {
                innerHTML: 'expected tab index label',
            } as Element;
            const expectedFailureLabel = {
                innerHTML: 'expected failure label',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                tabIndexLabel: expectedTabIndexLabel,
                failureLabel: expectedFailureLabel,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.erroredCircle);
            setupExpectedLabel(
                expectedTabIndexLabel,
                pointStub,
                drawerConfig.erroredTabIndexLabel,
                '',
            );
            setupExpectedFailureLabel(
                expectedFailureLabel,
                pointStub,
                drawerConfig.failureBoxConfig,
            );

            expect(testSubject.createFocusIndicatorForFailure(item, formatterMock.object)).toEqual(
                expectedFocusIndicator,
            );
        });

        test('for tab item with an ErroredItem item type and has tab order', () => {
            const elementStub = {} as Element;
            const tabOrder = 1;
            const item = {
                element: elementStub,
                itemType: TabbedItemType.ErroredItem,
                tabOrder,
            } as TabbedItem;
            const pointStub = { x: 123 } as Point;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedCircle = {
                innerHTML: 'expected circle',
            } as Element;
            const expectedTabIndexLabel = {
                innerHTML: 'expected tab index label',
            } as Element;
            const expectedFailureLabel = {
                innerHTML: 'expected failure label',
            } as Element;
            const expectedFocusIndicator = {
                circle: expectedCircle,
                tabIndexLabel: expectedTabIndexLabel,
                failureLabel: expectedFailureLabel,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.erroredCircle);
            setupExpectedLabel(
                expectedTabIndexLabel,
                pointStub,
                drawerConfig.erroredTabIndexLabel,
                tabOrder.toString(),
            );
            setupExpectedFailureLabel(
                expectedFailureLabel,
                pointStub,
                drawerConfig.failureBoxConfig,
            );

            expect(testSubject.createFocusIndicatorForFailure(item, formatterMock.object)).toEqual(
                expectedFocusIndicator,
            );
        });
    });

    function setupDrawerConfig(element: Element, drawerConfig: SVGDrawerConfiguration) {
        formatterMock
            .setup(m => m.getDrawerConfiguration(element, null))
            .returns(() => drawerConfig);
    }

    function setupExpectedCircle(
        returnedCircle: Element,
        elementPosition: Point,
        circleConfiguration: CircleConfiguration,
    ) {
        svgShapeFactoryMock
            .setup(m => m.createCircle(elementPosition, circleConfiguration))
            .returns(() => returnedCircle);
    }

    function setupExpectedLabel(
        returnedLabel: Element,
        elementPosition: Point,
        labelConfiguration: TextConfiguration,
        tabOrder: string,
    ) {
        svgShapeFactoryMock
            .setup(m => m.createTabIndexLabel(elementPosition, labelConfiguration, tabOrder))
            .returns(() => returnedLabel);
    }

    function setupExpectedFailureLabel(
        returnedLabel: Element,
        elementPosition: Point,
        failureBoxConfig: FailureBoxConfig,
    ) {
        svgShapeFactoryMock
            .setup(m => m.createFailureLabel(elementPosition, failureBoxConfig))
            .returns(() => returnedLabel);
    }

    function setupExpectedLine(
        returnedLine: Element,
        prevElementPosition: Point,
        elementPosition: Point,
        lineConfiguration: StrokeConfiguration,
        filterId: string,
        ellipseRx: string,
    ) {
        svgShapeFactoryMock
            .setup(m =>
                m.createLine(
                    prevElementPosition,
                    elementPosition,
                    lineConfiguration,
                    filterId,
                    parseFloat(ellipseRx),
                ),
            )
            .returns(() => returnedLine);
    }

    function getDrawerConfigStub(
        showSolidFocusLine: boolean,
        showTabIndexedLabel: boolean,
    ): SVGDrawerConfiguration {
        return {
            focusedCircle: {
                fill: 'some focusedCircle fill',
                ellipseRx: '10',
            },
            missingCircle: {
                fill: 'some missingCircle fill',
                ellipseRx: '11',
            },
            erroredCircle: {
                fill: 'some erroredCircle fill',
                ellipseRx: '12',
            },
            circle: {
                fill: 'some circle fill',
                ellipseRx: '13',
            },
            tabIndexLabel: {
                fontColor: 'some tabIndexLabel font color',
                showTabIndexedLabel,
            },
            erroredTabIndexLabel: {
                fontColor: 'some erroredTabIndexLabel font color',
            },
            line: {
                showSolidFocusLine,
                stroke: 'some line stroke',
            },
            focusedLine: {
                stroke: 'some focusedLine stroke',
            },
            failureBoxConfig: {
                text: 'some failureBoxConfig text',
            },
        } as SVGDrawerConfiguration;
    }
});
