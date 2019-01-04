// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { IMock, Mock } from 'typemoq';

import { ClientRectOffset, ClientUtils, IBoundRectAccessor, IElementMatcher, IScrollAccessor } from '../../injected/client-utils';

class ScrollAccessorStub implements IScrollAccessor {
    public scrollX: number = 0;
    public scrollY: number = 0;
}

class BoundRectAccessorStub implements IBoundRectAccessor {
    public getBoundingClientRect(): ClientRectOffset {
        return null;
    }
}

describe('ClientUtilsTest', () => {
    let scrollGetterMock: IMock<IScrollAccessor>;
    let testObject: ClientUtils;

    beforeEach(() => {
        scrollGetterMock = Mock.ofType<IScrollAccessor>(ScrollAccessorStub);
        testObject = new ClientUtils(scrollGetterMock.object);
    });

    test('matchesSelector: msMatchesSelector', () => {
        const matchesMock = Mock.ofInstance((selector: string) => { return true; });
        const elementStub = {
            msMatchesSelector: matchesMock.object,
        } as IElementMatcher;

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        const matches1 = true;
        const matches2 = false;

        matchesMock
            .setup(m => m(selector1))
            .returns(() => matches1);

        matchesMock
            .setup(m => m(selector2))
            .returns(() => matches2);

        expect(testObject.matchesSelector(elementStub, selector1)).toEqual(matches1);
        expect(testObject.matchesSelector(elementStub, selector2)).toEqual(matches2);
    });

    test('matchesSelector: webkitMatchesSelector', () => {
        const matchesMock = Mock.ofInstance((selector: string) => { return true; });
        const elementStub: IElementMatcher = {
            webkitMatchesSelector: matchesMock.object,
        };

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        const matches1 = true;
        const matches2 = false;

        matchesMock
            .setup(m => m(selector1))
            .returns(() => matches1);

        matchesMock
            .setup(m => m(selector2))
            .returns(() => matches2);

        expect(testObject.matchesSelector(elementStub, selector1)).toEqual(matches1);
        expect(testObject.matchesSelector(elementStub, selector2)).toEqual(matches2);
    });

    test('matchesSelector: matches', () => {
        const matchesMock = Mock.ofInstance((selector: string) => { return true; });
        const elementStub = {
            matches: matchesMock.object,
        } as IElementMatcher;

        const selector1 = 'selector1';
        const selector2 = 'selector2';

        const matches1 = true;
        const matches2 = false;

        matchesMock
            .setup(m => m(selector1))
            .returns(() => matches1);

        matchesMock
            .setup(m => m(selector2))
            .returns(() => matches2);

        expect(testObject.matchesSelector(elementStub, selector1)).toEqual(matches1);
        expect(testObject.matchesSelector(elementStub, selector2)).toEqual(matches2);
    });

    test('getOffset', () => {
        const initialScrollX = 10;
        const initialScrollY = 20;

        scrollGetterMock
            .setup(sg => sg.scrollX)
            .returns(() => initialScrollX);

        scrollGetterMock
            .setup(sg => sg.scrollY)
            .returns(() => initialScrollY);

        const elementTop = 100;
        const elementLeft = 25;

        const elementMock = Mock.ofType<IBoundRectAccessor>(BoundRectAccessorStub);
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
});
