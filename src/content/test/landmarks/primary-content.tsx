// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>The main landmark must contain all of the page's primary content.</p>

        <h2>Why it matters</h2>
        <p>
            People with good vision can quickly scan a page to identify its primary content. Users of assistive technology expect all
            primary content to be contained within the page's main landmark. If primary content appears elsewhere, they might not be able to
            find it.
        </p>

        <h2>How to fix</h2>
        <p>
            Re-implement so all primary content is contained within the page's <Markup.Term>main</Markup.Term> landmark.
        </p>

        <h2>Example</h2>

        <Markup.PassFail
            failText={
                <p>
                    Some of the page's primary content is not contained within the <Markup.Term>main</Markup.Term> landmark.
                </p>
            }
            failExample={`<header>…</header>
            <nav>…</nav>
            <main>Some of the page's primary content is here</main>
            [<div>Some of the page's primary content is here</div>]
            <footer>…</footer>`}
            passText={
                <p>
                    All of the page's primary content is within the <Markup.Term>main</Markup.Term> landmark.
                </p>
            }
            passExample={`<header>…</header>
            <nav>…</nav>
            <main>Some of the page's primary content is here
            [<div>Some of the page's primary content is here</div>]
            </main>
            <footer>…</footer>`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html">
                Understanding Success Criterion 2.4.1: Bypass Blocks
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                Using ARIA landmarks to identify regions of a page
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/landmarks/index.html">
                ARIA Landmarks Example
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_landmark">
                WAI-ARIA Authoring Practices 1.1: Landmark Regions
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
