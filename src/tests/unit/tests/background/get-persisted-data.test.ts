// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    getAllPersistedData,
    getGlobalPersistedData,
    PersistedData,
    TabSpecificPersistedData,
} from 'background/get-persisted-data';
import { IndexedDBDataKeys } from 'background/IndexedDBDataKeys';
import { PermissionsStateStoreData } from 'common/types/store-data/permissions-state-store-data';
import { IMock, Mock } from 'typemoq';
import { DictionaryNumberTo, DictionaryStringTo } from 'types/common-types';

import { InstallationData } from '../../../../background/installation-data';
import { IndexedDBAPI } from '../../../../common/indexedDB/indexedDB';
import {
    AssessmentStoreData,
    PersistedTabInfo,
} from '../../../../common/types/store-data/assessment-result-data';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';

describe('GetPersistedDataTest', () => {
    let indexedDBInstanceStrictMock: IMock<IndexedDBAPI>;
    let assessmentStoreData: AssessmentStoreData;
    let userConfigurationData: UserConfigurationStoreData;
    let installationData: InstallationData;
    let permissionsStateStoreData: PermissionsStateStoreData;
    let knownTabIds: DictionaryNumberTo<string>;
    let tabIdToDetailsViewMap: DictionaryStringTo<number>;

    beforeEach(() => {
        assessmentStoreData = {
            assessmentNavState: null,
            assessments: null,
            persistedTabInfo: {} as PersistedTabInfo,
            resultDescription: '',
        };
        userConfigurationData = {
            isFirstTime: true,
            enableTelemetry: false,
            enableHighContrast: false,
            lastSelectedHighContrast: false,
            bugService: 'none',
            bugServicePropertiesMap: {},
            adbLocation: null,
            lastWindowState: null,
            lastWindowBounds: null,
            showAutoDetectedFailuresDialog: true,
            showSaveAssessmentDialog: true,
        };
        installationData = {
            id: 'test-id',
            month: 0,
            year: 0,
        };
        permissionsStateStoreData = { hasAllUrlAndFilePermissions: true };
        knownTabIds = { 0: 'url0', 9: 'url9' };
        tabIdToDetailsViewMap = { key: 9 };
        indexedDBInstanceStrictMock = Mock.ofType<IndexedDBAPI>();
    });

    describe('getGlobalPersistedData', () => {
        it('propagates the results of IndexedDBAPI.getItem for the appropriate keys', async () => {
            const indexedDataKeysToFetch = [
                IndexedDBDataKeys.assessmentStore,
                IndexedDBDataKeys.userConfiguration,
            ];

            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.assessmentStore))
                .returns(async () => assessmentStoreData);
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.userConfiguration))
                .returns(async () => userConfigurationData);

            const data = await getGlobalPersistedData(
                indexedDBInstanceStrictMock.object,
                indexedDataKeysToFetch,
            );

            expect(data).toEqual({
                assessmentStoreData: assessmentStoreData,
                userConfigurationData: userConfigurationData,
            } as PersistedData);
        });

        it('uses specified data keys to read persisted data', async () => {
            const indexedDataKeysToFetch = [
                IndexedDBDataKeys.userConfiguration,
                IndexedDBDataKeys.installation,
                IndexedDBDataKeys.permissionsStateStore,
                IndexedDBDataKeys.knownTabIds,
                IndexedDBDataKeys.tabIdToDetailsViewMap,
            ];

            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.userConfiguration))
                .returns(async () => userConfigurationData);
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.installation))
                .returns(async () => installationData);
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.permissionsStateStore))
                .returns(async () => permissionsStateStoreData);
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.knownTabIds))
                .returns(async () => knownTabIds);
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.tabIdToDetailsViewMap))
                .returns(async () => tabIdToDetailsViewMap);

            const data = await getGlobalPersistedData(
                indexedDBInstanceStrictMock.object,
                indexedDataKeysToFetch,
            );

            expect(data).toEqual({
                userConfigurationData: userConfigurationData,
                installationData: installationData,
                permissionsStateStoreData: permissionsStateStoreData,
                knownTabIds: knownTabIds,
                tabIdToDetailsViewMap: tabIdToDetailsViewMap,
            } as Partial<PersistedData>);
        });
    });

    describe('getAllPersistedData', () => {
        it('returns global data when no known tabs exist', async () => {
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.knownTabIds))
                .returns(() => Promise.resolve({}));
            setupGlobalData();

            const data = await getAllPersistedData(indexedDBInstanceStrictMock.object);

            expect(data).toEqual({
                assessmentStoreData: assessmentStoreData,
                knownTabIds: {},
                userConfigurationData: {},
                commandStoreData: {},
                featureFlags: {},
                installationData: {},
                permissionsStateStoreData: {},
                scopingStoreData: {},
                tabIdToDetailsViewMap: {},
                tabData: {},
            } as PersistedData);
        });

        it('returns all data', async () => {
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.knownTabIds))
                .returns(() => Promise.resolve(knownTabIds));
            setupGlobalData();
            setupTabData();

            const data = await getAllPersistedData(indexedDBInstanceStrictMock.object);

            const expectedTabData = {
                cardSelectionStoreData: {},
                detailsViewStoreData: {},
                devToolStoreData: {},
                inspectStoreData: {},
                needsReviewCardSelectionStoreData: {},
                needsReviewScanResultsStoreData: {},
                pathSnippetStoreData: {},
                tabStoreData: {},
                unifiedScanResultStoreData: {},
                visualizationScanResultStoreData: {},
                visualizationStoreData: {},
            } as TabSpecificPersistedData;
            const tabData: { [tabId: number]: TabSpecificPersistedData } = {
                0: expectedTabData,
                9: expectedTabData,
            };
            expect(data).toEqual({
                assessmentStoreData: assessmentStoreData,
                knownTabIds: knownTabIds,
                userConfigurationData: {},
                commandStoreData: {},
                featureFlags: {},
                installationData: {},
                permissionsStateStoreData: {},
                scopingStoreData: {},
                tabIdToDetailsViewMap: {},
                tabData,
            } as PersistedData);
        });

        function setupGlobalData() {
            indexedDBInstanceStrictMock
                .setup(i => i.getItem(IndexedDBDataKeys.assessmentStore))
                .returns(async () => assessmentStoreData);
            IndexedDBDataKeys.globalKeys.forEach(key => {
                if (
                    key !== IndexedDBDataKeys.knownTabIds &&
                    key !== IndexedDBDataKeys.assessmentStore
                ) {
                    indexedDBInstanceStrictMock
                        .setup(i => i.getItem(key))
                        .returns(async () => Promise.resolve({}));
                }
            });
        }

        function setupTabData() {
            Object.keys(knownTabIds).forEach(tabId => {
                IndexedDBDataKeys.tabSpecificKeys.forEach(key => {
                    indexedDBInstanceStrictMock
                        .setup(i => i.getItem(key(parseInt(tabId))))
                        .returns(async () => Promise.resolve({}));
                });
            });
        }
    });
});
