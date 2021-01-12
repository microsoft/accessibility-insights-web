// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Markup from 'assessments/markup';
import * as React from 'react';

describe('markup tags', () => {
    test('test simple Tag', () => {
        const rendered = Markup.Tag({ tagName: 'myTag' });
        const expected = <Markup.CodeTerm>&lt;{'myTag'}&gt;</Markup.CodeTerm>;
        expect(rendered).toEqual(expected);
    });

    test('test Tag with isBold = false override', () => {
        const rendered = Markup.Tag({ tagName: 'myTag', isBold: false });
        const expected = <Markup.Code>&lt;{'myTag'}&gt;</Markup.Code>;
        expect(rendered).toEqual(expected);
    });

    test('test Tag with isBold = true override', () => {
        const rendered = Markup.Tag({ tagName: 'myTag', isBold: true });
        const expected = <Markup.CodeTerm>&lt;{'myTag'}&gt;</Markup.CodeTerm>;
        expect(rendered).toEqual(expected);
    });

    test('test Emphasis', () => {
        const rendered = Markup.Emphasis({ children: 'children' });
        const expected = <em>children</em>;
        expect(rendered).toEqual(expected);
    });

    test('test Term', () => {
        const rendered = Markup.Term({ children: 'children' });
        const expected = <strong>children</strong>;
        expect(rendered).toEqual(expected);
    });

    test('test Code', () => {
        const rendered = Markup.Code({ children: 'children' });
        const expected = <span className="insights-code">children</span>;
        expect(rendered).toEqual(expected);
    });

    test('test CodeBlock', () => {
        const rendered = Markup.CodeBlock({ children: 'children' });
        const expected = <div className="insights-code">children</div>;
        expect(rendered).toEqual(expected);
    });

    test('test CodeTerm', () => {
        const rendered = Markup.CodeTerm({ children: 'children' });
        const expected = (
            <Markup.Term>
                <Markup.Code>children</Markup.Code>
            </Markup.Term>
        );
        expect(rendered).toEqual(expected);
    });

    test('test GreaterThanOrEqualTo', () => {
        const rendered = Markup.GreaterThanOrEqualTo();
        const expected = <span>&#8805;</span>;
        expect(rendered).toEqual(expected);
    });

    test('test NonBreakingSpace', () => {
        const rendered = Markup.NonBreakingSpace();
        const expected = <span>&nbsp;</span>;
        expect(rendered).toEqual(expected);
    });
});
