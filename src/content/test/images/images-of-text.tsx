// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

/** Examples need special headers (HTML/CSS) */
export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Images of text are allowed only where a specific appearance is required (e.g., logotypes).</p>

        <h2>Why it matters</h2>
        <p>
            People with low vision, visual tracking problems, or reading disabilities might need to adjust the way text is displayed to make
            it readable. Browsers and browser extensions allow users to adjust actual text, but not the text in images of text.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "Images of text content are invisible to me. Do not use images of text for anything other than logos and decorative items."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Use one of the following methods to make text adjustable:</p>
        <ul>
            <li>
                Good: Provide functionality allowing users to adjust the way text is displayed in images of text, including the font size,
                font family, foreground/background colors, line spacing, and alignment; or
            </li>
            <li>Better: Use actual text.</li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>An image of text is used in an image button where no specific appearance is required.</p>}
            failExample={
                <Markup.CodeExample title="HTML">{`<form action="/action_page.php">
                <p id="username">User name: <input type="text" name="uname"></p>
                <input [type="image" src="submit.gif"] alt="Submit">
                </form>`}</Markup.CodeExample>
            }
            passText={<p>A submit button uses actual text and CSS styling to achieve the desired appearance.</p>}
            passExample={[
                <Markup.CodeExample key="css" title="CSS">{`<style>
                .button {
                background-color: #4CAF50;
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                }
                </style>`}</Markup.CodeExample>,
                <Markup.CodeExample key="html" title="HTML">{`<form action="/action_page.php">
                <p id="username">User name: <input type="text" name="uname"></p>
                <input [type="submit" class="button"]>
                </form>`}</Markup.CodeExample>,
            ]}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html">
                Understanding Success Criterion 1.4.5: Images of Text
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C22">
                Using CSS to control visual presentation of text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C30">
                Using CSS to replace text with images of text and providing user interface controls to switch
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G140">
                Separating information and structure from presentation to enable different presentations
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C12">Using percent for font sizes</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C13">Using named font sizes</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C14">Using em units for font sizes</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C8">
                Using CSS letter-spacing to control spacing within a word
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C6">
                Positioning content based on structural markup
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
