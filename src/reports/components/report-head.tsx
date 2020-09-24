// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import { brand, title } from 'content/strings/application';
import * as React from 'react';
import * as bundledStyles from '../../DetailsView/bundled-details-view-styles';
import * as reportStyles from '../automated-checks-report.styles';

export type HeadProps = { titlePreface: string };

export const WebReportHead = NamedFC('WebReportHead', () => {
    return <Head titlePreface={title} />;
});

export const ReporterHead = NamedFC('ReporterHead', () => {
    return <Head titlePreface={brand} />;
});

export const Head = NamedFC<HeadProps>('Head', props => {
    // tslint:disable: react-no-dangerous-html
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{props.titlePreface} automated checks result</title>
            <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
            <style dangerouslySetInnerHTML={{ __html: bundledStyles.styleSheet }} />
        </head>
    );
});
