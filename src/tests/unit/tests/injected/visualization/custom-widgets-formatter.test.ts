// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CustomWidgetsFormatter } from 'injected/visualization/custom-widgets-formatter';
import { DrawerUtils } from 'injected/visualization/drawer-utils';
import { It, Mock, Times } from 'typemoq';

describe(CustomWidgetsFormatter, () => {
    test('getBoundingRect for composite element delegates to getBoundingClientRectIncludingChildren', () => {
        testGetBoundingRect('combobox', true);
    });

    test('getBoundingRect for non-composite element delegates to getBoundingClientRect', () => {
        testGetBoundingRect('button', false);
    });

    function testGetBoundingRect(role: string, shouldIncludeChildren: boolean): void {
        const expectedChildrenTimes = shouldIncludeChildren ? Times.once() : Times.never();
        const expectedDefaultTimes = shouldIncludeChildren ? Times.never() : Times.once();

        const getBoundingClientRectMock = Mock.ofType<() => ClientRect | DOMRect>();
        const element = {
            getAttribute: r => role,
            getBoundingClientRect: getBoundingClientRectMock.object,
        } as HTMLElement;

        const getBoundingClientRectIncludingChildrenMock = Mock.ofInstance(
            DrawerUtils.getBoundingClientRectIncludingChildren,
        );

        const expectedRectStub = {} as DOMRect;
        getBoundingClientRectIncludingChildrenMock
            .setup(m => m(It.isValue(element)))
            .returns(v => expectedRectStub)
            .verifiable(expectedChildrenTimes);

        getBoundingClientRectMock
            .setup(m => m())
            .returns(r => expectedRectStub)
            .verifiable(expectedDefaultTimes);

        const testSubject = new CustomWidgetsFormatter(
            getBoundingClientRectIncludingChildrenMock.object,
        );
        const config = testSubject.getDrawerConfiguration(element, null);
        expect(config.getBoundingRect).toBeDefined();
        const result = config.getBoundingRect(element);
        expect(result).toEqual(expectedRectStub);
        getBoundingClientRectMock.verifyAll();
        getBoundingClientRectIncludingChildrenMock.verifyAll();
    }
});
