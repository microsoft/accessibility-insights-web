// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>
            Touch targets must have sufficient size and spacing to be easily activated without accidentally activating an adjacent target.
        </p>

        <h2>Why it matters</h2>
        <p>
            When touch targets are too small or too close together, it becomes difficult for users to activate them and having sufficient
            target spacing helps all users who may have difficulty in confidently targeting or operating small controls. Users who benefit
            include, but are not limited to, people who use a mobile device where the touch screen is the primary mode of interaction, or
            that use of mouse, stylus or touch input for people with mobility impairments such as hand tremors.
        </p>

        <h2>How to fix</h2>
        <p>
            All touch targets must be at least 24 by 24 CSS pixels in size, where size is computed by taking the largest unobscured area of
            the touch target. A touch target may consist of a single actionable element, or an actionable element along with its clickable
            label or other programmatically associated clickable element. If the size of the target is insufficient, then it must be at
            least 24 CSS pixels away from any other touch target. All exception criteria may be used to achieve success for this test for
            example, providing a different control on the same page that meets target size.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>Touch target unobscured size is too small and is too close to another touch target.</p>}
            failExample={`<button id="target">+</button>
<button style="margin-left: -10px"> Adjacent Target</button>`}
            passText={<p>Touch target has sufficient size or spacing.</p>}
            passExample={`<button style="font-size: 24px">Submit</button>
<button>+</button>
<button style="margin-left: 10px">Adjacent Target</button>`}
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://w3c.github.io/wcag/understanding/target-size-minimum.html">
                Understanding Success Criterion 2.5.8: Target Size (Minimum)
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://w3c.github.io/wcag/techniques/css/C42">
                Using min-height and min-width to ensure sufficient target spacing
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://dl.acm.org/doi/10.1145/1152215.1152260">
                Target size study for one-handed thumb use on small touchscreen devices
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
