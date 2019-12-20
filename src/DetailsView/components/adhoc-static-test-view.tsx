// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as React from 'react';
import { ContentReference } from 'views/content/content-page';

import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { NamedFC } from '../../common/react/named-fc';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { StaticContentDetailsView, StaticContentDetailsViewDeps, StaticContentDetailsViewProps } from './static-content-details-view';
import { TargetPageChangedView } from './target-page-changed-view';
import { ScanIncompleteWarning, ScanIncompleteWarningDeps } from 'DetailsView/components/scan-incomplete-warning';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';

export type AdhocStaticTestViewDeps = StaticContentDetailsViewDeps & ScanIncompleteWarningDeps;

export interface AdhocStaticTestViewProps {
    deps: AdhocStaticTestViewDeps;
    tabStoreData: Pick<TabStoreData, 'isChanged'>;
    selectedTest: VisualizationType;
    visualizationStoreData: VisualizationStoreData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    configuration: VisualizationConfiguration;
    content?: ContentReference;
    guidance?: ContentReference;
    featureFlagStoreData: FeatureFlagStoreData;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
}

export const AdhocStaticTestView = NamedFC<AdhocStaticTestViewProps>('AdhocStaticTestView', ({ children, ...props }) => {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);
    const displayableData = props.configuration.displayableData;

    if (props.tabStoreData.isChanged) {
        return (
            <TargetPageChangedView
                displayableData={displayableData}
                visualizationType={selectedTest}
                toggleClickHandler={clickHandler}
                featureFlagStoreData={props.featureFlagStoreData}
            />
        );
    }

    const givenProps: StaticContentDetailsViewProps = {
        deps: props.deps,
        visualizationEnabled: scanData.enabled,
        onToggleClick: clickHandler,
        title: displayableData.title,
        toggleLabel: displayableData.toggleLabel,
        content: props.content,
        guidance: props.guidance,
    };

    return (
        <>
            <ScanIncompleteWarning
                deps={props.deps}
                warnings={props.scanIncompleteWarnings}
                warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                test={props.selectedTest}
            />
            <StaticContentDetailsView {...givenProps} />
        </>
    );
});
