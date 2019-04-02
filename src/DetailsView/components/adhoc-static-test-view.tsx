// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { VisualizationConfiguration } from '../../common/configs/visualization-configuration-factory';
import { NamedSFC } from '../../common/react/named-sfc';
import { IVisualizationStoreData } from '../../common/types/store-data/ivisualization-store-data';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { ContentReference } from '../../views/content/content-page';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import { StaticContentDetailsView, StaticContentDetailsViewDeps, StaticContentDetailsViewProps } from './static-content-details-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocStaticTestViewDeps = StaticContentDetailsViewDeps;

export interface AdhocStaticTestViewProps {
    deps: AdhocStaticTestViewDeps;
    tabStoreData: Pick<TabStoreData, 'isChanged'>;
    selectedTest: VisualizationType;
    visualizationStoreData: IVisualizationStoreData;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    configuration: VisualizationConfiguration;
    content?: ContentReference;
    guidance?: ContentReference;
}

export const AdhocStaticTestView = NamedSFC<AdhocStaticTestViewProps>('AdhocStaticTestView', ({ children, ...props }) => {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);
    const displayableData = props.configuration.displayableData;

    if (props.tabStoreData.isChanged) {
        return (
            <TargetPageChangedView displayableData={displayableData} visualizationType={selectedTest} toggleClickHandler={clickHandler} />
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

    return <StaticContentDetailsView {...givenProps} />;
});
