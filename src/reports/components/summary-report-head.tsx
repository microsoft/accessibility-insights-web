// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { brand } from 'content/strings/application';
import * as React from 'react';
import * as reportStyles from '../automated-checks-report.styles';
import * as bundledStyles from '../bundled-reporter-styles';

export const SummaryReportHead = NamedFC('SummaryReportHead', () => {
    const titleValue = `${brand} automated checks result`;
    // tslint:disable: react-no-dangerous-html
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{titleValue}</title>
            <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
            <style dangerouslySetInnerHTML={{ __html: bundledStyles.styleSheet }} />
        </head>
    );
});
