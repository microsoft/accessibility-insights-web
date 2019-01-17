// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create, GuidanceTitle } from '../../common';

const name = 'Text legibility';
export const guidance = create(({ Markup, Link }) => <>
    <GuidanceTitle name={name}/>
    <h1>{name}</h1>
    <h2>Why it matters</h2>
    <p>
        Most people find it easier to read text when it is sufficiently large and has a sufficiently high contrast against its background.
        People with mild visual disabilities, low vision, or limited color perception are especially likely to find text unreadable when text is too small, or contrast is too low.
    </p>
    <p>
        People with <Markup.HyperLink href="https://en.wikipedia.org/wiki/Presbyopia">presbyopia</Markup.HyperLink> also struggle to read small or low-contrast text.
        A <Markup.HyperLink href="https://www.sciencedirect.com/science/article/pii/S0161642017337971">2018 study</Markup.HyperLink> found that 1.8 billion people worldwide have presbyopia. (All people are affected by presbyopia to some degree as they age.)

    </p>

    <Markup.Columns>
        <Markup.Do>
            <h3>Make sure users can zoom the browser to 200% with no loss of text content or functionality. (<Link.WCAG_1_4_4 />)</h3>
            <ul>
                <li>All text must resize fully, including text in form fields.</li>
                <li>Text must not be clipped, truncated, or obscured.</li>
                <li>All content must remain available. (Scrolling is ok.)</li>
                <li>All functionality must remain available.</li>
            </ul>
            <h3>Make sure text elements have sufficient contrast. (<Link.WCAG_1_4_3 />)</h3>
            <ul>
                <li>Regular text must have a contrast ratio ≥ 4.5</li>
                <li>Large text (18pt or 14pt+bold) must have a contrast ratio ≥ 3.0.</li>
                <li>When using text over images, measure contrast where the text and background are most likely to have a low contrast ratio (for example, white text on a sky-blue background).</li>
            </ul>
        </Markup.Do>
        <Markup.Dont>
            <h3>Don't disable text scaling and zooming. (<Link.WCAG_1_4_4 />)</h3>
            <ul>
                <li>An automated check will fail if the <Markup.Code>{'<meta name="viewport">'}</Markup.Code> element contains <Markup.Code>user-scalable="no"</Markup.Code>.</li>
            </ul>
        </Markup.Dont>
    </Markup.Columns>
    <h2>Learn more</h2>

    <h3>Ensure text is resizable</h3>

    <h4>WCAG success criteria</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html">
            Understanding Success Criterion 1.4.4: Resize text</Markup.HyperLink>
    </Markup.Links>

    <h4>Sufficient techniques</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C28">
            Specifying the size of text containers using em units</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C12">
            Using percent for font sizes</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C13">
            Using named font sizes</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C14">
            Using em units for font sizes</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR34">
            Calculating size and position in a way that scales with text size</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G146">
            Using liquid layout</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G179">
            Ensuring that there is no loss of content or functionality when the text resizes and text containers do not change their width</Markup.HyperLink>
    </Markup.Links>

    <h4>Common failures</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F69">
            Failure of Success Criterion 1.4.4 when resizing visually rendered text up to 200 percent causes the text, image or controls to be clipped, truncated or obscured</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F80">
            Failure of Success Criterion 1.4.4 when text-based form controls do not resize when visually rendered text is resized up to 200%</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F94">
            Failure of Success Criterion 1.4.4 due to text sized in viewport units</Markup.HyperLink>
    </Markup.Links>

    <h4>Additional guidance</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C17">
            Scaling form elements which contain text</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C20">
            Using relative measurements to set column widths so that lines can average 80 characters or less when the browser is resized</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C22">
            Using CSS to control visual presentation of text</Markup.HyperLink>
    </Markup.Links>

    <h3>Ensure text has sufficient contrast</h3>

    <h4>WCAG success criteria</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html">
            Understanding Success Criterion 1.4.3: Contrast (Minimum)</Markup.HyperLink>
    </Markup.Links>

    <h4>Sufficient techniques</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G18">
            Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G145">
            Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text</Markup.HyperLink>
    </Markup.Links>

    <h4>Common failures</h4>
    <Markup.Links>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F24">
            Failure of Success Criterion 1.4.3, 1.4.6 and 1.4.8 due to specifying foreground colors without specifying background colors or vice versa</Markup.HyperLink>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F83">
            Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with foreground text (or images of text)</Markup.HyperLink>
    </Markup.Links>

</>);
