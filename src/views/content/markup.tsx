// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { flatten } from 'lodash';
import * as React from 'react';
import Helmet from 'react-helmet';

import { Code, CodeBlock, Emphasis, Tag, Term } from '../../assessments/markup';
import { NewTabLink } from '../../common/components/new-tab-link';
import { CheckIcon } from '../../common/icons/check-icon';
import { CrossIcon } from '../../common/icons/cross-icon';
import { ContentActionMessageCreator } from '../../common/message-creators/content-action-message-creator';
import { productName } from '../../content/strings/application';
import { ContentPageComponent, ContentPageOptions } from './content-page';

type PassFailProps = {
    passText: JSX.Element;
    passExample?: React.ReactNode;
    failText: JSX.Element;
    failExample?: React.ReactNode;
};

type CodeExampleProps = {
    title?: React.ReactNode;
    children: string;
};

export type Markup = {
    Tag: React.SFC;
    Code: React.SFC;
    Term: React.SFC;
    Emphasis: React.SFC;
    Do: React.SFC;
    Dont: React.SFC;
    Pass: React.SFC;
    Fail: React.SFC;
    PassFail: React.SFC<PassFailProps>;
    Columns: React.SFC;
    Column: React.SFC;
    Inline: React.SFC;
    HyperLink: React.SFC<{ href: string }>;
    Title: React.SFC<{ children: string }>;
    Highlight: React.SFC;
    CodeExample: React.SFC<CodeExampleProps>;
    Links: React.SFC;
    Table: React.SFC;
    LandmarkLegend: React.SFC<{ role: string }>;
    ProblemList: React.SFC;
    Include: React.SFC<{ content: ContentPageComponent }>;
};

export type MarkupDeps = { contentActionMessageCreator: ContentActionMessageCreator };

export const createMarkup = (deps: MarkupDeps, options: ContentPageOptions) => {
    const { openContentHyperLink } = deps.contentActionMessageCreator;

    function Include(props: { content: ContentPageComponent }): JSX.Element {
        const Content = props.content;
        return <Content deps={deps} options={options} />;
    }

    function Title(props: { children: string }): JSX.Element {
        const helmet = (
            <Helmet>
                <title>
                    {props.children} - {productName}
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

        return (
            <NewTabLink href={href} onClick={e => openContentHyperLink(e, href)}>
                {props.children}
            </NewTabLink>
        );
    }

    function Links(props: { children: React.ReactNode }): JSX.Element {
        return (
            <>
                <div className="content-hyperlinks">{React.Children.map(props.children, el => el)}</div>
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

    function CodeExample(props: CodeExampleProps): JSX.Element {
        const { children } = props;

        function getRegions(code: string): string[] {
            if (code.length === 0) {
                return [];
            }

            if (code[0] === '[') {
                const end = code.indexOf(']');
                if (end > 0) {
                    return [code.slice(0, end + 1), ...getRegions(code.slice(end + 1))];
                } else {
                    return [code + ']'];
                }
            }

            const start = code.indexOf('[');
            if (start > 0) {
                return [code.slice(0, start), ...getRegions(code.slice(start))];
            } else {
                return [code];
            }
        }

        function renderLineBreaks(str: string): React.ReactNode[] {
            return flatten(str.split('\n').map(s => [<br />, s])).slice(1);
        }

        function renderRegion(str: string, index: number): React.ReactNode[] {
            if (str[0] === '[') {
                return [
                    <span key={index} className="highlight">
                        {renderLineBreaks(str.slice(1, -1))}
                    </span>,
                ];
            } else {
                return renderLineBreaks(str);
            }
        }

        const regions = getRegions(children);
        const formattedCode = flatten(regions.map(renderRegion));

        return (
            <div className="code-example">
                {props.title && (
                    <div className="code-example-title">
                        <h4>{props.title}</h4>
                    </div>
                )}
                <div className="code-example-code">
                    <CodeBlock>{formattedCode}</CodeBlock>
                </div>
            </div>
        );
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
