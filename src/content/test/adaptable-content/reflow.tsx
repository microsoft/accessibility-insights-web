// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        Having to scroll in two directions is difficult for everyone. Having to scroll in the direction of reading makes reading especially
        difficult for people with certain disabilities, including people with low vision, who are more likely to need enlarged text in a
        single column as well as people with reading disabilities that make it difficult to visually track long lines of text. It also
        impacts people with motor disabilities who find scrolling difficult on the webpage.
    </p>
));

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Content must be visible without having to scroll both vertically and horizontally.</p>

        <h2>Why it matters</h2>
        <p>
            Having to scroll in two directions is difficult for everyone. Having to scroll in the direction of reading makes reading
            especially difficult for people with certain disabilities, including:
        </p>
        <ul>
            <li> People with low vision, who are more likely to need enlarged text in a single column</li>
            <li> People with reading disabilities that make it difficult to visually track long lines of text</li>
            <li> People with motor disabilities who find scrolling difficult</li>
        </ul>
        <h2>How to fix</h2>
        <p>
            Use responsive web design to ensure page content reflows to fit within the window whenever the viewport narrows or the text size
            changes.
        </p>
        <ul>
            <li>Good: Do not require users to scroll in two directions.</li>
            <li>
                Better: Do not require users to scroll in the direction of reading:
                <ul>
                    <li>If the text is read horizontally (left-to-right or right-to-left), text should scroll vertically.</li>
                    <li>If the text is read vertically (top-to-bottom), text should scroll horizontally.</li>
                </ul>
            </li>
        </ul>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A web application has a tab control with a set of vertically-stacked tabs always positioned to the left of the tab
                    panel. When viewed on a handheld device, the user must scroll both horizontally and vertically to see both the tabs and
                    the tab panel.
                </p>
            }
            passText={
                <p>
                    The tab control is redesigned so the tab panel moves below the tabs as needed when the viewport is narrowed or the text
                    size is increased. The user never needs to scroll horizontally to see the content.
                </p>
            }
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/reflow.html">
                Understanding Success Criterion 1.4.10 Reflow
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C32">
                Using media queries and grid CSS to reflow columns
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C31">Using CSS Flexbox to reflow content</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C33">
                Allowing for Reflow with Long URLs and Strings of Text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C38">
                Using CSS width, max-width and flexbox to fit labels and inputs
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR34">
                Calculating size and position in a way that scales with text size
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://responsivedesign.is/examples/">Examples – Responsive Web Design</Markup.HyperLink>
        </Markup.Links>
    </>
));
