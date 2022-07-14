// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ResultSectionContentDeps } from 'common/components/cards/result-section-content';
import { ScanningSpinner } from 'common/components/scanning-spinner/scanning-spinner';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { NamedFC } from 'common/react/named-fc';
import { CardsViewModel } from 'common/types/store-data/card-view-model';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { ScanStatus } from 'electron/flux/types/scan-status';
import { ContentPageInfo } from 'electron/types/content-page-info';
import { HeaderSection } from 'electron/views/results/components/header-section';
import * as React from 'react';

export type TestViewDeps = ResultSectionContentDeps & {
    cardSelectionMessageCreator: CardSelectionMessageCreator;
};
export type TestViewProps = {
    deps: TestViewDeps;
    scanStatus: ScanStatus;
    scanMetadata: ScanMetadata;
    cardsViewData: CardsViewModel;
    userConfigurationStoreData: UserConfigurationStoreData;
    contentPageInfo: ContentPageInfo;
    tabStopsEnabled: boolean;
    narrowModeStatus: NarrowModeStatus;
};

export const TestView = NamedFC<TestViewProps>('TestView', props => {
    const {
        scanStatus,
        scanMetadata,
        cardsViewData,
        userConfigurationStoreData,
        deps,
        contentPageInfo,
        narrowModeStatus,
    } = props;

    const { title, description } = contentPageInfo;
    const headerSection = <HeaderSection title={title} description={description} />;

    if (scanStatus !== ScanStatus.Completed) {
        return (
            <div>
                {headerSection}
                <ScanningSpinner
                    isSpinning={scanStatus === ScanStatus.Scanning}
                    label="Scanning..."
                    aria-live="assertive"
                />
            </div>
        );
    }

    return (
        <div>
            {headerSection}
            <contentPageInfo.instancesSectionComponent
                deps={deps}
                userConfigurationStoreData={userConfigurationStoreData}
                scanMetadata={scanMetadata}
                shouldAlertFailuresCount={true}
                cardsViewData={cardsViewData}
                tabStopsEnabled={props.tabStopsEnabled}
                cardSelectionMessageCreator={deps.cardSelectionMessageCreator}
                sectionHeadingLevel={2}
                narrowModeStatus={narrowModeStatus}
            />
        </div>
    );
});
