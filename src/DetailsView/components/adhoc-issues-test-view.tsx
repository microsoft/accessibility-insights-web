// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { ScanIncompleteWarningId } from 'common/types/scan-incomplete-warnings';
import { DetailsViewSwitcherNavConfiguration } from 'DetailsView/components/details-view-switcher-nav';
import { ScanIncompleteWarning, ScanIncompleteWarningDeps } from 'DetailsView/components/scan-incomplete-warning';
import * as React from 'react';

import { NamedFC } from '../../common/react/named-fc';
import { DetailsListIssuesView, DetailsListIssuesViewDeps, DetailsListIssuesViewProps } from './details-list-issues-view';
import { TargetPageChangedView } from './target-page-changed-view';

export type AdhocIssuesTestViewDeps = DetailsListIssuesViewDeps & ScanIncompleteWarningDeps;

export type AdhocIssuesTestViewProps = DetailsListIssuesViewProps & {
    deps: AdhocIssuesTestViewDeps;
    switcherNavConfiguration: DetailsViewSwitcherNavConfiguration;
    scanIncompleteWarnings: ScanIncompleteWarningId[];
};

export const AdhocIssuesTestView = NamedFC<AdhocIssuesTestViewProps>('AdhocIssuesTestView', ({ children, ...props }) => {
    if (props.tabStoreData.isChanged) {
        return createTargetPageChangedView(props);
    }

    return (
        <>
            <ScanIncompleteWarning
                deps={props.deps}
                warnings={props.scanIncompleteWarnings}
                warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                test={props.selectedTest}
            />
            <DetailsListIssuesView {...props} />
        </>
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
            featureFlagStoreData={props.featureFlagStoreData}
        />
    );
}
