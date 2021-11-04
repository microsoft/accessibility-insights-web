// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationScanResultData } from 'common/types/store-data/visualization-scan-result-data';
import { VisualizationType } from 'common/types/visualization-type';
import { TabStopRequirementActionMessageCreator } from 'DetailsView/actions/tab-stop-requirement-action-message-creator';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import * as styles from 'DetailsView/components/static-content-common.scss';
import {
    TabStopsFailedInstanceSection,
    TabStopsFailedInstanceSectionDeps,
} from 'DetailsView/components/tab-stops-failed-instance-section';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import * as React from 'react';
import * as Markup from '../../assessments/markup';

export type AdhocTabStopsTestViewDeps = TabStopsFailedInstanceSectionDeps & {
    tabStopRequirementActionMessageCreator: TabStopRequirementActionMessageCreator;
};

export interface AdhocTabStopsTestViewProps {
    deps: AdhocTabStopsTestViewDeps;
    configuration: VisualizationConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    visualizationScanResultData: VisualizationScanResultData;
    selectedTest: VisualizationType;
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

        return (
            <div className={styles.staticContentInDetailsView}>
                <h1>
                    {displayableData.title}
                    {` ${stepsText} `}
                </h1>
                {description}
                <RequirementInstructions howToTest={howToTest} />
                <TabStopsFailedInstanceSection
                    deps={props.deps}
                    visualizationScanResultData={props.visualizationScanResultData}
                />
            </div>
        );
    },
);
