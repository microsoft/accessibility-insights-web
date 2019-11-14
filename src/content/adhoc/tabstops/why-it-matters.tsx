// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(({ Markup, Link }) => (
    <>
        <h2>Why it matters</h2>
        <p>
            Users must be able to interact with a website or web app using only
            a keyboard.
        </p>

        <ul>
            <li>
                Using a mouse is impossible for people who can't see the
                pointer.
            </li>
            <li>
                Some people don't have the physical capability to control a
                pointing device.
            </li>
            <li>Many people without disabilities prefer to use a keyboard.</li>
        </ul>

        <p>Good tab stop design allows keyboard users to:</p>

        <ul>
            <li>
                Access all of an application's interactive elements in a
                predictable order
            </li>
            <li>Identify which element currently has the input focus</li>
        </ul>

        <p>
            Poorly-designed tab stops create high-impact accessibility problems.
            To learn more about tab stops, see <Link.Keyboard />
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide a visible focus indicator on the interactive element
                    that has the input focus.
                </h3>

                <ul>
                    <li>
                        Input focus is commonly indicated by a{' '}
                        <Markup.Term>solid or dotted border</Markup.Term>{' '}
                        surrounding the element, but other visible changes are
                        acceptable.
                    </li>
                </ul>

                <h3>Make all interactive elements tabbable.</h3>

                <ul>
                    <li>
                        Users should be able{' '}
                        <Markup.Term>
                            tab to every interactive element
                        </Markup.Term>{' '}
                        on the page unless it is currently disabled.
                    </li>
                    <li>
                        Interactive elements include links, buttons, form fields
                        and other input controls.
                    </li>
                    <li>
                        Watch out for "keyboard traps," elements that receive
                        input focus then prevent it from moving away.
                    </li>
                </ul>

                <h3>
                    Make the tab order consistent with the logical order that's
                    communicated visually.
                </h3>

                <ul>
                    <li>
                        In most cases, tab order should{' '}
                        <Markup.Term>
                            match the expected reading order
                        </Markup.Term>{' '}
                        (left-to-right and top-to-bottom).
                    </li>
                </ul>

                <h3>
                    Make sure elements that repeat on multiple pages have a
                    consistent tab order across all pages.
                </h3>

                <ul>
                    <li>
                        For example, site-level navigation bars should have a
                        consistent tab order.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>Don't make non-interactive elements focusable.</h3>

                <ul>
                    <li>
                        Don't allow users to tab to{' '}
                        <Markup.Term>text elements</Markup.Term> (such as
                        labels) or other static content.
                    </li>
                    <li>
                        Don't allow users to tab to potentially interactive
                        elements that are{' '}
                        <Markup.Term>currently disabled</Markup.Term>.
                    </li>
                </ul>

                <h3>
                    Don't allow users to tab their way out of a modal dialog.
                </h3>

                <ul>
                    <li>
                        They must actively dismiss the dialog (for example,
                        using an OK or Cancel button).
                    </li>
                </ul>

                <h3>
                    Don't use tabindex values to define an explicit tab order.
                </h3>

                <ul>
                    <li>
                        If the default tab order isn't ideal, first try to fix
                        the problem by{' '}
                        <Markup.Term>rearranging the content</Markup.Term>{' '}
                        and/or{' '}
                        <Markup.Term>changing the style sheet</Markup.Term>.
                    </li>
                </ul>

                <h3>
                    Don't show input focus on any element that does not
                    currently have the input focus.
                </h3>

                <ul>
                    <li>
                        Be sure styling doesn't make any element{' '}
                        <Markup.Emphasis>appear</Markup.Emphasis> to have the
                        input focus.
                    </li>
                </ul>

                <h3>Don't move input focus unexpectedly.</h3>

                <ul>
                    <li>
                        All focus changes that occur should be a predictable
                        result of user action.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>
    </>
));
