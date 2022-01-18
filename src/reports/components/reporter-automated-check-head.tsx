// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { brand } from 'content/strings/application';
import * as React from 'react';
import { Head } from 'reports/components/head';
import * as reporterBundledStyles from '../bundled-reporter-styles';

export const ReporterHead = NamedFC('ReporterHead', () => {
    return (
        <Head
            titlePreface={brand}
            bundledStyles={reporterBundledStyles}
            title="automated checks result"
        />
    );
});
