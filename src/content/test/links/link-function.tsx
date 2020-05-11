// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>If an anchor element functions as a custom widget, it must have the appropriate ARIA widget role.</p>

        <h2>Why it matters</h2>
        <p>
            A link is a specific type of widget (interactive interface component) that navigates the user to new content. An anchor element
            that's programmed to function as something other than a link is a custom widget, and it requires an ARIA widget role. The role
            communicates the correct function to assistive technologies and enables them to interact with the widget.
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>
                Good: Add the correct ARIA role to the anchor element. Anchor elements are commonly programmed to function as buttons. A{' '}
                <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#button">button</Markup.HyperLink> (standard or toggle)
                or <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#menubutton">menu button</Markup.HyperLink> needs{' '}
                <Markup.Code>role="button"</Markup.Code>.
            </li>
            <li>
                Better: Replace the anchor element with a native HTML <Markup.Code>{'<button>'}</Markup.Code> element. (As a rule, it's
                better to use native semantics than to modify them using ARIA roles.) If needed, use CSS styling to give the button the
                desired appearance.
            </li>
        </ul>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    An <Markup.Code>{'<a>'}</Markup.Code> element is programmed to serve as a button, and it does not have a button widget
                    role.
                </p>
            }
            failExample={`[<a href="#">]Play[</a>]`}
            passText={
                <p>
                    The <Markup.Code>{'<a>'}</Markup.Code> element has been replaced by a <Markup.Code>{'<button>'}</Markup.Code>.
                </p>
            }
            passExample={`[<button>]Play[</button>]`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface component
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">
                WAI-ARIA Authoring Practices 1.1: Design Patterns and Widgets
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
