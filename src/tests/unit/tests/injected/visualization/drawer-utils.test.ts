// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';

describe('getBoundingClientRectIncludingChildren', () => {
    it('works if no children', () => {
        const elementStub = getElementStub(5, 5, 10, 10);
        const result = DrawerUtils.getBoundingClientRectIncludingChildren(elementStub);
        expect(result.top).toBe(5);
        expect(result.left).toBe(5);
        expect(result.bottom).toBe(10);
        expect(result.right).toBe(10);
    });

    it('works if single child fully contained in parent dimensions', () => {
        const elementStub = getElementStub(5, 5, 10, 10, [getElementStub(7, 7, 9, 9)]);
        const result = DrawerUtils.getBoundingClientRectIncludingChildren(elementStub);
        expect(result.top).toBe(5);
        expect(result.left).toBe(5);
        expect(result.bottom).toBe(10);
        expect(result.right).toBe(10);
    });

    it('works if single child partly contained in parent dimensions', () => {
        const elementStub = getElementStub(5, 5, 10, 10, [getElementStub(7, 7, 15, 15)]);
        const result = DrawerUtils.getBoundingClientRectIncludingChildren(elementStub);
        expect(result.top).toBe(5);
        expect(result.left).toBe(5);
        expect(result.bottom).toBe(15);
        expect(result.right).toBe(15);
    });

    it('works if two children overflowing in all four parent dimensions', () => {
        const elementStub = getElementStub(5, 5, 10, 10, [
            getElementStub(0, 0, 7, 7),
            getElementStub(7, 7, 15, 15),
        ]);
        const result = DrawerUtils.getBoundingClientRectIncludingChildren(elementStub);
        expect(result.top).toBe(0);
        expect(result.left).toBe(0);
        expect(result.bottom).toBe(15);
        expect(result.right).toBe(15);
    });

    it('ignores children with empty bounding rectangles', () => {
        const elementStub = getElementStub(5, 5, 10, 10, [
            getElementStub(0, 0, 0, 0),
            getElementStub(7, 7, 15, 15),
        ]);
        const result = DrawerUtils.getBoundingClientRectIncludingChildren(elementStub);
        expect(result.top).toBe(5);
        expect(result.left).toBe(5);
        expect(result.bottom).toBe(15);
        expect(result.right).toBe(15);
    });

    function getElementStub(
        top: number,
        left: number,
        bottom: number,
        right: number,
        children?: any[],
    ): Element {
        return {
            children: children || [],
            getBoundingClientRect: () => {
                return {
                    top,
                    left,
                    bottom,
                    right,
                    height: bottom - top,
                    width: right - left,
                };
            },
        } as any;
    }
});
