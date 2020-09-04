// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Navigating to a component must not trigger any unexpected change of context.</p>

        <h2>Why it matters</h2>
        <p>
            A "change of context" is a major change in the content of a web page that might disorient users who aren't expecting the change.
            For example, opening a new window, moving focus to a different component, going to a new page, or significantly re-arranging the
            content of a page are all changes in context. <Markup.Emphasis>Unexpected</Markup.Emphasis> changes in context can be
            disorienting for anyone, but especially for people with visual disabilities, cognitive limitations, or motor impairments. Unless
            users are notified in advance, they will not expect navigating to an interface component to trigger a change in context.
        </p>

        <h2>How to fix</h2>
        <p>
            Use a different trigger to initiate a change of context. For example, instead of initiating a change of context when an
            interface component receives focus, wait until the component is activated by the user.
        </p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>Tabbing to a 'sponsored' link opens an ad in a new browser window.</p>}
            passText={<p>The ad opens only when the user activates the sponsored link.</p>}
        />
        <h2>More examples</h2>

        <h3>WCAG success criteria </h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/on-focus.html">
                Understanding Success Criterion 3.2.1: On Focus
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques </h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G107">
                Using "activate" rather than "focus" as a trigger for changes of context
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures </h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F52">
                Failure due to opening a new window as soon as a new page is loaded without prior warning
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F55">
                Failure due to using script to remove focus when focus is received
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Best practices </h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G200">
                Opening new windows and tabs from a link only when necessary
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G201">
                Giving users advanced warning when opening a new window
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
