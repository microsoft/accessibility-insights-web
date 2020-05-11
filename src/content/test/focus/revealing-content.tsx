// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Activating a component that reveals hidden content must move input focus into the revealed content.</p>

        <h2>Why it matters</h2>
        <p>
            When a keyboard user activates a control (such as a button) that reveals previously hidden content (such as a menu or dialog),
            they must be able to navigate quickly and easily into the revealed content.
        </p>

        <h2>How to fix</h2>
        <p>
            When the user reveals hidden content, move input focus into the revealed content. In most cases, focus should move to the first
            focusable element in the dialog.
        </p>
        <p>However, if the revealed content is a dialog, certain circumstances might warrant moving focus to a different element:</p>
        <ul>
            <li>
                If focusing the first interactive element in a dialog causes the beginning of the dialog to scroll out of view, add{' '}
                <Markup.Code>tabindex="-1"</Markup.Code> to a static element at the top of the dialog (such as the dialog's title) and use
                scripting to move focus to that element.
            </li>
            <li>
                If a dialog allows the user to complete a process that is not easily reversible, consider setting focus on a button that
                simply dismisses the dialog (such as 'Cancel').
            </li>
            <li>
                If a dialog is intended to allow users to review their own input before committing to an action, consider setting focus on
                the dialog's commit button (such as 'Save' or 'Delete').
            </li>
        </ul>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A button is scripted to open a modal dialog. Focus doesn't move automatically into the dialog, and neither does tabbing
                    once.
                </p>
            }
            passText={<p>Additional scripting moves focus into the dialog as soon as it's opened.</p>}
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
            <Markup.HyperLink href="https://bitsofco.de/accessible-modal-dialog/">Creating an Accessible Modal Dialog</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices/">
                Dialog (Modal) in WAI-ARIA Authoring Practices 1.1
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
