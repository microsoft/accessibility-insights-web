// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>Users must be able to resize text, without using assistive technology, up to 200% with no loss of content or functionality.</p>
        <h2>Why it matters</h2>
        <p>
            Most people find it easier to read text when it is sufficiently large. People with mild visual disabilities, low vision, or
            limited color perception are likely to find text unreadable when text is too small.
        </p>
        <p>
            People with <Link.Presbyopia /> also struggle to read small or low-contrast text. A{' '}
            <Markup.HyperLink href="https://www.sciencedirect.com/science/article/pii/S0161642017337971">2018 study</Markup.HyperLink> found
            that 1.8 billion people worldwide have presbyopia. (All people are affected by presbyopia to some degree as they age.)
        </p>
        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I wear bifocals and scratched my glasses, so I am having a hard time reading small type. Provide me a way to increase the
                text size by 200% without breaking the layout and functionality of the content or interface."
            </Markup.Emphasis>
        </p>
        <h2>How to fix</h2>
        <ol>
            <li>Make sure the text is scalable, and </li>
            <li>
                Make sure the container
                <ul>
                    <li>Good: Provides a scrollbar as needed, or</li>
                    <li>Better: Is large enough to display all text at 200%, or</li>
                    <li>Best: Scales to display the enlarged text without scrolling</li>
                </ul>
            </li>
        </ol>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>This text won't resize because its font size is defined using viewport units. Its container also has a fixed size</p>
            }
            failExample={`<html>
            <head>
            <style>
            .callout {
            [font-size: 3vw;
            height: 40px;
            width: 200px;]
            border-style: solid;
            }
            </style>
            </head>
            <body>
            <p class="callout">The quick brown fox jumps over the lazy dog.<p/>
            </body>
            </html>`}
            passText={<p>Both the text and its container are sized scalably.</p>}
            passExample={`<html>
            <head>
            <style>
            .callout {
            [font-size: 1.2em;
            height: 1.2em;
            width: 20em;]
            border-style: solid;
            }
            </style>
            </head>
            <body>
            <p class="callout">The quick brown fox jumps over the lazy dog.<p/>
            </body>
            </html>`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html">
                Understanding Success Criterion 1.4.4: Resize text
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C28">
                Specifying the size of text containers using em units
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C12">Using percent for font sizes</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C13">Using named font sizes</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C14">Using em units for font sizes</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR34">
                Calculating size and position in a way that scales with text size
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G146">Using liquid layout</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G179">
                Ensuring that there is no loss of content or functionality when the text resizes and text containers do not change their
                width
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F69">
                Failure of Success Criterion 1.4.4 when resizing visually rendered text up to 200 percent causes the text, image or controls
                to be clipped, truncated or obscured
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F80">
                Failure of Success Criterion 1.4.4 when text-based form controls do not resize when visually rendered text is resized up to
                200%
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F94">
                Failure of Success Criterion 1.4.4 due to text sized in viewport units
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C17">
                Scaling form elements which contain text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C20">
                Using relative measurements to set column widths so that lines can average 80 characters or less when the browser is resized
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C22">
                Using CSS to control visual presentation of text
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
