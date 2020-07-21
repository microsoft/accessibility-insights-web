// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import {
    BoundRectAccessor,
    ClientRectOffset,
    ClientUtils,
    ElementMatcher,
    ScrollAccessor,
} from '../../../injected/client-utils';

class ScrollAccessorStub implements ScrollAccessor {
    public scrollX: number = 0;
    public scrollY: number = 0;
}

class BoundRectAccessorStub implements BoundRectAccessor {
    public getBoundingClientRect(): ClientRectOffset {
        return null;
    }
}

describe('ClientUtilsTest', () => {
    let scrollGetterMock: IMock<ScrollAccessor>;
    let testObject: ClientUtils;

    beforeEach(() => {
        scrollGetterMock = Mock.ofType<ScrollAccessor>(ScrollAccessorStub);
        testObject = new ClientUtils(scrollGetterMock.object);
    });

    test('matchesSelector: msMatchesSelector', () => {
        const matchesMock = Mock.ofInstance((selector: string) => {
            return true;
        });
        const elementStub = {
            msMatchesSelector: matchesMock.object,
        } as ElementMatcher;

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        const matches1 = true;
        const matches2 = false;

        matchesMock.setup(m => m(selector1)).returns(() => matches1);

        matchesMock.setup(m => m(selector2)).returns(() => matches2);

        expect(testObject.matchesSelector(elementStub, selector1)).toEqual(matches1);
        expect(testObject.matchesSelector(elementStub, selector2)).toEqual(matches2);
    });

    test('matchesSelector: webkitMatchesSelector', () => {
        const matchesMock = Mock.ofInstance((selector: string) => {
            return true;
        });
        const elementStub: ElementMatcher = {
            webkitMatchesSelector: matchesMock.object,
        };

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        const matches1 = true;
        const matches2 = false;

        matchesMock.setup(m => m(selector1)).returns(() => matches1);

        matchesMock.setup(m => m(selector2)).returns(() => matches2);

        expect(testObject.matchesSelector(elementStub, selector1)).toEqual(matches1);
        expect(testObject.matchesSelector(elementStub, selector2)).toEqual(matches2);
    });

    test('matchesSelector: matches', () => {
        const matchesMock = Mock.ofInstance((selector: string) => {
            return true;
        });
        const elementStub = {
            matches: matchesMock.object,
        } as ElementMatcher;

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        const matches1 = true;
        const matches2 = false;

        matchesMock.setup(m => m(selector1)).returns(() => matches1);

        matchesMock.setup(m => m(selector2)).returns(() => matches2);

        expect(testObject.matchesSelector(elementStub, selector1)).toEqual(matches1);
        expect(testObject.matchesSelector(elementStub, selector2)).toEqual(matches2);
    });

    test('matchesSelector: no match function, returns false', () => {
        const elementStub = {} as ElementMatcher;

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        expect(testObject.matchesSelector(elementStub, 'test-string')).toBe(false);
    });

    test('getOffset', () => {
        const initialScrollX = 10;
        const initialScrollY = 20;

        scrollGetterMock.setup(sg => sg.scrollX).returns(() => initialScrollX);

        scrollGetterMock.setup(sg => sg.scrollY).returns(() => initialScrollY);

        const elementTop = 100;
        const elementLeft = 25;

        const elementMock = Mock.ofType<BoundRectAccessor>(BoundRectAccessorStub);
        elementMock
            .setup(em => em.getBoundingClientRect())
            .returns(() => {
                return {
                    top: elementTop,
                    left: elementLeft,
                };
            });

        const result = testObject.getOffset(elementMock.object);

        expect(result.left).toBe(elementLeft + initialScrollX);
        expect(result.top).toBe(elementTop + initialScrollY);
    });

    test('getOffsetFromBoundingRect', () => {
        const initialScrollX = 10;
        const initialScrollY = 20;

        scrollGetterMock.setup(sg => sg.scrollX).returns(() => initialScrollX);

        scrollGetterMock.setup(sg => sg.scrollY).returns(() => initialScrollY);

        const elementTop = 100;
        const elementLeft = 25;

        const elementRect: ClientRect = {
            left: elementLeft,
            top: elementTop,
            bottom: 0,
            right: 0,
            width: 0,
            height: 0,
        };

        const result = testObject.getOffsetFromBoundingRect(elementRect);

        expect(result.left).toBe(elementLeft + initialScrollX);
        expect(result.top).toBe(elementTop + initialScrollY);
    });
});
