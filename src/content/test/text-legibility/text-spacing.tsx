// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Text spacing',
    },
    ({ Markup }) => (
        <>
            <p>Users must be able to adjust text spacing with no loss of content or functionality.</p>

            <h2>Why it matters</h2>
            <p>
                Increased spacing between lines, words, and/or letters can help people with low vision, dyslexia, and other cognitive
                disabilities.
            </p>

            <h2>How to fix</h2>
            <p>
                Ensure that text fits within its container without being cut off or overlapping other text when the{' '}
                <Markup.HyperLink href="https://www.html5accessibility.com/tests/tsbookmarklet.html">
                    Text spacing bookmarklet
                </Markup.HyperLink>{' '}
                is run. Either of the following methods is sufficient:
            </p>
            <ul>
                <li>The container resizes automatically when text spacing is modified.</li>
                <li>The container is large enough for the expanded text.</li>
            </ul>
            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        The height of a paragraph is fixed at 50px. Text in the paragraph is clipped when line spacing is increased by the
                        user.
                    </p>
                }
                failExample={`
            <head>
            <style>
            p.intro {
            [height: 50px;]
            border: 1px solid blue
            }
            </style>
            </head>
            <body>
            <h1>Introduction</h1>
            <p class="intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Etiam semper diam at erat pulvinar, at pulvinar felis blandit.
            Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut.
            Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet.
            Pellentesque interdum, nisl nec interdum maximus,
            augue diam porttitor lorem, et sollicitudin felis neque sit amet erat.</p>
            </body>
            `}
                passText={<p>The height of the paragraph adjusts automatically when line spacing is increased.</p>}
                passExample={`
            <head>
            <style>
            p.intro {
            [height: auto;]
            border: 1px solid blue
            }
            </style>
            </head>
            <body>
            <h1>Introduction</h1>
            <p class="intro">Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Etiam semper diam at erat pulvinar, at pulvinar felis blandit.
            Vestibulum volutpat tellus diam, consequat gravida libero rhoncus ut.
            Maecenas imperdiet felis nisi, fringilla luctus felis hendrerit sit amet.
            Pellentesque interdum, nisl nec interdum maximus,
            augue diam porttitor lorem, et sollicitudin felis neque sit amet erat.</p>
            </body>
            `}
            />
            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html">
                    Understanding Success Criterion 1.4.12 Text Spacing
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C36">
                    Allowing for text spacing override
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C35">
                    Allowing for text spacing without wrapping
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Additional guidance</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C28">
                    Specifying the size of text containers using em units
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/working-examples/css-text-spacing/">
                    Working example of small containers that allow for text spacing
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
