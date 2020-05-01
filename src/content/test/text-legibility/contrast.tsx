// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Contrast',
    },
    ({ Markup, Link }) => (
        <>
            <p>Text elements must have sufficient contrast.</p>
            <h2>Why it matters</h2>
            <p>
                Most people find it easier to read text when it has a sufficiently high contrast against its background. People with mild
                visual disabilities, low vision, or limited color perception are likely to find text unreadable when contrast is too low.
            </p>
            <p>
                People with <Link.Presbyopia /> also struggle to read small or low-contrast text. A{' '}
                <Markup.HyperLink href="https://www.sciencedirect.com/science/article/pii/S0161642017337971">2018 study</Markup.HyperLink>{' '}
                found that 1.8 billion people worldwide have presbyopia. (All people are affected by presbyopia to some degree as they age.)
            </p>
            <h2>How to fix</h2>
            <p>Make sure text elements have sufficient contrast:</p>
            <ul>
                <li>Regular text must have a contrast ratio ≥ 4.5.</li>
                <li>Large text (18pt or 14pt+bold) must have a contrast ratio ≥ 3.0.</li>
            </ul>
            <h2>Example</h2>
            <Markup.PassFail
                failText={<p>White text displayed over a background photo has insufficient contrast in some areas.</p>}
                failExample={`<style>
            .container {
            position: relative;
            font-family: Arial;
            }
            .text-block {
            position: absolute;
            bottom: 20px;
            right: 20px;
            [color: white;]
            padding-left: 20px;
            padding-right: 20px;
            }
            </style>
            </head>
            <body>
            <div class="container">
            <img src="img_nature_wide.jpg" alt="Sunrise over the Grand Canyon" style="width:100%;">
            <div class="text-block">
            <p>Grand Canyon National Park</p>
            </div>`}
                passText={<p>A background color with sufficient contrast is added.</p>}
                passExample={`<style>
            .container {
            position: relative;
            font-family: Arial;
            }
            .text-block {
            position: absolute;
            bottom: 20px;
            right: 20px;
            [color: white;
            background-color: #767676;]
            padding-left: 20px;
            padding-right: 20px;
            }
            </style>
            </head>
            <body>
            <div class="container">
            <img src="img_nature_wide.jpg" alt="Sunrise over the Grand Canyon" style="width:100%;">
            <div class="text-block">
            <p>Grand Canyon National Park</p>
            </div>`}
            />
            <h2>More examples</h2>
            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html">
                    Understanding Success Criterion 1.4.3: Contrast (Minimum)
                </Markup.HyperLink>
            </Markup.Links>
            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G18">
                    Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G145">
                    Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text
                </Markup.HyperLink>
            </Markup.Links>
            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F24">
                    Failure of Success Criterion 1.4.3, 1.4.6 and 1.4.8 due to specifying foreground colors without specifying background
                    colors or vice versa
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F83">
                    Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with
                    foreground text (or images of text)
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
