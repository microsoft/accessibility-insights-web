// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AssessmentsProviderImpl } from 'assessments/assessments-provider';
import { AssessmentDataConverter } from 'background/assessment-data-converter';
import { ScopingInputTypes } from 'background/scoping-input-types';
import { AssessmentStore } from 'background/stores/assessment-store';
import { CardSelectionStore } from 'background/stores/card-selection-store';
import { DetailsViewStore } from 'background/stores/details-view-store';
import { CommandStore } from 'background/stores/global/command-store';
import { FeatureFlagStore } from 'background/stores/global/feature-flag-store';
import { LaunchPanelStore } from 'background/stores/global/launch-panel-store';
import { ScopingStore } from 'background/stores/global/scoping-store';
import { UserConfigurationStore } from 'background/stores/global/user-configuration-store';
import { InspectStore } from 'background/stores/inspect-store';
import { PathSnippetStore } from 'background/stores/path-snippet-store';
import { TabStore } from 'background/stores/tab-store';
import { VisualizationScanResultStore } from 'background/stores/visualization-scan-result-store';
import { VisualizationStore } from 'background/stores/visualization-store';
import { CardSelectionStoreData } from 'common/types/store-data/card-selection-store-data';
import { It, Mock, MockBehavior } from 'typemoq';

import { PermissionsStateStore } from '../../../../background/stores/global/permissions-state-store';
import { UnifiedScanResultStore } from '../../../../background/stores/unified-scan-result-store';
import { FeatureFlags } from '../../../../common/feature-flags';
import { AssessmentStoreData } from '../../../../common/types/store-data/assessment-result-data';
import { CommandStoreData } from '../../../../common/types/store-data/command-store-data';
import { DetailsViewStoreData } from '../../../../common/types/store-data/details-view-store-data';
import { FeatureFlagStoreData } from '../../../../common/types/store-data/feature-flag-store-data';
import { LaunchPanelStoreData } from '../../../../common/types/store-data/launch-panel-store-data';
import { PermissionsStateStoreData } from '../../../../common/types/store-data/permissions-state-store-data';
import { ScopingStoreData } from '../../../../common/types/store-data/scoping-store-data';
import { TabStoreData } from '../../../../common/types/store-data/tab-store-data';
import { UnifiedScanResultStoreData } from '../../../../common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from '../../../../common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from '../../../../common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from '../../../../common/types/store-data/visualization-store-data';
import { AssessmentsStoreDataBuilder } from '../../common/assessment-store-data-builder';
import { DetailsViewStoreDataBuilder } from '../../common/details-view-store-data-builder';
import { VisualizationScanResultStoreDataBuilder } from '../../common/visualization-scan-result-store-data-builder';
import { VisualizationStoreDataBuilder } from '../../common/visualization-store-data-builder';

export class StoreMocks {
    public visualizationStoreMock = Mock.ofType(VisualizationStore, MockBehavior.Strict);
    public visualizationScanResultStoreMock = Mock.ofType(
        VisualizationScanResultStore,
        MockBehavior.Strict,
    );
    public detailsViewStoreMock = Mock.ofType(DetailsViewStore, MockBehavior.Strict);
    public tabStoreMock = Mock.ofType(TabStore, MockBehavior.Strict);
    public featureFlagStoreMock = Mock.ofType(FeatureFlagStore, MockBehavior.Strict);
    public assessmentStoreMock = Mock.ofType(AssessmentStore, MockBehavior.Strict);
    public assessmentsProviderMock = Mock.ofType(AssessmentsProviderImpl);
    public scopingStoreMock = Mock.ofType(ScopingStore, MockBehavior.Strict);
    public inspectStoreMock = Mock.ofType(InspectStore, MockBehavior.Strict);
    public pathSnippetStoreMock = Mock.ofType(PathSnippetStore, MockBehavior.Strict);
    public commandStoreMock = Mock.ofType(CommandStore, MockBehavior.Strict);
    public userConfigurationStoreMock = Mock.ofType(UserConfigurationStore, MockBehavior.Strict);
    public launchPanelStateStoreMock = Mock.ofType(LaunchPanelStore, MockBehavior.Strict);
    public unifiedScanResultStoreMock = Mock.ofType(UnifiedScanResultStore, MockBehavior.Strict);
    public permissionsStateStoreMock = Mock.ofType(PermissionsStateStore, MockBehavior.Strict);

