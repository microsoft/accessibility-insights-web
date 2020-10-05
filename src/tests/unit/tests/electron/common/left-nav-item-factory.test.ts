// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { createLeftNavItems } from 'electron/common/left-nav-item-factory';
import { LeftNavActionCreator } from 'electron/flux/action-creator/left-nav-action-creator';
import { LeftNavActions } from 'electron/flux/action/left-nav-actions';
import { TestConfig } from 'electron/types/test-config';
import { LeftNavItem } from 'electron/types/left-nav-item';
import { Mock, MockBehavior } from 'typemoq';

describe('left nav item factory', () => {
    it('creates array of LeftNavItem objects as expected', () => {
        const configs: TestConfig[] = [
            {
                key: 'automated-checks',
                title: 'my title1',
            } as TestConfig,
            {
                key: 'needs-review',
                title: 'my title2',
            } as TestConfig,
        ];

        const expectedItems: LeftNavItem[] = [
            {
                key: 'automated-checks',
                displayName: 'my title1',
            } as LeftNavItem,
            {
                key: 'needs-review',
                displayName: 'my title2',
            } as LeftNavItem,
        ];

        const actionCreatorMock = Mock.ofType<LeftNavActionCreator>(undefined, MockBehavior.Strict);

        const actualItems = createLeftNavItems(configs, actionCreatorMock.object);

        expect(actualItems).toMatchObject(expectedItems);

        actionCreatorMock.verifyAll();
    });

    it('calls action creator as expected', () => {
        const configs: TestConfig[] = [
            {
                key: 'automated-checks',
                title: 'my title1',
            } as TestConfig,
        ];

        const actionCreatorMock = Mock.ofType<LeftNavActionCreator>(undefined, MockBehavior.Strict);
        actionCreatorMock.setup(m => m.itemSelected('automated-checks')).verifiable();

        const leftNavItems = createLeftNavItems(configs, actionCreatorMock.object);

        leftNavItems[0].onSelect();

        actionCreatorMock.verifyAll();
    });
});
