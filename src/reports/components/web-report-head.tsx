// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { title } from 'content/strings/application';
import * as React from 'react';
import { Head } from 'reports/components/head';
import * as detailsViewBundledStyles from '../../DetailsView/bundled-details-view-styles';

export const WebReportHead = NamedFC('WebReportHead', () => {
    return (
        <Head
            titlePreface={title}
            bundledStyles={detailsViewBundledStyles}
            title="FastPass results"
        />
    );
});
