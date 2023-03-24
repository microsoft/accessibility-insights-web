// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    AdhocIssuesTestViewProps,
    createTestView,
} from 'DetailsView/components/adhoc-issues-test-view';
import styles from 'DetailsView/components/adhoc-issues-test-view.scss';
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