    public visualizationStoreData = new VisualizationStoreDataBuilder().build();
    public visualizationScanResultsStoreData =
        new VisualizationScanResultStoreDataBuilder().build();
    public detailsViewStoreData = new DetailsViewStoreDataBuilder().build();
    public tabStoreData: TabStoreData = {
        title: 'DetailsViewContainerTest title',
        url: 'http://detailsViewContainerTest/url/',
        id: 1,
        isClosed: false,
        isChanged: false,
        isPageHidden: false,
        isOriginChanged: false,
    };
    public commandStoreData = new CommandStore(null, null).getDefaultState();
    public userConfigurationStoreData = new UserConfigurationStore(
        null,
        null,
        null,
        null,
    ).getDefaultState();
    public scopingStoreData = new ScopingStore(null).getDefaultState();
    public inspectStoreData = new InspectStore(null, null).getDefaultState();
    public pathSnippetStoreData = new PathSnippetStore(null).getDefaultState();
    public unifiedScanResultStoreData = new UnifiedScanResultStore(null).getDefaultState();
    public launchPanelStateStoreData = new LaunchPanelStore(null, null, null).getDefaultState();
    public featureFlagStoreData: FeatureFlagStoreData = {
        [FeatureFlags[FeatureFlags.logTelemetryToConsole]]: false,
    };
    public assessmentStoreData: AssessmentStoreData;
    public permissionsStateStoreData = new PermissionsStateStore(null).getDefaultState();

    public cardSelectionStoreData = new CardSelectionStore(null, null).getDefaultState();

    constructor() {
        this.assessmentsProviderMock.setup(ap => ap.all()).returns(() => []);

        const assessmentDataConverterMock = Mock.ofType(AssessmentDataConverter);
        assessmentDataConverterMock
            .setup(acdm => acdm.getNewManualTestStepResult(It.isAny()))
            .returns(() => null);

        this.assessmentStoreData = new AssessmentsStoreDataBuilder(
            this.assessmentsProviderMock.object,
            assessmentDataConverterMock.object,
        ).build();
    }

    public scopingSelectorsData: ScopingStoreData = {
        selectors: {
            [ScopingInputTypes.include]: [],
            [ScopingInputTypes.exclude]: [],
        },
    };

    public setVisualizationScanResultStoreData(data: VisualizationScanResultData): StoreMocks {
        this.visualizationScanResultsStoreData = data;
        return this;
    }

    public setUnifiedScanResultStoreData(data: UnifiedScanResultStoreData): StoreMocks {
        this.unifiedScanResultStoreData = data;
        return this;
    }

    public setCommandStoreData(data: CommandStoreData): StoreMocks {
        this.commandStoreData = data;
        return this;
    }

    public setLaunchPanelStateStoreData(data: LaunchPanelStoreData): StoreMocks {
        this.launchPanelStateStoreData = data;
        return this;
    }

    public setTabStoreData(data: TabStoreData): StoreMocks {
        this.tabStoreData = data;
        return this;
    }

    public setVisualizationStoreData(data: VisualizationStoreData): StoreMocks {
        this.visualizationStoreData = data;
        return this;
    }

    public setDetailsViewStoreData(data: DetailsViewStoreData): StoreMocks {
        this.detailsViewStoreData = data;
        return this;
    }

    public setFeatureFlagsStoreData(data: FeatureFlagStoreData): StoreMocks {
        this.featureFlagStoreData = data;
        return this;
    }

    public setUserConfigurationStoreData(data: UserConfigurationStoreData): StoreMocks {
        this.userConfigurationStoreData = data;
        return this;
    }

    public setCardSelectionStoreData(data: CardSelectionStoreData): StoreMocks {
        this.cardSelectionStoreData = data;
        return this;
    }

    public setPermissionsStateStoreData(data: PermissionsStateStoreData): StoreMocks {
        this.permissionsStateStoreData = data;
        return this;
    }

    public verifyAll(): void {
        this.detailsViewStoreMock.verifyAll();
        this.featureFlagStoreMock.verifyAll();
        this.tabStoreMock.verifyAll();
        this.visualizationScanResultStoreMock.verifyAll();
        this.unifiedScanResultStoreMock.verifyAll();
        this.visualizationStoreMock.verifyAll();
        this.scopingStoreMock.verifyAll();
        this.inspectStoreMock.verifyAll();
        this.pathSnippetStoreMock.verifyAll();
        this.permissionsStateStoreMock.verifyAll();
    }
}
