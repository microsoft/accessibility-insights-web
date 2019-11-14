// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Focus'} />

        <h2>Why it matters </h2>
        <p>
            When interacting with a website or web app using a keyboard (with or
            without assistive technology), users need to know which component
            currently has the input focus. By default, web browsers indicate
            focus visually, but custom programming, styles, style sheets, and
            scripting can disrupt it.
        </p>
        <p>
            When navigating sequentially through a user interface, keyboard
            users need to encounter information in an order that preserves its
            meaning and allows them to perform all supported functions. By
            default, focus order follows the DOM order, but tabindex attributes
            and scripting can be added to modify the focus order.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide a visible focus indicator on the interactive element
                    that has the input focus. (<Link.WCAG_2_4_7 />)
                </h3>
                <ul>
                    <li>
                        Input focus is commonly indicated by a solid or dotted
                        border surrounding the element, but other visible
                        changes are acceptable.
                    </li>
                </ul>
                <h3>
                    Ensure interactive components receive focus in a logical,
                    usable order. (<Link.WCAG_2_4_3 />)
                </h3>
                <ul>
                    <li>
                        Typically, keyboard users should encounter interactive
                        components in the same order you would expect for mouse
                        users.
                    </li>
                </ul>
                <h3>
                    When previously hidden content is revealed, move focus into
                    the revealed content. (<Link.WCAG_2_4_3 />)
                </h3>
                <ul>
                    <li>
                        For example, opening a menu should move focus to the
                        first focusable menu option.
                    </li>
                    <li>
                        Opening a dialog should move focus to a component in the
                        dialog.
                    </li>
                </ul>
                <h3>
                    Handle focus correctly when revealed content is again
                    hidden. (<Link.WCAG_2_4_3 />)
                </h3>
                <ul>
                    <li>
                        In most cases, the best option is to move focus back to
                        the original trigger component.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don’t assume focus order must strictly follow a
                    left-to-right / top-to-bottom reading order. (
                    <Link.WCAG_2_4_3 />)
                </h3>
                <ul>
                    <li>
                        for example, if you expect mouse users to work down
                        through one column of content before moving to the next
                        column, make sure the focus order follows that path.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>
        <h3>
            Ensure interactive components provide a visible indication when they
            receive input focus
        </h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html">
                Understanding Success Criterion 2.4.7: Focus Visible
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G149">
                Using user interface components that are highlighted by the user
                agent when they receive focus
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C15">
                Using CSS to change the presentation of a user interface
                component when it receives focus
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G165">
                Using the default focus indicator for the platform so that high
                visibility default focus indicators will carry over
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G195">
                Using an author-supplied, highly visible focus indicator
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR31">
                Using script to change the background color or border of the
                element with focus
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F55">
                Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using
                script to remove focus when focus is received
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F78">
                Failure of Success Criterion 2.4.7 due to styling element
                outlines and borders in a way that removes or renders
                non-visible the visual focus indicator
            </Markup.HyperLink>
        </Markup.Links>

        <h3>
            Ensure interactive components receive focus in a logical, usable
            order
        </h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html">
                Understanding Success Criterion 2.4.3: Focus Order
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G59">
                Placing the interactive elements in an order that follows
                sequences and relationships within the content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H4">
                Creating a logical tab order through links, form controls, and
                objects
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C27">
                Making the DOM order match the visual order
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR26">
                Inserting dynamic content into the Document Object Model
                immediately following its trigger element
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR37">
                Creating Custom Dialogs in a Device Independent Way
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR27">
                Reordering page sections using the Document Object Model
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F44">
                Failure of Success Criterion 2.4.3 due to using tabindex to
                create a tab order that does not preserve meaning and
                operability
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F85">
                Failure of Success Criterion 2.4.3 due to using dialogs or menus
                that are not adjacent to their trigger control in the sequential
                navigation order
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://hiddedevries.nl/en/blog/2017-01-29-using-javascript-to-trap-focus-in-an-element">
                Using JavaScript to trap focus in an element
            </Markup.HyperLink>
            <Markup.HyperLink href="https://bitsofco.de/accessible-modal-dialog/">
                Creating an Accessible Modal Dialog
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices/">
                Dialog (Modal) in WAI-ARIA Authoring Practices 1.1
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
