// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Contrast'} />

        <h2>Why it matters</h2>
        <p>
            Higher contrast makes it easier to read text and graphics, especially for people with low vision, limited color perception, or{' '}
            <Link.Presbyopia />.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide sufficient contrast for visual information that helps users detect and operate active controls. (
                    <Link.WCAG_1_4_11 />)
                </h3>
                <ul>
                    <li>Any visual boundary that indicates the component's clickable area must have a contrast ratio ≥ 3:1.</li>
                    <li>Any visual effect that indicates the component's state must have a contrast ratio ≥ 3:1.</li>
                </ul>
                <h3>
                    Provide sufficient contrast for controls' state changes. (<Link.WCAG_1_4_11 />)
                </h3>
                <ul>
                    <li>Good: Ensure colors used to indicate different states have a contrast ratio ≥ 3:1.</li>
                    <li>Better: Indicate state changes by changing both color and another visual characteristic, such as shape or size.</li>
                </ul>
                <h3>
                    Provide sufficient contrast for graphics. (<Link.WCAG_1_4_11 />)
                </h3>
                <ul>
                    <li>Elements in a graphic that communicate meaning must have a contrast ratio ≥ 3:1.</li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't style controls in a way that interferes with their visual focus indicator. (<Link.WCAG_1_4_11 />)
                </h3>
                <ul>
                    <li>Don't use CSS styling to turn off the default focus indicator.</li>
                    <li>Don't style a control's borders in a way looks like a focus indicator.</li>
                    <li>Don't style a control's borders in a way that occludes the focus indicator.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>
        <h3>Sufficient contrast for controls' boundaries, states, and state changes</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html">
                Understanding Success Criterion 1.4.11: Non-text Contrast
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G195">
                Using an author-supplied, highly visible focus indicator
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F78">
                Failure of Success Criterion 2.4.7 due to styling element outlines and borders in a way that removes or renders non-visible
                the visual focus indicator
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G183">
                Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on focus for links or controls
                where color alone is used to identify them
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient contrast for graphics</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html">
                Understanding Success Criterion 1.4.11 Non-text Contrast
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G207">
                Ensuring that a contrast ratio of 3:1 is provided for icons
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G209">
                Provide sufficient contrast at the boundaries between adjoining colors
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G18">
                Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G145">
                Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G174">
                Providing a control with a sufficient contrast ratio that allows users to switch to a presentation that uses sufficient
                contrast
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/GL/wiki/Using_sufficient_contrast_for_images_that_convey_information">
                Using sufficient contrast for images that convey information{' '}
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
