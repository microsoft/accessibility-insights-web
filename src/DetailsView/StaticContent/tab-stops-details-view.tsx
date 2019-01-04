// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';
import { toolName } from '../../content/strings/application';

export const tabStopsContent: JSX.Element = (
    <div>
        <h2>Why tab stops matter</h2>

        <div className="why-vis">
            Many people - not just those with disabilities - rely on their keyboard to interact with web applications.
            Users of assistive technology are especially likely to use a keyboard (or its functional equivalent),
            and poorly-designed tab stops create high-impact accessibility problems.
        </div>

        <div className="more-info">
            Good tab stop design allows keyboard users to

            <ul className="insights-list">
                <li>
                    Tab through an application's interactive elements in a predictable order
                </li>
                <li>
                    Identify which element currently has the input focus
                </li>
            </ul>

            Activating and/or interacting with each element via keyboard will be covered in a separate test.
            <br />
            To learn more about tab stops, see&nbsp;
            <NewTabLink href="https://aka.ms/webaim/keyboard-accessibility">
                <span>WebAIM</span>: Keyboard Accessibility
            </NewTabLink>
            .
        </div>

        <h2>About the Tab stops visualization</h2>

        <div className="about-vis">
            The visualizations in {toolName} enable developers to see accessibility markup that's normally
            invisible. The <b>Tab stops</b> visualization shows:

            <ul className="insights-list">
                <li>
                    The element that currently has the input focus, indicated by an empty circle.
                </li>
                <li>
                    The focus order, indicated by circles with numbers and connecting lines between them. (The connecting lines are broken when you navigate across an iframe boundary.)
                </li>
            </ul>
        </div>

        <h3>How to use the visualization</h3>

        <ol className="insights-list">
            <li>
                Make sure input focus is on the element where you want to start testing.
            </li>
            <li>
                Turn on the <b>Tab stops</b> toggle. An empty circle will highlight the current tab stop.
            </li>
            <li>
                Press the keyboard's <b>Tab</b> key to move the input focus through all the interactive elements within your test scope.
            </li>
            <li>
                As you tab to each element, look for these <b>accessibility problems</b>:
                <ul className="tab-stops-accessibility-problems-list">
                    <li>
                        An interactive element can't be reached using the <b>Tab</b> key.
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
                </ul>
            </li>
            <li>
                Stop tabbing when you have tabbed to every element within your test scope.
            </li>
        </ol>

        <h2>Do</h2>

        <h3>Provide a visible focus indicator on the interactive element that has the input focus.</h3>

        <ul className="insights-list">
            <li>
                Input focus is commonly indicated by a <b>solid or dotted border</b> surrounding the element, but other visible changes are acceptable.
            </li>
        </ul>

        <h3>Make all interactive elements tabbable.</h3>

        <ul className="insights-list">
            <li>
                Users should be able <b>tab to every interactive element</b> on the page unless it is currently disabled.
            </li>
            <li>
                Interactive elements include links, buttons, form fields and other input controls.
            </li>
            <li>
                Watch out for "keyboard traps," elements that receive input focus then prevent it from moving away.
            </li>
        </ul>

        <h3>Make the tab order consistent with the logical order that's communicated visually.</h3>

        <ul className="insights-list">
            <li>
                In most cases, tab order should <b>match the expected reading order</b> (left-to-right and top-to-bottom).
            </li>
        </ul>

        <h3>Make sure elements that repeat on multiple pages have a consistent tab order across all pages.</h3>

        <ul className="insights-list">
            <li>
                For example, site-level navigation bars should have a consistent tab order.
            </li>
        </ul>

        <h2>Don't</h2>

        <h3>Don't make non-interactive elements focusable.</h3>

        <ul className="insights-list">
            <li>
                Don't allow users to tab to <b>text elements</b> (such as labels) or other static content.
            </li>
            <li>
                Don't allow users to tab to potentially interactive elements that are <b>currently disabled</b>.
            </li>
        </ul>

        <h3>Don't allow users to tab their way out of a modal dialog.</h3>

        <ul className="insights-list">
            <li>
                They must actively dismiss the dialog (for example, using an OK or Cancel button).
            </li>
        </ul>

        <h3>Don't use  tabindex values to define an explicit tab order.</h3>

        <ul className="insights-list">
            <li>
                If the default tab order isn't ideal, first try to fix the problem by <b>rearranging the content</b> and/or <b>changing the style sheet</b>.
            </li>
        </ul>

        <h3>Don't show input focus on any element that does not currently have the input focus.</h3>

        <ul className="insights-list">
            <li>
                Be sure styling doesn't make any element <i>appear</i> to have the input focus.
            </li>
        </ul>

        <h3>Don't move input focus unexpectedly.</h3>

        <ul className="insights-list">
            <li>
                All focus changes that occur should be a predictable result of user action.
            </li>
        </ul>
    </div>
);
