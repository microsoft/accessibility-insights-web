// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { BaseClientStoresHub } from 'common/stores/base-client-stores-hub';
import { IMock, It, Mock, MockBehavior, Times } from 'typemoq';

import {
    ClientStoreListener,
    TargetPageStoreData,
} from '../../../../injected/client-store-listener';

describe('ClientStoreListener', () => {
    describe('initialize', () => {
        let testSubject: ClientStoreListener;
        let storeHubMock: IMock<BaseClientStoresHub<TargetPageStoreData>>;
        let onReadyToExecuteVisualizationUpdatesMock: IMock<
            (storeData: TargetPageStoreData) => void
        >;
        let triggerOnChange: () => void;

        beforeEach(() => {
            storeHubMock = Mock.ofType<BaseClientStoresHub<TargetPageStoreData>>(
                null,
                MockBehavior.Strict,
            );
            onReadyToExecuteVisualizationUpdatesMock =
                Mock.ofType<(storeData: TargetPageStoreData) => void>();

            storeHubMock
                .setup(shm => shm.addChangedListenerToAllStores(It.isAny()))
                .callback(givenCallback => (triggerOnChange = givenCallback));

            testSubject = new ClientStoreListener(storeHubMock.object);
            testSubject.registerOnReadyToExecuteVisualizationCallback(
                onReadyToExecuteVisualizationUpdatesMock.object,
            );
        });

        test('registerOnReadyToExecuteVisualizationCallback: no store data', () => {
            storeHubMock.setup(shm => shm.hasStoreData()).returns(() => false);
            triggerOnChange();
            onReadyToExecuteVisualizationUpdatesMock.verify(
                callback => callback(It.isAny()),
                Times.never(),
            );
        });

        test('registerOnReadyToExecuteVisualizationCallback: with store data & not scanning', () => {
            const storeDataMock = {
                visualizationStoreData: {
                    scanning: null,
                },
            } as TargetPageStoreData;
            storeHubMock.setup(shm => shm.hasStoreData()).returns(() => true);
            storeHubMock.setup(shm => shm.getAllStoreData()).returns(() => storeDataMock);

            triggerOnChange();

            onReadyToExecuteVisualizationUpdatesMock.verify(
                callback => callback(storeDataMock),
                Times.once(),
            );
        });

        test('registerOnReadyToExecuteVisualizationCallback: with store data & scanning', () => {
            const storeDataMock = {
                visualizationStoreData: {
                    scanning: 'something',
                },
            } as TargetPageStoreData;
            storeHubMock.setup(shm => shm.hasStoreData()).returns(() => true);
            storeHubMock.setup(shm => shm.getAllStoreData()).returns(() => storeDataMock);

            triggerOnChange();

            onReadyToExecuteVisualizationUpdatesMock.verify(
                callback => callback(storeDataMock),
                Times.never(),
            );
        });
    });
});
