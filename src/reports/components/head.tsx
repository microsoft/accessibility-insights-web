// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import * as reportStyles from '../automated-checks-report.styles';

export type HeadProps = { titlePreface: string; bundledStyles: bundledStylesProp; title: string };

export type bundledStylesProp = {
    styleSheet: string;
};

export const Head = NamedFC<HeadProps>('Head', props => {
    const titleValue = `${props.titlePreface} ${props.title}`;
    // tslint:disable: react-no-dangerous-html
    return (
        <head>
            <meta charSet="UTF-8" />
            <title>{titleValue}</title>
            <style dangerouslySetInnerHTML={{ __html: reportStyles.styleSheet }} />
            <style dangerouslySetInnerHTML={{ __html: props.bundledStyles.styleSheet }} />
        </head>
    );
});
