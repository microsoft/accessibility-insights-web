// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Keyboard'} />

        <h2>Why it matters</h2>

        <p>
            Users must be able to access and interact with interface components using only a keyboard because using a mouse isn't possible
            if the user has no vision or low vision or doesn't have the physical capability or dexterity to effectively control a pointing
            device.
        </p>
        <p>Moreover, the keyboard experience must be predictable, easy to execute and under the user's control.</p>

        <p>
            See <Link.BingoBakery>this fun video</Link.BingoBakery> to learn how landmarks, headings, and tab stops work together to provide
            efficient navigation.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Make sure keyboard users can navigate <Markup.Emphasis>to</Markup.Emphasis> every interactive component in the page. (
                    <Link.WCAG_2_1_1 />)
                </h3>
                <ul>
                    <li>Users must be able to reach every interactive interface component on the page unless the component is disabled.</li>
                    <li>Interactive interface components include links, buttons, form fields and other input controls.</li>
                    <li>
                        <Markup.Term>Tab</Markup.Term> and <Markup.Term>Shift+Tab</Markup.Term> should allow users to navigate between
                        components.
                    </li>
                    <li>
                        <Markup.Term>Arrow</Markup.Term> keys should allow users to navigate between the focusable elements in a composite
                        custom widget.
                    </li>
                </ul>

                <h3>
                    Make sure keyboard users can navigate <Markup.Emphasis>away</Markup.Emphasis> from each component. (<Link.WCAG_2_1_2 />)
                </h3>
                <ul>
                    <li>A "keyboard trap" is an interface component that receives input focus then prevents it from moving away.</li>
                    <li>
                        Keyboard traps are extremely disruptive for keyboard-only users; they can even force users to restart their computer
                        to regain keyboard access.
                    </li>
                </ul>

                <h3>
                    Allow users to control character key shortcuts. (<Link.WCAG_2_1_4 />)
                </h3>
                <ul>
                    <li>
                        If a keyboard shortcut is implemented using only letter, number, punctuation, or symbol characters, allow users to
                        turn off or remap the shortcut to include a non-printable key, such as Alt or Ctrl.
                    </li>
                </ul>
            </Markup.Do>

            <Markup.Dont>
                <h3>
                    Don’t trigger an unexpected change of context when the user tabs to a component or changes its settings. (
                    <Link.WCAG_3_2_1 />, <Link.WCAG_3_2_2 />)
                </h3>
                <ul>
                    <li>All users, but especially those who can't see the entire page simultaneously, are likely to be disoriented.</li>
                    <li>Instead, leave the user in control by providing a separate mechanism for triggering the change of context.</li>
                </ul>

                <h3>
                    Don't require keyboard users to type quickly or to press and hold a key. (<Link.WCAG_2_1_1 />)
                </h3>
                <ul>
                    <li>Functions must be operable using simple, untimed key presses.</li>
                    <li>
                        Exception: Functions that require users to define a <Markup.Emphasis>path</Markup.Emphasis> and not just{' '}
                        <Markup.Emphasis>end points</Markup.Emphasis> (such as freehand drawing) are exempt from this requirement.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Support keyboard interaction</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">
                Understanding Success Criterion 2.1.1: Keyboard
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Link.WCAG21TechniquesG202 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H91">Using HTML form controls and links</Markup.HyperLink>
            <Link.WCAG21TechniquesG90 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20">
                Using both keyboard and other device-specific functions
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR35">
                Making actions keyboard accessible by using the onclick event of anchors and buttons
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR2">
                Using redundant keyboard and mouse event handlers
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F54">
                Failure of Success Criterion 2.1.1 due to using only pointing-device-specific event handlers (including gesture) for a
                function
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F55">
                Failure of Success Criteria 2.1.1, 2.4.7, and 3.2.1 due to using script to remove focus when focus is received
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F42">
                Failure of Success Criteria 1.3.1, 2.1.1, 2.1.3, or 4.1.2 when emulating links
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices/#keyboard">Developing a Keyboard Interface</Markup.HyperLink>
        </Markup.Links>

        <h3>Avoid keyboard traps</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/no-keyboard-trap.html">
                Understanding Success Criterion 2.1.2: No Keyboard Trap
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G21">
                Ensuring that users are not trapped in content
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F10">
                Failure of Success Criterion 2.1.2 due to combining multiple content formats in a way that traps users inside one format
                type
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Avoid context changes on focus</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html">
                Understanding Success Criterion 3.2.1: On Focus
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G107">
                Using "activate" rather than "focus" as a trigger for changes of context
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F52">
                Failure due to opening a new window as soon as a new page is loaded without prior warning
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F55">
                Failure due to using script to remove focus when focus is received
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Best practices</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G200">
                Opening new windows and tabs from a link only when necessary
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G201">
                Giving users advanced warning when opening a new window
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Avoid context changes on input</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/on-input.html">
                Understanding Success Criterion 3.2.2: On Input
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G80">
                Providing a submit button to initiate a change of context
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H32">Providing submit buttons</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H84">
                Using a button with a select element to perform an action
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G13">
                Describing what will happen before a change to a form control is made
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR19">
                Using an onchange event on a select element without causing a change of context
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F36">
                Failure due to automatically submitting a form and presenting new content without prior warning when the last field in the
                form is given a value
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F37">
                Failure due to launching a new window without prior warning when the status of a radio button, check box or select list is
                changed
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Best practices</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G201">
                Giving users advanced warning when opening a new window
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Avoid specific timings for individual keystrokes</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">
                Understanding Success Criterion 2.1.1: Keyboard
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Allow users to control character key shortcuts</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/character-key-shortcuts.html">
                Understanding Success Criterion 2.1.4 Character Key Shortcuts
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.youtube.com/watch?v=xzSyIA4OWYE">
                Single character key shortcuts affecting speech input – example 1
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.youtube.com/watch?v=OPjfpDU9S08">
                Single character key shortcuts affecting speech input – example 2
            </Markup.HyperLink>
        </Markup.Links>
    </React.Fragment>
));
