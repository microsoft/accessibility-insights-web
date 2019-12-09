// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

export function Tag(props: { tagName: string; isBold?: boolean }): JSX.Element {
    const isBold = props.hasOwnProperty('isBold') ? props.isBold : true;
    return isBold ? (
        <CodeTerm>&lt;{props.tagName}&gt;</CodeTerm>
    ) : (
        <Code>&lt;{props.tagName}&gt;</Code>
    );
}

export function Emphasis(props: { children: React.ReactNode }): JSX.Element {
    return <em>{props.children}</em>;
}

export function Term(props: { children: React.ReactNode }): JSX.Element {
    return <strong>{props.children}</strong>;
}

export function Code(props: { children: React.ReactNode }): JSX.Element {
    return <span className="insights-code">{props.children}</span>;
}

export function CodeBlock(props: { children: React.ReactNode }): JSX.Element {
    return <div className="insights-code">{props.children}</div>;
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
