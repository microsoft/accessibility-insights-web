// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>
            For elements receiving keyboard focus, its focus indicator must be at least partially visible and not obscured by author-created
            content which overlays it, unless the focused element can be revealed without requiring the user to advance focus in the UI.
        </p>

        <h2>Why it matters</h2>
        <p>
            Keyboard users need to know which component currently has the input focus so they can predict the results of their key presses.
            If this failure occurs, users cannot see where the indicator is due to other authored content. Any 'sticky' content that moves
            with the viewport can potentially obscure other elements on the page, including controls the user may tab to.
        </p>
        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                “I’m a reporter with repetitive stress injury who uses speech recognition software. This page has a big content area that's
                always displayed across the bottom of the screen (a sticky footer). When I move focus to items, some are hidden behind the
                footer, and I can't see them. This page also uses a persistent header (also called a “sticky" header or banner), where the
                header remains in the same place as I scroll down the screen. This header is obscuring elements that have focus — which is
                extremely annoying and blocking for me!"
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>
            Ensure interactive components that receive focus indicator are at least partially visible and not obscured by author-created
            content which overlays it, unless the focused element can be revealed without requiring the user to advance focus in the UI.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A non-movable panel such as a sticky footer, cookie banner or chat widget can overlay content on the screen. These
                    elements fail this rule if focus can be moved to an element where content would fully obscure to the point of being
                    illegible and could not be scrolled into view (e.g., by attempting to manipulate the content in the visible viewport by
                    use of arrow keys).
                </p>
            }
            passText={
                <p>
                    To fix this issue, ensure that there is either enough scroll padding available so the user may initially find focus
                    obscured by an element when navigating with the Tab key, but by adjusting the scroll position of the viewport, the
                    obscured content can be made visible. Or, that the overlaying elements can be dismissed without a user having to move
                    focus from the obscured element.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum">
                Understanding Success Criterion 2.4.11: Focus Not Obscured (Minimum)
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/css/C43">
                Using CSS margin and scroll-margin to un-obscure content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://codepen.io/scottohara/pen/vYQqjbZ">Demo of using the popover attribute</Markup.HyperLink>
        </Markup.Links>

        <h3>Additional Guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG22/Techniques/failures/F110">
                Failure of Success Criterion 2.4.12 Focus Not Obscured (Minimum) due to a sticky footer or header completely hiding focused
                elements
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
