// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Users must be able to turn off or remap single-key key shortcuts.</p>

        <h2>Why it matters</h2>
        <p>
            While single-key shortcuts are fast and convenient for some people who use keyboards, they can create problems for keyboard
            users with dexterity problems and for speech input users. These users risk triggering shortcut keys accidentally—through an
            errant keypress or utterance—with potentially serious consequences. To avoid unintended input, users must be able to turn off
            single-key shortcuts or to remap them to include non-character keys, such as Alt or Ctrl. Because screen reader users typically
            make heavy use of keyboard shortcuts, they also benefit from the ability to remap.
        </p>

        <h2>How to fix</h2>
        <p>
            If a keyboard shortcut is implemented using only letter, number, punctuation, or symbol characters, make sure at least one of
            the following is true:
        </p>
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
