// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CollapsibleComponent } from 'common/components/collapsible-component';
import { FlaggedComponent } from 'common/components/flagged-component';
import { FocusComponent, FocusComponentDeps } from 'common/components/focus-component';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as styles from 'DetailsView/components/adhoc-tab-stops-test-view.scss';
import * as requirementInstructionStyles from 'DetailsView/components/requirement-instructions.scss';
import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import {
    TabStopsFailedInstancePanel,
    TabStopsFailedInstancePanelDeps,
} from 'DetailsView/components/tab-stops/tab-stops-failed-instance-panel';
import {
    TabStopsRequirementsTable,
    TabStopsRequirementsTableDeps,
} from 'DetailsView/components/tab-stops/tab-stops-requirements-table';
import { TabStopsViewStoreData } from 'DetailsView/components/tab-stops/tab-stops-view-store-data';
import { TargetPageChangedView } from 'DetailsView/components/target-page-changed-view';
import { DetailsViewToggleClickHandlerFactory } from 'DetailsView/handlers/details-view-toggle-click-handler-factory';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import { Toggle } from 'office-ui-fabric-react';
import * as React from 'react';
import { ContentLink, ContentLinkDeps } from 'views/content/content-link';
import { ContentReference } from 'views/content/content-page';
import * as Markup from '../../assessments/markup';

export type AdhocTabStopsTestViewDeps = {
    detailsViewActionMessageCreator: DetailsViewActionMessageCreator;
} & TabStopsRequirementsTableDeps &
    TabStopsFailedInstancePanelDeps &
    TabStopsFailedInstanceSectionDeps &
    ContentLinkDeps &
    FocusComponentDeps;

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
    tabStopsViewStoreData: TabStopsViewStoreData;
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
        const requirementState = props.visualizationScanResultData.tabStops.requirements;

        const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
        const clickHandler = props.clickHandlerFactory.createClickHandler(
            selectedTest,
            !scanData.enabled,
        );

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
            <div className={styles.tabStopsTestViewContainer}>
                <div className={styles.tabStopsTestView}>
                    <h1>
                        {displayableData.title}
                        {` ${stepsText} `}
                        <ContentLink deps={props.deps} reference={props.guidance} iconName="info" />
                    </h1>
                    {description}
                    <Toggle
                        onClick={clickHandler}
                        label="Visual helper"
                        checked={scanData.enabled}
                        className={styles.visualHelperToggle}
                    />
                    <CollapsibleComponent
                        header={<h2 className={styles.requirementHowToTestHeader}>How to test</h2>}
                        content={howToTest}
                        contentClassName={requirementInstructionStyles.requirementInstructions}
                    />
                    <h2 className={styles.requirementTableTitle}>Record your results</h2>
                    <TabStopsRequirementsTable
                        deps={props.deps}
                        requirementState={requirementState}
                    />
                    <TabStopsFailedInstanceSection
                        deps={props.deps}
                        tabStopRequirementState={
                            props.visualizationScanResultData.tabStops.requirements
                        }
                        alwaysRenderSection={false}
                    />
                    <TabStopsFailedInstancePanel
                        deps={props.deps}
                        failureInstanceState={props.tabStopsViewStoreData.failureInstanceState}
                        requirementState={requirementState}
                    />
                    <FlaggedComponent
                        featureFlag={FeatureFlags.tabStopsAutomation}
                        featureFlagStoreData={props.featureFlagStoreData}
                        enableJSXElement={
                            <FocusComponent deps={props.deps} tabbingEnabled={scanData.enabled} />
                        }
                    />
                </div>
            </div>
        );
    },
);
