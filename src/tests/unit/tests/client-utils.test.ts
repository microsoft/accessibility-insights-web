// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BoundingRect } from 'injected/bounding-rect';
import { BoundRectAccessor, ClientUtils, ScrollAccessor } from 'injected/client-utils';
import { IMock, Mock } from 'typemoq';

class ScrollAccessorStub implements ScrollAccessor {
    public scrollX: number = 0;
    public scrollY: number = 0;
}

class BoundRectAccessorStub implements BoundRectAccessor {
    public getBoundingClientRect(): BoundingRect {
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
                    bottom: 0,
                    right: 0,
                    width: 0,
                    height: 0,
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

        const elementRect: BoundingRect = {
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
