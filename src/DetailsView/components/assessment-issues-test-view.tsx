// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { AdhocIssuesTestViewProps } from 'DetailsView/components/adhoc-issues-test-view';
import styles from 'DetailsView/components/adhoc-issues-test-view.scss';
import { BannerWarnings } from 'DetailsView/components/banner-warnings';
import { DetailsListIssuesView } from 'DetailsView/components/details-list-issues-view';
import * as React from 'react';
import { NamedFC } from '../../common/react/named-fc';

export type AssessmentIssuesTestViewProps = AdhocIssuesTestViewProps;

export const AssessmentIssuesTestView = NamedFC<AssessmentIssuesTestViewProps>(
    'AssessmentIssuesTestView',
    props => {
        const view = createTestView(props);

        return <div className={styles.issuesTestView}>{view}</div>;
    },
);

function createTestView(props: AssessmentIssuesTestViewProps): JSX.Element {
    return (
        <>
            <BannerWarnings
                deps={props.deps}
                warnings={props.scanIncompleteWarnings}
                warningConfiguration={props.switcherNavConfiguration.warningConfiguration}
                test={props.selectedTest}
                visualizationStoreData={props.visualizationStoreData}
            />
            <DetailsListIssuesView {...props} />
        </>
    );
}
