// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as moment from 'moment';
import * as React from 'react';

export interface FormattedDateProps {
    date: Date;
}

export class FormattedDate extends React.Component<FormattedDateProps> {
    public render(): JSX.Element {
        return <>{this.formatDateTime(this.props.date)}</>;
    }

    private formatDateTime(date: Date): string {
        let momentDate = moment(this.props.date);
        return momentDate.toLocaleString();
    }
}
