// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Users must not be able to Tab away from a modal dialog without explicitly dismissing it.</p>

        <h2>Why it matters</h2>
        <p>
            The purpose of a modal dialog is to constrain user input (temporarily) to controls within the dialog. Just as mouse users should
            not be able to click elements outside the dialog, keyboard users should not be able to Tab to elements outside the dialog.
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>
                If a modal dialog contains a single focusable element (such as an 'OK' button), simply prevent any behavior from occurring
                when the user presses the Tab key.
            </li>
            <li>
                If a modal dialog contains multiple focusable elements, force focus to cycle through those elements until the dialog is
                dismissed by the user.
            </li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A modal dialog contains multiple focusable elements. When the user Tabs away from the last focusable element in the
                    dialog, focus moves to the next focusable element in DOM, an interactive element outside the dialog.
                </p>
            }
            passText={
                <div>
                    <p>
                        When the user Tabs <Markup.Emphasis>forward</Markup.Emphasis> from the last focusable element in the dialog,
                        scripting intercepts focus and moves it to the <Markup.Emphasis>first</Markup.Emphasis> focusable element in the
                        dialog.
                    </p>
                    <p>
                        When the user Tabs <Markup.Emphasis>backward</Markup.Emphasis> from the first focusable element, scripting moves it
                        to the <Markup.Emphasis>last</Markup.Emphasis> focusable element.
                    </p>
                </div>
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR37">
                Creating Custom Dialogs in a Device Independent Way
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
