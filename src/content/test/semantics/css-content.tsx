// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'CSS content',
    },
    ({ Markup, Link }) => (
        <>
            <p>
                Meaningful content must not be implemented using only CSS <Markup.Code>:before</Markup.Code> or{' '}
                <Markup.Code>:after</Markup.Code>.
            </p>
            <h2>Why it matters</h2>
            <p>
                Some people with visual disabilities need to customize the styling of a web page to see its content. When they modify or
                disable CSS styling, content inserted using <Markup.Code>:before</Markup.Code> or <Markup.Code>:after</Markup.Code> might
                move or disappear entirely.
            </p>
            <h2>How to fix</h2>
            <ul>
                <li>
                    Good: Ensure that any information in inserted content is (1) available to assistive technologies, and (2) visible when
                    CSS is turned off.
                </li>
                <li>
                    Better: Avoid inserting meaningful page content using CSS <Markup.Code>:before</Markup.Code> or{' '}
                    <Markup.Code>:after</Markup.Code>.
                </li>
            </ul>
            <p />
            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        An online book review site uses <Markup.Code>:before</Markup.Code> (and its content property) to indicate the titles
                        of newly reviewed books.{' '}
                    </p>
                }
                failExample={`<style>
                [.new-title::before {content: "New!" ;}]
                </style>
                ...
                <h3 class="new-title">Potato Life</h3>
                <h3>Angry Anteaters</h3>`}
                passText={<p>"New!" is inserted directly into the titles of newly reviewed books.</p>}
                passExample={`<h3>[New!] Potato Life</h3>
                <h3>Angry Anteaters</h3>`}
            />
            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                    Understanding Success Criterion 1.3.1: Info and Relationships
                </Markup.HyperLink>
            </Markup.Links>
            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F87">
                    Failure of Success Criterion 1.3.1 due to inserting non-decorative content by using :before and :after pseudo-elements
                    and the 'content' property in CSS
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
