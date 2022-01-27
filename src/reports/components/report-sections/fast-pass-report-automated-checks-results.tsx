// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { FailedInstancesSection } from 'common/components/cards/failed-instances-section';
import { NamedFC } from 'common/react/named-fc';
import { _electron } from 'playwright';
import * as React from 'react';
import { FastPassReportProps } from 'reports/components/fast-pass-report';
import { IncompleteChecksSection } from 'reports/components/report-sections/incomplete-checks-section';
import { PassedChecksSection } from 'reports/components/report-sections/passed-checks-section';

export type FastPassReportAutomatedChecksResultsProps = FastPassReportProps;

export const FastPassReportAutomatedChecksResults =
    NamedFC<FastPassReportAutomatedChecksResultsProps>(
        'FastPassReportAutomatedChecksResults',
        props => {
            if (props.results.automatedChecks === null) {
                return <p>Automated checks were not run.</p>;
            }

            const automatedChecksTestKey = 'automated-checks';

            return (
                <>
                    <FailedInstancesSection
                        key={1}
                        {...props}
                        userConfigurationStoreData={null}
                        cardsViewData={props.results.automatedChecks}
                    />
                    <IncompleteChecksSection
                        key={2}
                        {...props}
                        cardsViewData={props.results.automatedChecks}
                        testKey={automatedChecksTestKey}
                    />
                    <PassedChecksSection
                        key={3}
                        {...props}
                        cardsViewData={props.results.automatedChecks}
                        testKey={automatedChecksTestKey}
                    />
                </>
            );
        },
    );
