// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Adaptable content'} />
        <h2>Why it matters</h2>
        <p>
            Everyone benefits when text is presented in a way that makes it easy to read. Most people find it easier to read text when it is
            sufficiently large and has a sufficiently high contrast against its background. People with mild visual disabilities, low
            vision, or limited color perception are especially likely to find text unreadable when text is too small, or contrast is too
            low.
        </p>
        <ul>
            <li>
                People with visual or reading disabilities find it easier to read when they can make text larger or increase its
                spacing.{' '}
            </li>
            <li> People with motor disabilities who use mounted displays need content that orients automatically to the screen. </li>
            <li>
                People with low vision, reading disabilities, or motor disabilities find it easier to read text that scrolls in only one
                direction.
            </li>
            <li> Content that appears on hover or focus is easier to read when it is dismissible, hoverable, and persistent.</li>
            <li>
                People with low vision, limited color perception or <Link.Presbyopia /> are especially likely to find text unreadable when
                the contrast is too low.
            </li>
        </ul>
        <p>
            People with <Link.Presbyopia /> also struggle to read small or low-contrast text. A{' '}
            <Markup.HyperLink href="https://www.sciencedirect.com/science/article/pii/S0161642017337971">2018 study</Markup.HyperLink> found
            that 1.8 billion people worldwide have presbyopia. (All people are affected by presbyopia to some degree as they age.)
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Make sure users can zoom the browser to 200% with no loss of text content or functionality. (<Link.WCAG_1_4_4 />)
                </h3>
                <ul>
                    <li>All text must resize fully, including text in form fields.</li>
                    <li>Text must not be clipped, truncated, or obscured.</li>
                    <li>All content must remain available. (Scrolling is ok.)</li>
                    <li>All functionality must remain available.</li>
                </ul>
                <h3>
                    Make sure text elements have sufficient contrast. (<Link.WCAG_1_4_3 />)
                </h3>
                <ul>
                    <li>Regular text must have a contrast ratio ≥ 4.5</li>
                    <li>Large text (18pt or 14pt+bold) must have a contrast ratio ≥ 3.0.</li>
                    <li>
                        When using text over images, measure contrast where the text and background are most likely to have a low contrast
                        ratio (for example, white text on a sky-blue background).
                    </li>
                </ul>

                <h3>
                    Make sure users can increase the spacing between letters, words, lines of text, and paragraphs with no clipping or
                    overlapping. (<Link.WCAG_1_4_12 />)
                </h3>
                <ul>
                    <li> All text must respond to user-initiated changes in spacing.</li>
                    <li> All text must remain visible, with no clipping or overlapping.</li>
                </ul>

                <h3>
                    Make sure users can zoom the browser to 400% and still read the text without having to scroll in two dimensions. (
                    <Link.WCAG_1_4_10 />)
                </h3>
                <ul>
                    <li> Ideally, text read horizontally should require only vertical scrolling, and </li>
                    <li> Text read vertically should require only horizontal scrolling.</li>
                </ul>

                <h3>
                    Make sure content that appears on focus or hover is dismissible, hoverable, and persistent. (<Link.WCAG_1_4_13 />)
                </h3>
                <ul>
                    <li> Dismissible. The user can make the additional content disappear without moving focus or the mouse; </li>
                    <li>
                        Hoverable. The additional content remains visible when the mouse moves from the trigger element onto the additional
                        content; and
                    </li>
                    <li>
                        Persistent. The additional content remains visible until (1) the user removes focus or hover from the trigger
                        element and the additional content, (2) the user explicitly dismisses it, or (3) the information in it becomes
                        invalid.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't disable text scaling and zooming. (<Link.WCAG_1_4_4 />)
                </h3>
                <ul>
                    <li>
                        An automated check will fail if the <Markup.Code>{'<meta name="viewport">'}</Markup.Code> element contains
                        <Markup.Code>user-scalable="no"</Markup.Code>.
                    </li>
                </ul>
                <h3>
                    Don't lock content to any particular screen orientation (<Link.WCAG_1_3_4 />)
                </h3>
                <ul>
                    <li>Allow content to adjust automatically to the user's screen orientation.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>
        <h2>Learn more</h2>

        <h3>Ensure text is resizable</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/resize-text.html">
                Understanding Success Criterion 1.4.4: Resize text
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
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

        <h4>Common failures</h4>
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

        <h4>Additional guidance</h4>
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

        <h3>Ensure text spacing is adjustable</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/text-spacing.html">
                Understanding Success Criterion 1.4.12 Text Spacing
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C36">Allowing for text spacing override</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C35">
                Allowing for text spacing without wrapping
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C28">
                Specifying the size of text containers using em units
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/working-examples/css-text-spacing/">
                Working example of small containers that allow for text spacing
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Ensure web content reorients automatically</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/orientation.html">
                Understanding Success Criterion 1.3.4 Orientation
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Managing_screen_orientation">
                Managing screen orientation
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Ensure content doesn't require scrolling in two dimensions</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/reflow.html">
                Understanding Success Criterion 1.4.10 Reflow
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
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
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://responsivedesign.is/examples/">Examples – Responsive Web Design</Markup.HyperLink>
        </Markup.Links>

        <h3>Ensure that hover or focus content is dismissible, hoverable, and persistent</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html">
                Understanding Success Criterion 1.4.13 Content on Hover or Focus
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F95">
                Failure of Success Criterion 1.4.13 due to content shown on hover not being hoverable
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Ensure text has sufficient contrast</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html">
                Understanding Success Criterion 1.4.3: Contrast (Minimum)
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G18">
                Ensuring that a contrast ratio of at least 4.5:1 exists between text (and images of text) and background behind the text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G145">
                Ensuring that a contrast ratio of at least 3:1 exists between text (and images of text) and background behind the text
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F24">
                Failure of Success Criterion 1.4.3, 1.4.6 and 1.4.8 due to specifying foreground colors without specifying background colors
                or vice versa
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F83">
                Failure of Success Criterion 1.4.3 and 1.4.6 due to using background images that do not provide sufficient contrast with
                foreground text (or images of text)
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
