// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CodeBlock } from 'assessments/markup';
import { flatten } from 'lodash';
import * as React from 'react';

export type CodeExampleProps = {
    title?: React.ReactNode;
    children: string;
};

export function CodeExample(props: CodeExampleProps): JSX.Element {
    const { children } = props;
    let lineCount = 0;

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
        return flatten(
            str.split('\n').map(s => [<br key={`line-breaker-${lineCount++}`} />, s]),
        ).slice(1);
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
