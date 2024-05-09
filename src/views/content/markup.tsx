// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { Code, Emphasis, Tag, Term } from 'assessments/markup';
import { NewTabLink } from 'common/components/new-tab-link';
import { CheckIcon } from 'common/icons/check-icon';
import { CrossIcon } from 'common/icons/cross-icon';
import { ContentActionMessageCreator } from 'common/message-creators/content-action-message-creator';
import { TextContent } from 'content/strings/text-content';
import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { CodeExample, CodeExampleProps } from './markup/code-example';

type PassFailProps = {
    passText: JSX.Element;
    passExample?: React.ReactNode;
    failText: JSX.Element;
    failExample?: React.ReactNode;
};

export type Markup = {
    Tag: React.FC<React.PropsWithChildren<unknown>>;
    Code: React.FC<React.PropsWithChildren<unknown>>;
    Term: React.FC<React.PropsWithChildren<unknown>>;
    Emphasis: React.FC<React.PropsWithChildren<unknown>>;
    Do: React.FC<React.PropsWithChildren<unknown>>;
    Dont: React.FC<React.PropsWithChildren<unknown>>;
    Pass: React.FC<React.PropsWithChildren<unknown>>;
    Fail: React.FC<React.PropsWithChildren<unknown>>;
    PassFail: React.FC<React.PropsWithChildren<PassFailProps>>;
    Columns: React.FC<React.PropsWithChildren<unknown>>;
    Column: React.FC<React.PropsWithChildren<unknown>>;
    Inline: React.FC<React.PropsWithChildren<unknown>>;
    HyperLink: React.FC<React.PropsWithChildren<{ href: string }>>;
    Title: React.FC<React.PropsWithChildren<{ children: string }>>;
    Highlight: React.FC<React.PropsWithChildren<unknown>>;
    CodeExample: React.FC<React.PropsWithChildren<CodeExampleProps>>;
    Links: React.FC<React.PropsWithChildren<unknown>>;
    Table: React.FC<React.PropsWithChildren<unknown>>;
    LandmarkLegend: React.FC<React.PropsWithChildren<{ role: string }>>;
    ProblemList: React.FC<React.PropsWithChildren<unknown>>;
    Include: React.FC<React.PropsWithChildren<{ content: MarkupBasedComponent }>>;
};

export type MarkupDeps = {
    textContent: Pick<TextContent, 'applicationTitle'>;
    contentActionMessageCreator: Pick<ContentActionMessageCreator, 'openContentHyperLink'>;
};

export interface MarkupOptions {
    setPageTitle?: boolean;
}

export type MarkupBasedComponentProps = {
    deps: MarkupDeps;
    options?: MarkupOptions;
};

export type MarkupBasedComponent = React.FC<React.PropsWithChildren<MarkupBasedComponentProps>>;

export const createMarkup = (deps: MarkupDeps, options?: MarkupOptions) => {
    function Include(props: { content: MarkupBasedComponent }): JSX.Element {
        const Content = props.content;
        return <Content deps={deps} options={options} />;
    }

    function Title(props: { children: string }): JSX.Element {
        const { applicationTitle } = deps.textContent;
        const titleValue = `${props.children} - ${applicationTitle}`;
        const helmet = (
            <Helmet>
                <title>
                    {titleValue}
                </title>
            </Helmet>
        );

        return (
            <>
                {options && options.setPageTitle && helmet}
                <h1>{props.children}</h1>
            </>
        );
    }

    function HyperLink(props: { href: string; children: React.ReactNode }): JSX.Element {
        const { href } = props;
        const { openContentHyperLink } = deps.contentActionMessageCreator;

        return (
            <NewTabLink href={href} onClick={e => openContentHyperLink(e, href)}>
                {props.children}
            </NewTabLink>
        );
    }

    function Links(props: { children: React.ReactNode }): JSX.Element {
        return (
            <>
                <div className="content-hyperlinks">
                    {React.Children.map(props.children, el => el)}
                </div>
            </>
        );
    }

    function Inline(props: { children: React.ReactNode }): JSX.Element {
        return <div className="content-inline">{props.children}</div>;
    }

    function Do(props: { children: React.ReactNode }): JSX.Element {
        return (
            <Column>
                <div className="do-header">
                    <h2>Do</h2>
                    <CheckIcon />
                </div>
                <div className="do-section">{props.children}</div>
            </Column>
        );
    }

    function Dont(props: { children: React.ReactNode }): JSX.Element {
        return (
            <Column>
                <div className="dont-header">
                    <h2>Don't</h2>
                    <CrossIcon />
                </div>
                <div className="dont-section">{props.children}</div>
            </Column>
        );
    }

    function Pass(props: { children: React.ReactNode }): JSX.Element {
        return (
            <Column>
                <div className="pass-header">
                    <CheckIcon /> <h3>Pass</h3>
                </div>
                <div className="pass-section">{props.children}</div>
            </Column>
        );
    }

    function Fail(props: { children: React.ReactNode }): JSX.Element {
        return (
            <Column>
                <div className="fail-header">
                    <CrossIcon /> <h3>Fail</h3>
                </div>
                <div className="fail-section">{props.children}</div>
            </Column>
        );
    }

    function LandmarkLegend(props: { role: string; children: React.ReactNode }): JSX.Element {
        return <span className={`landmarks-legend ${props.role}-landmark`}>{props.children}</span>;
    }

    function Highlight(props: { children: React.ReactNode }): JSX.Element {
        return <span className="highlight">{props.children}</span>;
    }

    function Table(props: { children: React.ReactNode }): JSX.Element {
        return <ul className="table">{props.children}</ul>;
    }

    function ProblemList(props: { children: React.ReactNode }): JSX.Element {
        return <ul className="accessibility-problems-list">{props.children}</ul>;
    }

    function Columns(props: { children: React.ReactNode }): JSX.Element {
        return <div className="columns">{props.children}</div>;
    }

    function Column(props: { children: React.ReactNode }): JSX.Element {
        return <div className="column">{props.children}</div>;
    }

    function PassFail(props: PassFailProps): React.ReactNode {
        const { passText, passExample, failText, failExample } = props;

        function formatExample(example: string | React.ReactNode): React.ReactNode {
            if (typeof example === 'string') {
                return <CodeExample>{example}</CodeExample>;
            }
            return example;
        }

        return (
            <div className="pass-fail-grid">
                <div className="fail-section">
                    <div className="fail-header">
                        <CrossIcon /> <h3>Fail</h3>
                    </div>
                    {failText}
                </div>
                {failExample && <div className="fail-example">{formatExample(failExample)}</div>}
                <div className="pass-section">
                    <div className="pass-header">
                        <CheckIcon /> <h3>Pass</h3>
                    </div>
                    {passText}
                </div>
                {passExample && <div className="pass-example">{formatExample(passExample)}</div>}
            </div>
        );
    }

    return {
        Tag,
        Code,
        Term,
        Emphasis,
        Do,
        Dont,
        Pass,
        Fail,
        PassFail,
        Columns,
        Column,
        Inline,
        HyperLink,
        Title,
        CodeExample,
        Highlight,
        Links,
        LandmarkLegend,
        Table,
        ProblemList,
        options,
        Include,
    } as Markup;
};
