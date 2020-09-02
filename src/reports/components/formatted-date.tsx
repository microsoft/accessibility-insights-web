// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Globalization } from 'common/globalization';
import * as Moment from 'moment';
import * as React from 'react';

export type FormattedDateDeps = {
    globalization: Globalization;
};

export interface FormattedDateProps {
    deps: FormattedDateDeps;
    date: Date;
}

export class FormattedDate extends React.Component<FormattedDateProps> {
    public render(): JSX.Element {
        return <>{this.formatDateTime(this.props.date)}</>;
    }

    private formatDateTime(date: Date): string {
        const moment = Moment.utc(this.props.date);
        const localMoment = moment.locale(this.props.deps.globalization.languageCode);
        return localMoment.format('L LTS [UTC]Z');
    }
}
