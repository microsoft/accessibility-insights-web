// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import {
    ReportInstanceList,
    ReportInstanceListProps,
} from 'reports/components/report-instance-list';
import styles from './tab-stops-report-instance-list.scss';

export type TabStopsReportInstanceListProps = ReportInstanceListProps;

export const TabStopsReportInstanceList = NamedFC<TabStopsReportInstanceListProps>(
    'TabStopsReportInstanceList',
    props => {
        return (
            <div className={styles.instanceList}>
                <ReportInstanceList {...props} />
            </div>
        );
    },
);
