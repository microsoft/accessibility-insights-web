// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export function Tag(props: { tagName: string; isBold?: boolean }): JSX.Element {
    const isBold = props.hasOwnProperty('isBold') ? props.isBold : true;
    return isBold ? <CodeTerm>&lt;{props.tagName}&gt;</CodeTerm> : <Code>&lt;{props.tagName}&gt;</Code>;
}

export function Emphasis(props: { children: React.ReactNode }): JSX.Element {
    return <i>{props.children}</i>;
}

export function Term(props: { children: React.ReactNode }): JSX.Element {
    return <b>{props.children}</b>;
}

export function Code(props: { children: React.ReactNode }): JSX.Element {
    return <span className="insights-code">{props.children}</span>;
}

export const GreaterThanOrEqualTo = () => <span>&#8805;</span>;

export const NonBreakingSpace = () => <span>&nbsp;</span>;

export function CodeTerm(props: { children: React.ReactNode }): JSX.Element {
    return (
        <Term>
            <Code>{props.children}</Code>
        </Term>
    );
}
