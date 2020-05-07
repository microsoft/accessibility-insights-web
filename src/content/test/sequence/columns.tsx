// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CodeExample } from 'views/content/markup/code-example';
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>White space characters must not be used to create the appearance of columns.</p>
        <h2>Why it matters</h2>
        <p>
            When white space characters are used to arrange text visually to create the appearance of columns, sighted users perceive a
            structure that isn't represented in the code. Because assistive technologies present content in DOM order (the order that
            content appears in the HTML), people who use assistive technologies are likely to read the text in an order that doesn't make
            sense. (Also, a screen reader might announce each space character individually.)
        </p>
        <h2>How to fix</h2>
        <p>
            Use one of the following techniques to restructure the content so that the DOM order matches the expected reading order:
            <ul>
                <li> Good: Modify the content so it has no visually apparent columns. </li>
                <li> Better: Use a layout table to display the content in columns.</li>
                <li> Best: Use CSS to display the content in columns.</li>
            </ul>
        </p>
        <Markup.PassFail
            failText={
                <p>
                    White space characters in a <Markup.Code>{'<pre>'}</Markup.Code> element are used to create the appearance of two
                    columns. When read in DOM order, the content doesn't make sense: "We the People general of the United Welfare, and
                    States, in secure the Order…"{' '}
                </p>
            }
            failExample={
                <pre>
                    <CodeExample>
                        {`<pre>
[We the People     promote the general
of the United     Welfare, and
States, in        secure the
Order to form a   Blessings of
more perfect      Liberty to
Union,            ourselves and
establish         our Posterity,
Justice, insure   do ordain and
domestic          establish this
Tranquility,      Constitution
provide for the   for the United
common defense,   States of America.]
</pre>`}
                    </CodeExample>
                </pre>
            }
            passText={<p>CSS is used to display the content in columns in a way that the DOM order matches the expected reading order.</p>}
            passExample={`<style>
            * {box-sizing: border-box;}
            .column {float:left; width:50%;
            padding:10px;}
            </style>
            ...
            <div class="column">[We the People
            of the United States,
            in Order to form a
            more perfect Union,
            establish Justice,
            insure domestic Tranquility,
            provide for the common defense,
            ]</div>
            <div class="column">[promote the
            general Welfare,
            and secure
            the blessings of Liberty
            to ourselves and our Posterity,
            do ordain and establish this Constitution
            for the United States of America.]</div>
            </body>
            </html>
            `}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G57">
                Ordering the content in a meaningful sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F33">
                Failure of Success Criterion 1.3.1 and 1.3.2 due to using white space characters to create multiple columns in plain text
                content
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
