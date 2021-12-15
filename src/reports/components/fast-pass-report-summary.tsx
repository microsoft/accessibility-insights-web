// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { FastPassOutcomeSummaryBar } from 'reports/components/fast-pass-outcome-summary-bar';

export interface FastPassReportSummaryProps {

};

export class FastPassReportSummary extends React.Component<FastPassReportSummaryProps> {
    public render(): JSX.Element {
        return (
            <>
            <h2>Summary</h2>
            <FastPassOutcomeSummaryBar />
            </>
        );
    }
};
