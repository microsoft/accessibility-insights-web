// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create } from '../../common';
import { toolName } from '../../strings/application';

export const guidance = create(({ Markup, Link }) => <React.Fragment>
    <h1>Tab stops</h1>
    <h2>Why tab stops matter</h2>

    <p>
        Many people - not just those with disabilities - rely on their keyboard to interact with web applications.
        Users of assistive technology are especially likely to use a keyboard (or its functional equivalent),
        and poorly-designed tab stops create high-impact accessibility problems.
    </p>

    <p>
        Good tab stop design allows keyboard users to

        <ul>
            <li>
                Tab through an application's interactive elements in a predictable order
            </li>
            <li>
                Identify which element currently has the input focus
            </li>
        </ul>

        Activating and/or interacting with each element via keyboard will be covered in a separate test.
        <br />
        To learn more about tab stops, see <Link.Keyboard>WebAIM: Keyboard Accessibility</Link.Keyboard>.
    </p>

    <h2>About the Tab stops visualization</h2>

    <p>
        The visualizations in {toolName} enable developers to see accessibility markup that's normally
    invisible. The <Markup.Term>Tab stops</Markup.Term> visualization shows:

    <ul>
            <li>
                The element that currently has the input focus, indicated by an empty circle.
        </li>
            <li>
                The focus order, indicated by circles with numbers and connecting lines between them. (The connecting
                lines are broken when you navigate across an iframe boundary.)
        </li>
        </ul>
    </p>

    <h3>How to use the visualization</h3>

    <ol>
        <li>
            Make sure input focus is on the element where you want to start testing.
    </li>
        <li>
            Turn on the <Markup.Term>Tab stops</Markup.Term> toggle. An empty circle will highlight the current tab stop.
    </li>
        <li>
            Press the keyboard's <Markup.Term>Tab</Markup.Term> key to move the input focus through all the interactive
            elements within your test scope.
    </li>
        <li>
            As you tab to each element, look for these <Markup.Term>accessibility problems</Markup.Term>:
        <Markup.ProblemList>
                <li>
                    An interactive element can't be reached using the <Markup.Term>Tab</Markup.Term> key.
            </li>
                <li>
                    A "keyboard trap" prevents tabbing away from an element.
            </li>
                <li>
                    An interactive element does not give a visible indication when it has input focus.
            </li>
                <li>
                    The tab order is inconsistent with the logical order that's communicated visually.
            </li>
                <li>
                    Input focus moves unexpectedly without the user initiating it.
            </li>
            </Markup.ProblemList>
        </li>
        <li>
            Stop tabbing when you have tabbed to every element within your test scope.
    </li>
    </ol>

    <Markup.Columns>
        <Markup.Do>

            <h3>Provide a visible focus indicator on the interactive element that has the input focus.</h3>

            <ul>
                <li>
                    Input focus is commonly indicated by a <Markup.Term>solid or dotted border</Markup.Term> surrounding the element, but
                    other visible changes are acceptable.
                </li>
            </ul>

            <h3>Make all interactive elements tabbable.</h3>

            <ul>
                <li>
                    Users should be able <Markup.Term>tab to every interactive element</Markup.Term> on the page unless
                    it is currently disabled.
                </li>
                <li>
                    Interactive elements include links, buttons, form fields and other input controls.
                </li>
                <li>
                    Watch out for "keyboard traps," elements that receive input focus then prevent it from moving away.
                </li>
            </ul>

            <h3>Make the tab order consistent with the logical order that's communicated visually.</h3>

            <ul>
                <li>
                    In most cases, tab order should <Markup.Term>match the expected reading order</Markup.Term> (left-to-right and
                    top-to-bottom).
                </li>
            </ul>

            <h3>Make sure elements that repeat on multiple pages have a consistent tab order across all pages.</h3>

            <ul>
                <li>
                    For example, site-level navigation bars should have a consistent tab order.
                </li>
            </ul>

        </Markup.Do>
        <Markup.Dont>

            <h3>Don't make non-interactive elements focusable.</h3>

            <ul>
                <li>
                    Don't allow users to tab to <Markup.Term>text elements</Markup.Term> (such as labels) or other static content.
                </li>
                <li>
                    Don't allow users to tab to potentially interactive elements that are <Markup.Term>currently disabled</Markup.Term>.
                </li>
            </ul>

            <h3>Don't allow users to tab their way out of a modal dialog.</h3>

            <ul>
                <li>
                    They must actively dismiss the dialog (for example, using an OK or Cancel button).
                </li>
            </ul>

            <h3>Don't use  tabindex values to define an explicit tab order.</h3>

            <ul>
                <li>
                    If the default tab order isn't ideal, first try to fix the problem
                    by <Markup.Term>rearranging the content</Markup.Term> and/or <Markup.Term>changing the style sheet</Markup.Term>.
                </li>
            </ul>

            <h3>Don't show input focus on any element that does not currently have the input focus.</h3>

            <ul>
                <li>
                    Be sure styling doesn't make any element <i>appear</i> to have the input focus.
                </li>
            </ul>

            <h3>Don't move input focus unexpectedly.</h3>

            <ul>
                <li>
                    All focus changes that occur should be a predictable result of user action.
                </li>
            </ul>
        </Markup.Dont>
    </Markup.Columns>
</React.Fragment>);

