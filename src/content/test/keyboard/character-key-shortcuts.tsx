// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <h1>Hover / focus content</h1>
        <p>Content that appears on focus or hover must be dismissible, hoverable, and persistent.</p>

        <h2>Why it matters</h2>
        <p>Additional content that appears on focus or hover can present problems if users can't easily see it or dismiss it.</p>

        <h2>How to fix</h2>
        <p>Ensure that any content that appears on focus or hover is:</p>
        <ul>
            <li> The user can turn off the keyboard shortcut.</li>
            <li> The user can remap the keyboard shortcut to include a non-printable key, such as Alt or Ctrl.</li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A messaging app uses the letter "N" as a keyboard shortcut for starting a new message. The shortcut is deactivated when
                    focus is in a text editing field, but otherwise it is always active. The app does not allow the user to turn off or
                    remap shortcuts.
                </p>
            }
            passText={<p>The messaging app allows users to disable keyboard shortcuts or remap them to include the Ctrl or Alt keys.</p>}
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html">
                Understanding Success Criterion 2.1.4 Character Key Shortcuts
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.youtube.com/watch?v=xzSyIA4OWYE">
                Single character key shortcuts affecting speech input – example 1
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.youtube.com/watch?v=OPjfpDU9S08">
                Single character key shortcuts affecting speech input – example 2
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
