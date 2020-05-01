// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Instructions',
    },
    ({ Markup }) => (
        <>
            <p>
                Instructions must not rely <Markup.Emphasis>solely</Markup.Emphasis> on color or other sensory characteristics.
            </p>

            <h2>Why it matters</h2>
            <p>
                Instructions that mention the sensory characteristics of an interface component (such as its color, location, shape, or
                size) can help users with good vision identify them. However, identifying a user interface component{' '}
                <Markup.Emphasis>only</Markup.Emphasis> by its sensory characteristics isn't helpful for people who are blind or have low
                vision.
            </p>

            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "Provide instructions that are considerate of the all the ways I might use my senses, and not just the senses that you
                    rely on. For example, saying 'Click the blue button to the right' is useless to me as I have low vision."
                </Markup.Emphasis>
            </p>

            <h2>How to fix</h2>
            <p>
                Rewrite instructions so they mention the accessible name of the interface component (in addition to its sensory
                characteristics).
            </p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={<p>Instructions identify a set of links only by their location (sensory characteristic only).</p>}
                failExample={`<p>To learn more,
            see [the links to the right].</p>
            ...

            <h3>Related articles</h3>
            <ul>
            <li>
            <a href="https://www.w3.org">
            World Wide Web Consortium (W3C)</a>
            </li>
            ...
            `}
                passText={
                    <p>
                        Instructions mentions both the links' location and their associated heading (sensory characteristic + accessible
                        name).
                    </p>
                }
                passExample={`<p>To learn more,
            [see the links to the right, under the 'Related articles' heading].</p>
            ...
            <h3>Related articles</h3>
            <ul>
            <li>
            <a href="https://www.w3.org">
            World Wide Web Consortium (W3C)</a>
            </li>
            ...`}
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html">
                    Understanding Success Criterion 1.3.3: Sensory Characteristics
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/G96.html">
                    Providing textual identification of items that otherwise rely only on sensory information to be understood
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F14.html">
                    Failure of Success Criterion 1.3.3 due to identifying content only by its shape or location
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F26.html">
                    Failure of Success Criterion 1.3.3 due to using a graphical symbol alone to convey information
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
