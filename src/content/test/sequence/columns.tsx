// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { CodeExample } from 'views/content/markup/code-example';
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Content presented in multi-column format must support a correct reading sequence.</p>
        <h2>Why it matters</h2>
        <p>
            When white space characters or CSS spacers are used to arrange text visually to create the appearance of columns, sighted users
            can follow the visual cues to read the content in the correct order: from the top of the first column to its bottom, then to the
            top of the next column.
        </p>
        <p>
            Unless the structure implied by the visual appearance is also built into the code, people who use assistive technologies are
            likely to read the same content in an order that doesn't make sense: from the first line of the first column, to the first line
            of the next column, then back to the second line of the first column, and so on. (Also, a screen reader might announce each
            white space character individually.)
        </p>
        <h2>How to fix</h2>
        <p>
            Use one of the following techniques to restructure the content so that the DOM order matches the expected reading order:
            <ul>
                <li> Good: Modify the content so it has no visually apparent columns. </li>
                <li> Better: Use a layout table to display the content in columns.</li>
                <li> Best: Use CSS multi-column layout properties to display the content in columns.</li>
            </ul>
        </p>
        <Markup.PassFail
            failText={
                <p>
                    White space characters in a <Markup.Code>{'<pre>'}</Markup.Code> element are used to create the appearance of two
                    columns. When read in DOM order, the content doesn't make sense: "Slaughterhouse-five who becomes 'unstuck is Kurt
                    Vonnegut's in time' after he is…"
                </p>
            }
            failExample={
                <pre>
                    <CodeExample>
                        {`<pre>
[Slaughterhouse-five    who becomes 'unstuck
is Kurt Vonnegut's      in time' after he is
absurdist classic.      abducted by aliens
It introduces us to     from the planet
Billy Pilgrim, a man    Tralfamadore.]
</pre>`}
                    </CodeExample>
                </pre>
            }
            passText={
                <p>
                    The CSS <Markup.Code>column-count</Markup.Code> property is used to display the content in columns in a way that the DOM
                    order matches the expected reading order.
                </p>
            }
            passExample={`<style>
            .columns {column-count: 2;}
            </style>
            ...
            <div class="columns">
            [Slaughterhouse-five is Kurt Vonnegut's
            absurdist classic. It introduces us to
            Billy Pilgrim, a man who becomes "unstuck
            in time" after he is abducted by aliens
            from the planet Tralfamadore.]
            </div>
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
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Multiple-column_Layout">
                Multiple-column layout
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/css-multicol-1/">CSS Multi-column Layout Module Level 1</Markup.HyperLink>
        </Markup.Links>
    </>
));
