// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Closing revealed content must move input focus to the component that revealed it.</p>

        <h2>Why it matters</h2>
        <p>
            When a keyboard user dismisses revealed content (such as closing a menu or dialog), they expect focus to return to the trigger
            control that launched the content. Otherwise, they will have to explore the page content to re-orient themselves.
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>
                Good: Ensure that the revealed content appears in the DOM immediately after the trigger component. When the user closes the
                revealed content, no element will have focus, but pressing Shift+Tab will move focus back to the trigger component.
            </li>
            <li>
                Better: When the user dismisses revealed content, move focus to the original trigger component. This is the ideal experience
                when the user cancels a dialog (dismisses it without taking any action).
            </li>
            <li>
                Best: When the user dismisses revealed content, move focus to the control that makes the most sense given the user's
                workflow.
            </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A calendar application includes a toolbar with buttons for creating, deleting, and editing appointments. Selecting the
                    "New appointment" button in the toolbar opens an "Appointment details" dialog. Closing the dialog moves focus to the
                    next item in the focus order, which happens to be the "Delete appointment" button.
                </p>
            }
            passText={
                <p>
                    When the dialog closes, focus placement depends on the expected workflow. If the user creates a new appointment, focus
                    moves to the 'Edit appointment' button in the toolbar. If they cancel without creating an appointment, focus returns to
                    the trigger element (the "New appointment" button).
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR26">
                Inserting dynamic content into the Document Object Model immediately following its trigger element
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR37">
                Creating Custom Dialogs in a Device Independent Way
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
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
