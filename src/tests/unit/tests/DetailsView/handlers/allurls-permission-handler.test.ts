// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { allUrlAndFilePermissions } from 'background/browser-permissions-tracker';
import { BrowserAdapter } from 'common/browser-adapters/browser-adapter';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { AllUrlsPermissionHandler } from 'DetailsView/handlers/allurls-permission-handler';
import { SyntheticEvent } from 'react';
import { IMock, Mock, Times } from 'typemoq';

describe('AllUrlsPermissionHandler', () => {
    let browserAdapterMock: IMock<BrowserAdapter>;
    let actionMessageCreatorMock: IMock<Pick<
        DetailsViewActionMessageCreator,
        'setAllUrlsPermissionState'
    >>;
    let testSubject: AllUrlsPermissionHandler;

    beforeEach(() => {
        browserAdapterMock = Mock.ofType<BrowserAdapter>();
        actionMessageCreatorMock = Mock.ofType<DetailsViewActionMessageCreator>();

        testSubject = new AllUrlsPermissionHandler(
            browserAdapterMock.object,
            actionMessageCreatorMock.object,
        );
    });

    test('requestAllUrlsPermission with permissions granted', async () => {
        const expectedPermissions = true;
        const eventStub = {} as SyntheticEvent;
        const onSuccessCallback = Mock.ofType<() => void>();

        browserAdapterMock
            .setup(bam => bam.requestPermissions(allUrlAndFilePermissions))
            .returns(() => Promise.resolve(expectedPermissions));

        await testSubject.requestAllUrlsPermission(eventStub, onSuccessCallback.object);
        actionMessageCreatorMock.verify(
            m => m.setAllUrlsPermissionState(eventStub, expectedPermissions),
            Times.once(),
        );
        onSuccessCallback.verify(m => m(), Times.once());
    });

    test('requestAllUrlsPermission with permissions not granted', async () => {
        const expectedPermissions = false;
        const eventStub = {} as SyntheticEvent;
        const onSuccessCallback = Mock.ofType<() => void>();

        browserAdapterMock
            .setup(bam => bam.requestPermissions(allUrlAndFilePermissions))
            .returns(() => Promise.resolve(expectedPermissions));

        await testSubject.requestAllUrlsPermission(eventStub, onSuccessCallback.object);
        actionMessageCreatorMock.verify(
            m => m.setAllUrlsPermissionState(eventStub, expectedPermissions),
            Times.once(),
        );
        onSuccessCallback.verify(m => m(), Times.never());
    });
});
