// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { It, Mock } from 'typemoq';

import { DetailsViewActionMessageCreator } from '../../../../../DetailsView/actions/details-view-action-message-creator';
import { IssuesSelectionFactory } from '../../../../../DetailsView/actions/issues-selection-factory';

describe('IssuesSelectionFactoryTest', () => {
    test('createSelection', () => {
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        detailsViewActionMessageCreatorMock
            .setup(mc => mc.updateIssuesSelectedTargets(It.isValue(['key1', 'key2', 'key3'])))
            .verifiable();

        detailsViewActionMessageCreatorMock
            .setup(mc => mc.updateFocusedInstanceTarget(It.isValue(['target1'])))
            .verifiable();

        const testObject = new IssuesSelectionFactory();
        const selection = testObject.createSelection(detailsViewActionMessageCreatorMock.object);

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

        detailsViewActionMessageCreatorMock.verifyAll();
    });

    test('clear selection', () => {
        const detailsViewActionMessageCreatorMock = Mock.ofType(DetailsViewActionMessageCreator);
        detailsViewActionMessageCreatorMock
            .setup(mc => mc.updateIssuesSelectedTargets(It.isValue(['key1', 'key2', 'key3'])))
            .verifiable();

        detailsViewActionMessageCreatorMock
            .setup(mc => mc.updateFocusedInstanceTarget(It.isValue(['target1'])))
            .verifiable();

        detailsViewActionMessageCreatorMock
            .setup(mc => mc.updateFocusedInstanceTarget(It.isValue(null)))
            .verifiable();

        const testObject = new IssuesSelectionFactory();
        const selection = testObject.createSelection(detailsViewActionMessageCreatorMock.object);

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

        detailsViewActionMessageCreatorMock.verifyAll();
    });
});
