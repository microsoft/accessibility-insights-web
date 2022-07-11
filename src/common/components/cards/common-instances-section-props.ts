// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingLevel } from 'common/components/heading-element-for-level';
import { CardSelectionMessageCreator } from 'common/message-creators/card-selection-message-creator';
import { ScanMetadata } from 'common/types/store-data/unified-data-interface';
import { NarrowModeStatus } from 'DetailsView/components/narrow-mode-detector';
import { CardsViewModel } from '../../types/store-data/card-view-model';
import { UserConfigurationStoreData } from '../../types/store-data/user-configuration-store';
import { ResultSectionDeps } from './result-section';

export type CommonInstancesSectionDeps = ResultSectionDeps;
export type CommonInstancesSectionProps = {
    deps: CommonInstancesSectionDeps;
    cardsViewData: CardsViewModel;
    userConfigurationStoreData: UserConfigurationStoreData;
    scanMetadata: ScanMetadata;
    shouldAlertFailuresCount?: boolean;
    cardSelectionMessageCreator?: CardSelectionMessageCreator;
    sectionHeadingLevel: HeadingLevel;
    narrowModeStatus: NarrowModeStatus;
};
