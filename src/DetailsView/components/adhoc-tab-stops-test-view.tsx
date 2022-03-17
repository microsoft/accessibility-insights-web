// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Toggle } from '@fluentui/react';
import { CollapsibleComponent } from 'common/components/collapsible-component';
import { FlaggedComponent } from 'common/components/flagged-component';
import { FocusComponent, FocusComponentDeps } from 'common/components/focus-component';
import { HeadingWithContentLink } from 'common/components/heading-with-content-link';
import { ThemeFamilyCustomizer } from 'common/components/theme-family-customizer';
import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { FeatureFlags } from 'common/feature-flags';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { TabStoreData } from 'common/types/store-data/tab-store-data';
import { UserConfigurationStoreData } from 'common/types/store-data/user-configuration-store';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { DetailsViewActionMessageCreator } from 'DetailsView/actions/details-view-action-message-creator';
import * as styles from 'DetailsView/components/adhoc-tab-stops-test-view.scss';
import { AutoDetectedFailuresDialog } from 'DetailsView/components/auto-detected-failures-dialog';
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
import * as React from 'react';
import { ContentLinkDeps } from 'views/content/content-link';
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
    userConfigurationStoreData: UserConfigurationStoreData;
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
                {props.featureFlagStoreData != null &&
                props.featureFlagStoreData[FeatureFlags.tabStopsAutomation] ? (
                    <li>
                        Record your results for each requirement:
                        <ol>
                            <li>
                                If you find any failures, select <Markup.Term>Fail</Markup.Term>,
                                then add them as failure instances.
                            </li>
                            <li>
                                Select <Markup.Term>Pass</Markup.Term> if all instances meet the
                                requirement.
                            </li>
                            <li>
                                <Markup.Emphasis>
                                    Review any auto-discovered failures to be sure they are valid.
                                </Markup.Emphasis>
                            </li>
                        </ol>
                    </li>
                ) : null}
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

        const tabStopsTestViewContents = (
            <>
                <HeadingWithContentLink
                    deps={props.deps}
                    headingTitleClassName={styles.tabStopsTestViewHeader}
                    headingTitle={displayableData.title}
                    secondaryText={` ${stepsText} `}
                    guidance={props.guidance}
                />
                {description}
                <Toggle
                    onClick={clickHandler}
                    id="tab-stops-visual-helper"
                    label="Visual helper"
                    checked={scanData.enabled}
                    className={styles.visualHelperToggle}
                />
                <CollapsibleComponent
                    header={
                        <span
                            className={styles.requirementHowToTestHeader}
                            role="heading"
                            aria-level={2}
                        >
                            How to test
                        </span>
                    }
                    content={howToTest}
                    contentClassName={requirementInstructionStyles.requirementInstructions}
                />
                <h2 className={styles.requirementTableTitle}>Record your results</h2>
                <ThemeFamilyCustomizer
                    themeFamily={'fast-pass'}
                    userConfigurationStoreData={props.userConfigurationStoreData}
                >
                    <TabStopsRequirementsTable
                        deps={props.deps}
                        requirementState={requirementState}
                        featureFlagStoreData={props.featureFlagStoreData}
                    />
                    <TabStopsFailedInstanceSection
                        deps={props.deps}
                        tabStopRequirementState={
                            props.visualizationScanResultData.tabStops.requirements
                        }
                        alwaysRenderSection={false}
                        sectionHeadingLevel={2}
                        featureFlagStoreData={props.featureFlagStoreData}
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
                    <FlaggedComponent
                        featureFlag={FeatureFlags.tabStopsAutomation}
                        featureFlagStoreData={props.featureFlagStoreData}
                        enableJSXElement={
                            <AutoDetectedFailuresDialog
                                visualizationScanResultData={props.visualizationScanResultData}
                            />
                        }
                    />
                </ThemeFamilyCustomizer>
            </>
        );

        return (
            <div className={styles.tabStopsTestViewContainer}>
                <div className={styles.tabStopsTestView}>{tabStopsTestViewContents}</div>
            </div>
        );
    },
);
