// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Globalization } from 'common/globalization';
import { DateTime } from 'luxon';
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
        const utcDateTime = DateTime.fromJSDate(date, { zone: 'utc' });
        const localizedUtcDateTime = utcDateTime.setLocale(
            this.props.deps.globalization.languageCode,
        );
        return localizedUtcDateTime.toLocaleString(DateTime.DATETIME_FULL_WITH_SECONDS, {
            month: 'numeric',
            timeZoneName: 'short',
        });
    }
}
