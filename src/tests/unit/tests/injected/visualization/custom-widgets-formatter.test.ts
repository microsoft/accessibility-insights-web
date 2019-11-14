// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalMock, GlobalScope, It, Mock, Times } from 'typemoq';

import { CustomWidgetsFormatter } from '../../../../../injected/visualization/custom-widgets-formatter';
import { DrawerUtils } from '../../../../../injected/visualization/drawer-utils';

describe('CustomWidgetsFormatterTests', () => {
    test('getBoundingRect in config and correct when element is composite', () => {
        testGetBoundingRect('combobox', true);
    });

    test('getBoundingRect in config and correct when element is not composite', () => {
        testGetBoundingRect('button', false);
    });

    function testGetBoundingRect(
        role: string,
        shouldIncludeChildren: boolean,
    ): void {
        const expectedChildrenTimes = shouldIncludeChildren
            ? Times.once()
            : Times.never();
        const expectedDefaultTimes = shouldIncludeChildren
            ? Times.never()
            : Times.once();

        const getBoundingClientRectMock = Mock.ofType<
            () => ClientRect | DOMRect
        >();
        const element = {
            getAttribute: r => role,
            getBoundingClientRect: getBoundingClientRectMock.object,
        } as HTMLElement;

        const getBoundingClientRectIncludingChildrenMock = GlobalMock.ofInstance(
            DrawerUtils.getBoundingClientRectIncludingChildren,
            'getBoundingClientRectIncludingChildren',
            DrawerUtils,
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

        const testSubject = new CustomWidgetsFormatter();
        const config = testSubject.getDrawerConfiguration(element, null);
        expect(config.getBoundingRect).toBeDefined();
        let result = null;
        GlobalScope.using(getBoundingClientRectIncludingChildrenMock).with(
            () => {
                result = config.getBoundingRect(element);
            },
        );
        expect(result).toEqual(expectedRectStub);
        getBoundingClientRectMock.verifyAll();
        getBoundingClientRectIncludingChildrenMock.verifyAll();
    }
});
