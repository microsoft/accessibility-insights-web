// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        When users navigate through a web page, they expect to encounter controls and other content in an order that makes sense and makes
        it easy to use the page's functionality. Poor focus order can be disorienting to people who use screen readers or screen magnifiers
        and to people with reading disorders. Poor focus order can also make it difficult or even painful for people who use keyboards
        because of mobility impairments.
    </p>
));

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Components must receive focus in an order that preserves meaning and operability.</p>

        <h2>Why it matters</h2>
        <p>
            When users navigate through a web page, they expect to encounter controls and other content in an order that makes sense and
            makes it easy to use the page's functionality. Poor focus order can be disorienting to people who use screen readers or screen
            magnifiers and to people with reading disorders. Poor focus order can also make it difficult or even painful for people who use
            keyboards because of mobility impairments.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I use a keyboard and a screen reader to navigate content and operate software. When creating solutions, organize content
                and controls so that I can understand the presentation, meaning and operation of the interface by the order in which
                information is presented. To 'see' it like I do, write down the text and controls in the order required to complete the
                task. Next, read the sequence out loud. If it doesn’t make sense to you, it is likely to confuse me and many other people."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Ensure interactive components receive focus in a logical, usable order.</p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <div>
                    <p>
                        A web form is organized as two columns. The first column allows users to provide their contact information (name,
                        address, phone, etc.). The second column allows users to select topics of interest to them.
                    </p>
                    <p>
                        The visual presentation suggests users should provide their contact information before selecting topics. The first
                        column's content appears first in the DOM, followed by the second column's content.
                    </p>
                    <p>
                        However, in a misguided belief that focus order must follow a left-to-right / top-to-bottom reading order, tabindex
                        values have been added so that focus moves back and forth between the two columns as the user tabs.
                    </p>
                </div>
            }
            passText={
                <p>
                    Tabindex values have been removed. Now Tabbing moves focus through all the content in the first column before moving it
                    to the second column.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html">
                Understanding Success Criterion 2.4.3: Focus Order
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G59">
                Placing the interactive elements in an order that follows sequences and relationships within the content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H4">
                Creating a logical tab order through links, form controls, and objects
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C27">
                Making the DOM order match the visual order
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR26">
                Inserting dynamic content into the Document Object Model immediately following its trigger element
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR37">
                Creating Custom Dialogs in a Device Independent Way
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR27">
                Reordering page sections using the Document Object Model
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F44">
                Failure of Success Criterion 2.4.3 due to using tabindex to create a tab order that does not preserve meaning and
                operability
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F85">
                Failure of Success Criterion 2.4.3 due to using dialogs or menus that are not adjacent to their trigger control in the
                sequential navigation order
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element">
                Using JavaScript to trap focus in an element
            </Markup.HyperLink>
            <Markup.HyperLink href="https://bitsofco.de/accessible-modal-dialog/">Creating an Accessible Modal Dialog</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices/">
                Dialog (Modal) in WAI-ARIA Authoring Practices 1.1
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
