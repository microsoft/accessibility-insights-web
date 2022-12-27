// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export class IndexedDBDataKeys {
    // Global keys
    public static readonly assessmentStore: string = 'assessmentStoreData';
    public static readonly quickAssessStore: string = 'quickAssessStoreData';
    public static readonly userConfiguration: string = 'userConfiguration';
    public static readonly installation: string = 'installationData';
    public static readonly unifiedFeatureFlags: string = 'featureFlags';
    public static readonly commandStore: string = 'commandStore';
    public static readonly permissionsStateStore: string = 'permissionsStateStore';
    public static readonly scopingStore: string = 'scopingStore';
    public static readonly knownTabIds: string = 'knownTabIds';
    public static readonly tabIdToDetailsViewMap: string = 'tabIdToDetailsViewMap';

    // Tab specific keys- there may be multiple instances of these stores for each tab
    public static readonly cardSelectionStore: (tabId: number) => string = tabId =>
        'cardSelectionStore' + tabId;
    public static readonly detailsViewStore: (tabId: number) => string = tabId =>
        'detailsViewStore' + tabId;
    public static readonly devToolStore: (tabId: number) => string = tabId =>
        'devToolStore' + tabId;
    public static readonly inspectStore: (tabId: number) => string = tabId =>
        'inspectStore' + tabId;
    public static readonly tabStore: (tabId: number) => string = tabId => 'tabStore' + tabId;
    public static readonly pathSnippetStore: (tabId: number) => string = tabId =>
        'pathSnippetStore' + tabId;
    public static readonly needsReviewScanResultsStore: (tabId: number) => string = tabId =>
        'needsReviewScanResultsStore' + tabId;
    public static readonly needsReviewCardSelectionStore: (tabId: number) => string = tabId =>
        'needsReviewCardSelectionStore' + tabId;
    public static readonly visualizationStore: (tabId: number) => string = tabId =>
        'visualizationStore' + tabId;
    public static readonly visualizationScanResultStore: (tabId: number) => string = tabId =>
        'visualizationScanResultStore' + tabId;
    public static readonly unifiedScanResultStore: (tabId: number) => string = tabId =>
        'unifiedScanResultStore' + tabId;

    public static readonly globalKeys: string[] = [
        IndexedDBDataKeys.assessmentStore,
        IndexedDBDataKeys.quickAssessStore,
        IndexedDBDataKeys.userConfiguration,
        IndexedDBDataKeys.installation,
        IndexedDBDataKeys.unifiedFeatureFlags,
        IndexedDBDataKeys.commandStore,
        IndexedDBDataKeys.permissionsStateStore,
        IndexedDBDataKeys.scopingStore,
        IndexedDBDataKeys.knownTabIds,
        IndexedDBDataKeys.tabIdToDetailsViewMap,
    ];

    public static readonly tabSpecificKeys: ((tabId: number) => string)[] = [
        IndexedDBDataKeys.cardSelectionStore,
        IndexedDBDataKeys.detailsViewStore,
        IndexedDBDataKeys.devToolStore,
        IndexedDBDataKeys.inspectStore,
        IndexedDBDataKeys.tabStore,
        IndexedDBDataKeys.pathSnippetStore,
        IndexedDBDataKeys.needsReviewScanResultsStore,
        IndexedDBDataKeys.needsReviewCardSelectionStore,
        IndexedDBDataKeys.visualizationStore,
        IndexedDBDataKeys.visualizationScanResultStore,
        IndexedDBDataKeys.unifiedScanResultStore,
    ];
}
