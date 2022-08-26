// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { GlobalActionHub } from 'background/actions/global-action-hub';
import { PersistedData } from 'background/get-persisted-data';
import { LocalStorageData } from 'background/storage-data';
import { AssessmentStore } from 'background/stores/assessment-store';
import { BaseStoreImpl } from 'background/stores/base-store-impl';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { GlobalStoreHub } from 'background/stores/global/global-store-hub';
import { LaunchPanelStore } from 'background/stores/global/launch-panel-store';
import { PermissionsStateStore } from 'background/stores/global/permissions-state-store';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { LaunchPanelType } from 'common/types/store-data/launch-panel-store-data';
import { cloneDeep } from 'lodash';
import { failTestOnErrorLogger } from 'tests/unit/common/fail-test-on-error-logger';
import { IMock, Mock, Times } from 'typemoq';
import { BaseStore } from '../../../../../../common/base-store';
import { IndexedDBAPI } from '../../../../../../common/indexedDB/indexedDB';
import { PersistedTabInfo } from '../../../../../../common/types/store-data/assessment-result-data';
import { StoreType } from '../../../../../../common/types/store-type';
import { CreateTestAssessmentProvider } from '../../../../common/test-assessment-provider';

describe('GlobalStoreHubTest', () => {
    let userDataStub: LocalStorageData;
    let idbInstance: IndexedDBAPI;
    let assessmentProvider;
    let persistedDataStub: PersistedData;

    beforeEach(() => {
        idbInstance = {} as IndexedDBAPI;
        assessmentProvider = CreateTestAssessmentProvider();
        userDataStub = {
            launchPanelSetting: LaunchPanelType.LaunchPad,
        } as LocalStorageData;

        persistedDataStub = {
            assessmentStoreData: {
                persistedTabInfo: {} as PersistedTabInfo,
                assessmentNavState: null,
                assessments: null,
                resultDescription: '',
            },
            userConfigurationData: {
                enableTelemetry: true,
                isFirstTime: false,
                enableHighContrast: false,
                bugService: 'none',
                bugServicePropertiesMap: {},
            },
        } as PersistedData;
    });

    it('verify getAllStores', () => {
        const testSubject: GlobalStoreHub = new GlobalStoreHub(
            new GlobalActionHub(),
            null,
            null,
            userDataStub,
            assessmentProvider,
            idbInstance,
            cloneDeep(persistedDataStub),
            null,
            failTestOnErrorLogger,
            true,
        );
        const allStores = testSubject.getAllStores();

        expect(allStores.length).toBe(7);
        expect(testSubject.getStoreType()).toEqual(StoreType.GlobalStore);

        verifyStoreExists(allStores, FeatureFlagStore);
        verifyStoreExists(allStores, LaunchPanelStore);
        verifyStoreExists(allStores, ScopingStore);
        verifyStoreExists(allStores, AssessmentStore);
        verifyStoreExists(allStores, UserConfigurationStore);
        verifyStoreExists(allStores, PermissionsStateStore);
    });

    it('test initialize', () => {
        const testSubject: GlobalStoreHub = new GlobalStoreHub(
            new GlobalActionHub(),
            null,
            null,
            userDataStub,
            assessmentProvider,
            idbInstance,
            cloneDeep(persistedDataStub),
            null,
            failTestOnErrorLogger,
            true,
        );
        const allStores = testSubject.getAllStores() as BaseStoreImpl<any>[];
        const initializeMocks: Array<IMock<Function>> = [];

        allStores.forEach(store => {
            const initializeMock = Mock.ofType<Function>();
            initializeMock.setup(f => f()).verifiable(Times.once());
            initializeMocks.push(initializeMock);
            store.initialize = initializeMock.object as any;
        });

        testSubject.initialize();

        verifyMocks(initializeMocks);
    });

    function verifyMocks(mocks: Array<IMock<any>>): void {
        mocks.forEach(mock => mock.verifyAll());
    }

    function verifyStoreExists(
        stores: Array<BaseStore<any, Promise<void>>>,
        storeType,
    ): BaseStore<StoreType, Promise<void>> {
        const matchingStores = stores.filter(s => s instanceof storeType);
        expect(matchingStores.length).toBe(1);
        return matchingStores[0];
    }
});
