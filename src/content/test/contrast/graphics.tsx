// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Graphics',
    },
    ({ Markup, Link }) => (
        <>
            <p>Meaningful graphics must have sufficient contrast.</p>

            <h2>Why it matters</h2>
            <p>
                For a graphic to visually communicate meaningful content, users must be able perceive the elements of the graphic that
                convey meaning. People with mild visual disabilities, low vision, limited color perception, or <Link.Presbyopia /> might
                find it difficult or impossible to perceive a graphical element that has insufficient contrast against the background.
            </p>

            <h2>How to fix</h2>
            <p>Make sure the meaningful elements in a graphic have a contrast ratio ≥ 3:1.</p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        A graphic of a thermometer is used in a weather website to communicate the daily expected high temperature. The
                        portions of the graphic that communicate meaning are: The boundary of the graphic (#777777) communicates that it is
                        a thermometer. Tick marks and text (#333333) indicate the thermometer's range and scale. The portion of the
                        thermometer that's filled (#ff7878) indicates the expected high temperature. The graphic has a white background
                        (#ffffff). The color used to indicate the high temperature has an insufficient color contrast against the background
                        (2.557:1).
                    </p>
                }
                passText={<p>The fill color is #ff0000, which has a sufficient contrast against the background (3.998:1).</p>}
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html">
                    Understanding Success Criterion 1.4.11 Non-text Contrast
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
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
                    Using sufficient contrast for images that convey information
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
