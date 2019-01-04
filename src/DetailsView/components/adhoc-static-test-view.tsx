// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { IVisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { ITabStoreData } from '../../common/types/store-data/itab-store-data';
import { IVisualizationStoreData } from '../../common/types/store-data/ivisualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { IStaticContentDetailsViewProps, StaticContentDetailsView } from './static-content-details-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type StaticTestViewDeps = {};

export interface IAdhocStaticTestViewProps {
    deps: StaticTestViewDeps;
    tabStoreData: Pick<ITabStoreData, 'isChanged'>;
    selectedTest: VisualizationType;
    visualizationStoreData: IVisualizationStoreData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    configuration: IVisualizationConfiguration;
}

export const AdhocStaticTestView = NamedSFC<IAdhocStaticTestViewProps>('AdhocStaticTestView', ({ children, ...props }) => {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);
    const displayableData = props.configuration.displayableData;
    const content = props.configuration.detailsViewStaticContent;

    if (props.tabStoreData.isChanged) {
        return <TargetPageChangedView
            displayableData={displayableData}
            type={selectedTest}
            toggleClickHandler={clickHandler}
        />;
    }

    const givenProps: IStaticContentDetailsViewProps = {
        visualizationEnabled: scanData.enabled,
        onToggleClick: clickHandler,
        title: displayableData.title,
        toggleLabel: displayableData.toggleLabel,
        content,
    };

    return <StaticContentDetailsView {...givenProps} />;
});