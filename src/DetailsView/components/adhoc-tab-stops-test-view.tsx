// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationToggle } from 'common/components/visualization-toggle';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import * as styles from 'DetailsView/components/static-content-common.scss';
import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import {
    TabStopsRequirementsTable,
    TabStopsRequirementsTableDeps,
} from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { TargetPageChangedView } from 'DetailsView/components/target-page-changed-view';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentReference } from 'views/content/content-page';
import * as Markup from '../../assessments/markup';

export type AdhocTabStopsTestViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & TabStopsRequirementsTableDeps &
    TabStopsFailedInstanceSectionDeps &
    ContentLinkDeps;

export interface AdhocTabStopsTestViewProps {
    deps: AdhocTabStopsTestViewDeps;
    tabStoreData: Pick<TabStoreData, 'isChanged'>;
    configuration: VisualizationConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    visualizationStoreData: VisualizationStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    selectedTest: VisualizationType;
    clickHandlerFactory: DetailsViewToggleClickHandlerFactory;
    guidance?: ContentReference;
}

export const AdhocTabStopsTestView = NamedFC<AdhocTabStopsTestViewProps>(
    'AdhocTabStopsTestView',
    props => {
        const description = (
            <p>
                <Markup.Emphasis>
                    Note: this test requires you to use a keyboard and to visually identify
                    interactive elements.
                </Markup.Emphasis>
            </p>
        );

        const howToTest: JSX.Element = (
            <ol>
                <li>
                    Locate the visual helper on the target page, it will highlight element in focus
                    with an empty circle.
                </li>
                <li>
                    Use your keyboard to move input focus through all the interactive elements in
                    the page:
                    <ol>
                        <li>
                            Use <Markup.Term>Tab</Markup.Term> and{' '}
                            <Markup.Term>Shift+Tab</Markup.Term> to navigate between standalone
                            controls.{' '}
                        </li>
                        <li>
                            Use the arrow keys to navigate between the focusable elements within a
                            composite control.
                        </li>
                    </ol>
                </li>
            </ol>
        );

        const selectedTest = props.selectedTest;
        const displayableData = props.configuration.displayableData;
        const fastPassProvider = createFastPassProviderWithFeatureFlags(props.featureFlagStoreData);
        const stepsText = fastPassProvider.getStepsText(selectedTest);
        const tabStopsRequirementTableDeps = {
            tabStopsRequirementActionMessageCreator:
                props.deps.tabStopsRequirementActionMessageCreator,
        };
        const requirementState = props.visualizationScanResultData.tabStops.requirements;

        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const clickHandler = props.clickHandlerFactory.createClickHandler(
            selectedTest,
            !scanData.enabled,
        );
        const addFailureInstanceForRequirement = (requirementId: string): void => {
            //TODO: fill this in
            console.log(requirementId);
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

        return (
            <div className={styles.staticContentInDetailsView}>
                <h1>
                    {displayableData.title}
                    {` ${stepsText} `}
                    <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
                </h1>
                <VisualizationToggle
                    checked={scanData.enabled}
                    onClick={clickHandler}
                    label={displayableData.toggleLabel}
                    className={styles.detailsViewToggle}
                    visualizationName={displayableData.title}
                />
                {description}
                <RequirementInstructions howToTest={howToTest} />
                <TabStopsRequirementsTable
                    deps={tabStopsRequirementTableDeps}
                    requirementState={requirementState}
                    addFailureInstanceForRequirement={addFailureInstanceForRequirement}
                />
                <TabStopsFailedInstanceSection
                    deps={props.deps}
                    visualizationScanResultData={props.visualizationScanResultData}
                />
            </div>
        );
    },
);
