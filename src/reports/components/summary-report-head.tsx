// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { brand } from 'content/strings/application';
import * as React from 'react';
import * as bundledStyles from '../../DetailsView/bundled-details-view-styles';
import * as summaryReportStyles from '../summary-report.styles';

export const SummaryReportHead = NamedFC('SummaryReportHead', () => {
    // tslint:disable: react-no-dangerous-html
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{brand} automated checks result</title>
            <style dangerouslySetInnerHTML={{ __html: summaryReportStyles.styleSheet }} />
            <style dangerouslySetInnerHTML={{ __html: bundledStyles.styleSheet }} />
        </head>
    );
});
