// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { IssuesSelectionFactory } from '../../../../../DetailsView/actions/issues-selection-factory';

describe('IssuesSelectionFactoryTest', () => {
    test('createSelection', () => {
        const messageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        messageCreatorMock
            .setup(mc =>
                mc.updateIssuesSelectedTargets(
                    It.isValue(['key1', 'key2', 'key3']),
                ),
            )
            .verifiable();

        messageCreatorMock
            .setup(mc =>
                mc.updateFocusedInstanceTarget(It.isValue(['target1'])),
            )
            .verifiable();

        const testObject = new IssuesSelectionFactory();
        const selection = testObject.createSelection(messageCreatorMock.object);

        const items = [
            {
                key: 'key1',
                target: ['target1'],
            },
            {
                key: 'key2',
                target: ['target2'],
            },
            {
                key: 'key3',
                target: ['target3'],
            },
        ];

        selection.setItems(items, true);

        messageCreatorMock.verifyAll();
    });

    test('clear selection', () => {
        const messageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        messageCreatorMock
            .setup(mc =>
                mc.updateIssuesSelectedTargets(
                    It.isValue(['key1', 'key2', 'key3']),
                ),
            )
            .verifiable();

        messageCreatorMock
            .setup(mc =>
                mc.updateFocusedInstanceTarget(It.isValue(['target1'])),
            )
            .verifiable();

        messageCreatorMock
            .setup(mc => mc.updateFocusedInstanceTarget(It.isValue(null)))
            .verifiable();

        const testObject = new IssuesSelectionFactory();
        const selection = testObject.createSelection(messageCreatorMock.object);

        const items = [
            {
                key: 'key1',
                target: ['target1'],
            },
            {
                key: 'key2',
                target: ['target2'],
            },
            {
                key: 'key3',
                target: ['target3'],
            },
        ];

        selection.setItems(items, true);
        selection.setAllSelected(false);

        messageCreatorMock.verifyAll();
    });
});
