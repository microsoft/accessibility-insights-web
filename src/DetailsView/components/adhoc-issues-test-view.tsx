// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { FlaggedComponent } from '../../common/components/flagged-component';
import { FeatureFlags } from '../../common/feature-flags';
import { NamedSFC } from '../../common/react/named-sfc';
import { VisualizationType } from '../../common/types/visualization-type';
import { CardsView } from './cards-view';
import { IssuesView, IssuesViewDeps, IssuesViewProps } from './issues-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocIssuesTestViewDeps = IssuesViewDeps;

export type AdhocIssuesTestViewProps = IssuesViewProps;

export const AdhocIssuesTestView = NamedSFC<AdhocIssuesTestViewProps>('AdhocIssuesTestView', ({ children, ...props }) => {
    if (props.tabStoreData.isChanged) {
        return createTargetPageChangedView(props);
    }

    return (
        <FlaggedComponent
            disableJSXElement={<IssuesView {...props} />}
            enableJSXElement={<CardsView />}
            featureFlag={FeatureFlags.universalCardsUI}
            featureFlagStoreData={props.featureFlagStoreData}
        />
    );
});

function createTargetPageChangedView(props: AdhocIssuesTestViewProps): JSX.Element {
    const selectedTest = props.selectedTest;
    const scanData = props.configuration.getStoreData(props.visualizationStoreData.tests);
    const clickHandler = props.clickHandlerFactory.createClickHandler(selectedTest, !scanData.enabled);

    return (
        <TargetPageChangedView
            displayableData={props.configuration.displayableData}
            visualizationType={selectedTest}
            toggleClickHandler={clickHandler}
        />
    );
}
