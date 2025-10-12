// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Sequence'} />

        <h2>Why it matters</h2>
        <p>
            Assistive technologies present content in DOM order (the order that it appears in the HTML), so it's important that the DOM
            order match the expected reading order. If they don't match, the content won't make sense to people who use assistive
            technologies.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    When using CSS to position meaningful content, ensure it still makes sense when CSS is disabled. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        If you use <Markup.Code>position:absolute</Markup.Code>, be sure the DOM order matches the expected reading
                        order.{' '}
                    </li>
                    <li>
                        Avoid using <Markup.Code>float:right</Markup.Code>, as it always creates a mismatch: elements displayed on the right
                        of the screen appear in the DOM before those on the left.{' '}
                    </li>
                </ul>
                <h3>
                    When using layout tables to position content, ensure it still makes sense when the table is linearized. (
                    <Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>Because assistive technologies read tables in DOM order, tables are presented row-by-row, not column-by-column.</li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>Don't use white space characters to create the appearance of columns.</h3>
                <ul>
                    <li>Instead, use a layout table or CSS to display the content in columns.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>
        <h3>Ensure the DOM order matches the expected reading order</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G57">
                Ordering the content in a meaningful sequence
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C6">
                Positioning content based on structural markup
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C27">
                Making the DOM order match the visual order
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F1">
                Failure of Success Criterion 1.3.2 due to changing the meaning of content by positioning information with CSS
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F49">
                Failure of Success Criterion 1.3.2 due to using an HTML layout table that does not make sense when linearized
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F33">
                Failure of Success Criterion 1.3.1 and 1.3.2 due to using white space characters to create multiple columns in plain text
                content
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
