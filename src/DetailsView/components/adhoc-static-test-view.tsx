// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import * as React from 'react';
import { ContentReference } from 'views/content/content-page';
import { VisualizationConfiguration } from '../../common/configs/visualization-configuration';
import { NamedFC } from '../../common/react/named-fc';
import { TabStoreData } from '../../common/types/store-data/tab-store-data';
import { VisualizationStoreData } from '../../common/types/store-data/visualization-store-data';
import { VisualizationType } from '../../common/types/visualization-type';
import { DetailsViewToggleClickHandlerFactory } from '../handlers/details-view-toggle-click-handler-factory';
import {
    StaticContentDetailsView,
    StaticContentDetailsViewDeps,
    StaticContentDetailsViewProps,
} from './static-content-details-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocStaticTestViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & StaticContentDetailsViewDeps;

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
}

export const AdhocStaticTestView = NamedFC<AdhocStaticTestViewProps>(
    'AdhocStaticTestView',
    ({ children, ...props }) => {
        const selectedTest = props.selectedTest;
        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const clickHandler = props.clickHandlerFactory.createClickHandler(
            selectedTest,
            !scanData.enabled,
        );
        const displayableData = props.configuration.displayableData;

        const stepsText = (): string => {
            const fastPassProvider = createFastPassProviderWithFeatureFlags(
                props.featureFlagStoreData,
            );
            return fastPassProvider.getStepsText(selectedTest);
        };

        if (props.tabStoreData.isChanged) {
            return (
                <TargetPageChangedView
                    displayableData={displayableData}
                    visualizationType={selectedTest}
                    toggleClickHandler={clickHandler}
                    featureFlagStoreData={props.featureFlagStoreData}
                    detailsViewActionMessageCreator={props.deps.detailsViewActionMessageCreator}
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
            stepsText: stepsText(),
        };

        return <StaticContentDetailsView {...givenProps} />;
    },
);
