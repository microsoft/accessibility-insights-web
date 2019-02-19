// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IVisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { IVisualizationStoreData } from '../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { StaticContentDetailsView, StaticContentDetailsViewDeps, StaticContentDetailsViewProps } from './static-content-details-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocStaticTestViewDeps = StaticContentDetailsViewDeps;

export interface AdhocStaticTestViewProps {
    deps: AdhocStaticTestViewDeps;
    tabStoreData: Pick<ITabStoreData, 'isChanged'>;
    selectedTest: VisualizationType;
    visualizationStoreData: IVisualizationStoreData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    configuration: IVisualizationConfiguration;
}

export const AdhocStaticTestView = NamedSFC<AdhocStaticTestViewProps>('AdhocStaticTestView', ({ children, ...props }) => {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);
    const displayableData = props.configuration.displayableData;
    const content = props.configuration.detailsViewStaticContent;
    const staticContent = props.configuration.detailsViewContent;

    if (props.tabStoreData.isChanged) {
        return <TargetPageChangedView displayableData={displayableData} type={selectedTest} toggleClickHandler={clickHandler} />;
    }

    const givenProps: StaticContentDetailsViewProps = {
        deps: props.deps,
        visualizationEnabled: scanData.enabled,
        onToggleClick: clickHandler,
        title: displayableData.title,
        toggleLabel: displayableData.toggleLabel,
        content,
        staticContent,
    };

    return <StaticContentDetailsView {...givenProps} />;
});
