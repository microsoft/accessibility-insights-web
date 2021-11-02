// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { VisualizationConfiguration } from 'common/configs/visualization-configuration';
import { NamedFC } from 'common/react/named-fc';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { VisualizationType } from 'common/types/visualization-type';
import { RequirementInstructions } from 'DetailsView/components/requirement-instructions';
import * as styles from 'DetailsView/components/static-content-common.scss';
import { createFastPassProviderWithFeatureFlags } from 'fast-pass/fast-pass-provider';
import * as React from 'react';
import * as Markup from '../../assessments/markup';

export interface AdhocTabStopsTestViewProps {
    configuration: VisualizationConfiguration;
    featureFlagStoreData: FeatureFlagStoreData;
    selectedTest: VisualizationType;
}

export const AdhocTabStopsTestView = NamedFC<AdhocTabStopsTestViewProps>(
    'AdhocTabStopsTestView',
    props => {
        const displayableData = props.configuration.displayableData;

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
                            composite control.=
                        </li>
                    </ol>
                </li>
            </ol>
        );

        const selectedTest = props.selectedTest;

        const stepsText = (): string => {
            const fastPassProvider = createFastPassProviderWithFeatureFlags(
                props.featureFlagStoreData,
            );
            return fastPassProvider.getStepsText(selectedTest);
        };

        const givenProps = {
            title: displayableData.title,
            stepsText: stepsText(),
        };

        return (
            <div className={styles.staticContentInDetailsView}>
                <h1>
                    {givenProps.title}
                    {` ${givenProps.stepsText} `}
                </h1>
                {description}
                <RequirementInstructions howToTest={howToTest} />
            </div>
        );
    },
);
