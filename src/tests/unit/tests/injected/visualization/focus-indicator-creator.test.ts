// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CenterPositionCalculator } from 'injected/visualization/center-position-calculator';
import { FocusIndicator } from 'injected/visualization/focus-indicator';
import { FocusIndicatorCreator } from 'injected/visualization/focus-indicator-creator';
import {
    CircleConfiguration,
    FailureBoxConfig,
    Formatter,
    StrokeConfiguration,
    SVGDrawerConfiguration,
    TextConfiguration,
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

    let elementStub: Element;
    let elementTwoStub: Element;
    let itemOne: TabbedItem;
    let itemTwo: TabbedItem;
    let pointStub: Point;
    let elementTwoPointStub: Point;
    let expectedCircle: Element;
    let expectedLabel: Element;
    let expectedLine: Element;
    let expectedFailureLabel: Element;
    let filterIdStub: string;

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

        elementStub = { innerHTML: 'first element' } as Element;
        elementTwoStub = { innerHTML: 'second element' } as Element;
        itemOne = {
            element: elementStub,
            tabOrder: 0,
        } as TabbedItem;
        itemTwo = {
            element: elementTwoStub,
            tabOrder: 1,
        };
        pointStub = { x: 123 } as Point;
        elementTwoPointStub = { x: 456 } as Point;
        expectedCircle = {
            innerHTML: 'expected circle',
        } as Element;
        filterIdStub = 'some filter id';
        expectedLabel = {
            innerHTML: 'expected label',
        } as Element;
        expectedLine = {
            innerHTML: 'expected line',
        } as Element;
        expectedFailureLabel = {
            innerHTML: 'expected failure label',
        } as Element;
    });

    describe('createFocusIndicator', () => {
        test('center position is null', () => {
            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(It.isAny()))
                .returns(() => null);

            expect(testSubject.createFocusIndicator({} as TabbedItem, null, true, null)).toBeNull();
        });

        test('for one tab item without any previous item', () => {
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: undefined,
                tabIndexLabel: undefined,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.focusedCircle);

            expect(
                testSubject.createFocusIndicator(itemOne, null, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for the last tabbed item that has a connecting previous item', () => {
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: expectedLine,
                tabIndexLabel: undefined,
            } as FocusIndicator;

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
                testSubject.createFocusIndicator(itemTwo, itemOne, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a tab item with a large jump between tab order from the previous item', () => {
            itemTwo.tabOrder = 1000;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: undefined,
                tabIndexLabel: undefined,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementTwoStub))
                .returns(() => elementTwoPointStub);

            filterFactoryMock.setup(m => m.filterId).returns(() => filterIdStub);

            setupDrawerConfig(elementTwoStub, drawerConfig);
            setupExpectedCircle(expectedCircle, elementTwoPointStub, drawerConfig.focusedCircle);

            expect(
                testSubject.createFocusIndicator(itemTwo, itemOne, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a tab item where the previous tab item center position is null', () => {
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: undefined,
                tabIndexLabel: undefined,
            } as FocusIndicator;

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
                testSubject.createFocusIndicator(itemTwo, itemOne, true, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a non-last tab item where the config specifies showSolidFocusLine to be false', () => {
            const drawerConfig = getDrawerConfigStub(false, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: undefined,
                tabIndexLabel: expectedLabel,
            } as FocusIndicator;

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
                itemTwo.tabOrder.toString(),
            );

            expect(
                testSubject.createFocusIndicator(itemTwo, itemOne, false, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for a non-last tab item where the config specifies showTabIndexedLabel to be false', () => {
            const drawerConfig = getDrawerConfigStub(true, false);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                line: expectedLine,
                tabIndexLabel: undefined,
            } as FocusIndicator;

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
                testSubject.createFocusIndicator(itemTwo, itemOne, false, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });
    });

    describe('createFocusIndicatorForFailure', () => {
        test('centerPosition of element is null', () => {
            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(It.isAny()))
                .returns(() => null);

            expect(testSubject.createFocusIndicatorForFailure({} as TabbedItem, null)).toBeNull();
        });

        test('for tab item with a non ErroredItem item type', () => {
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                tabIndexLabel: expectedLabel,
                failureLabel: expectedFailureLabel,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.missingCircle);
            setupExpectedLabel(expectedLabel, pointStub, drawerConfig.erroredTabIndexLabel, 'X');
            setupExpectedFailureLabel(
                expectedFailureLabel,
                pointStub,
                drawerConfig.failureBoxConfig,
            );

            expect(
                testSubject.createFocusIndicatorForFailure(itemOne, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for tab item with an ErroredItem item type and no tab order', () => {
            itemOne.itemType = TabbedItemType.ErroredItem;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                tabIndexLabel: expectedLabel,
                failureLabel: expectedFailureLabel,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.erroredCircle);
            setupExpectedLabel(expectedLabel, pointStub, drawerConfig.erroredTabIndexLabel, '');
            setupExpectedFailureLabel(
                expectedFailureLabel,
                pointStub,
                drawerConfig.failureBoxConfig,
            );

            expect(
                testSubject.createFocusIndicatorForFailure(itemOne, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
        });

        test('for tab item with an ErroredItem item type and has tab order', () => {
            const tabOrder = 1;
            itemOne = {
                element: elementStub,
                itemType: TabbedItemType.ErroredItem,
                tabOrder,
            } as TabbedItem;
            const drawerConfig = getDrawerConfigStub(true, true);
            const expectedFocusIndicator = {
                circle: expectedCircle,
                tabIndexLabel: expectedLabel,
                failureLabel: expectedFailureLabel,
            } as FocusIndicator;

            centerPositionCalculatorMock
                .setup(m => m.getElementCenterPosition(elementStub))
                .returns(() => pointStub);
            setupDrawerConfig(elementStub, drawerConfig);
            setupExpectedCircle(expectedCircle, pointStub, drawerConfig.erroredCircle);
            setupExpectedLabel(
                expectedLabel,
                pointStub,
                drawerConfig.erroredTabIndexLabel,
                tabOrder.toString(),
            );
            setupExpectedFailureLabel(
                expectedFailureLabel,
                pointStub,
                drawerConfig.failureBoxConfig,
            );

            expect(
                testSubject.createFocusIndicatorForFailure(itemOne, formatterMock.object),
            ).toEqual(expectedFocusIndicator);
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
