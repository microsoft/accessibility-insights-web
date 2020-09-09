// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Images'} />
        <h2>Why it matters</h2>
        <p>
            Images are intrinsically inaccessible to people who can't see them. Care must be taken to ensure that images are used
            accessibly:
            <ul>
                <li>
                    Correct markup allows assistive technologies to distinguish between meaningful and decorative images and handle them
                    appropriately.
                </li>
                <li>Good text alternatives enable screen readers to convey the content of meaningful images available to everyone.</li>
                <li>Actual text is better than images of text because users can adjust on-screen text to make it legible. </li>
                <li>
                    Where CAPTCHA is used to screen out robots, providing alternative versions can make it easier for people with
                    disabilities to prove they are human.
                </li>
            </ul>
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Mark every image correctly as either meaningful or decorative. (<Link.WCAG_1_1_1 />)
                </h3>
                <ul>
                    <li>
                        Determine whether each image is meaningful or decorative:
                        <ul>
                            <li>
                                If an image conveys information that isn't available through other page content, it's{' '}
                                <Markup.Emphasis>meaningful</Markup.Emphasis>.{' '}
                            </li>
                            <li>
                                If an image could be removed from the page with no impact on meaning for function, it's{' '}
                                <Markup.Emphasis>decorative</Markup.Emphasis>.{' '}
                            </li>
                        </ul>
                    </li>

                    <li>
                        If the image is meaningful:
                        <ul>
                            <li>
                                For {'<img>'} elements, add a non-empty <Markup.Code>alt</Markup.Code> attribute.
                            </li>
                            <li>
                                For icon fonts, {'<svg>'} images, and CSS background images, add <Markup.Code>role="img"</Markup.Code> and a
                                non-empty <Markup.Code>aria-label</Markup.Code> or <Markup.Code>aria-labelledby</Markup.Code> attribute.
                            </li>
                        </ul>
                    </li>

                    <li>
                        If the image is decorative:
                        <ul>
                            <li>
                                For <Markup.Code>{`<img>`}</Markup.Code> elements, add an empty <Markup.Code>alt</Markup.Code> attribute (
                                <Markup.Code>alt</Markup.Code> or <Markup.Code>alt=""</Markup.Code>).
                            </li>
                            <li>
                                For icon fonts and <Markup.Code>{`<svg>`}</Markup.Code> images, add <Markup.Code>role="img"</Markup.Code>{' '}
                                and <Markup.Code>aria-hidden="true"</Markup.Code>.
                            </li>
                            <li>For CSS background images, no additional markup is needed.</li>
                        </ul>
                    </li>
                </ul>

                <h3>
                    For each meaningful image, provide a text alternative that serves the same purpose and presents the same information as
                    the image itself. (<Link.WCAG_1_1_1 />)
                </h3>
                <ul>
                    <li>
                        For simple images, provide an accessible name (using, <Markup.Code>alt</Markup.Code>,{' '}
                        <Markup.Code>aria-label</Markup.Code>, or <Markup.Code>aria-labelledby</Markup.Code>).
                    </li>
                    <li>
                        For complex images, use the accessible name to identify the image's purpose and add a description (
                        <Markup.Code>aria-describedby</Markup.Code>) to communicates its full meaning.
                    </li>
                </ul>

                <h3>
                    If you use non-text CAPTCHA, provide at least visual and auditory versions. (<Link.WCAG_1_1_1 />)
                </h3>
                <ul>
                    <li>yet, use non-interactive methods to detect robots, such as monitoring mouse and keyboard input.</li>
                </ul>
            </Markup.Do>

            <Markup.Dont>
                <h3>
                    Don't use images of text unless a specific visual presentation is essential. (<Link.WCAG_1_4_5 />)
                </h3>
                <ul>
                    <li>Where possible, use actual text instead of images of text.</li>
                    <li>Alternatively, provide functionality that allows users to customize the text within the image.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Mark images as meaningful or decorative</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html">
                Understanding Success Criterion 1.1.1: Non-text Content
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>

        <h5>Meaningful images</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G94">
                Providing short text alternative for non-text content that serves the same purpose and presents the same information as the
                non-text content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6">
                Using aria-label to provide labels for objects
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA10">
                Using aria-labelledby to provide a text alternative for non-text content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G196">
                Using a text alternative on one item within a group of images that describes all items in the group
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H2">
                Combining adjacent image and text links for the same resource
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H37">
                Using alt attributes on img elements
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H86">
                Providing text alternatives for ASCII art, emoticons, and leetspeak
            </Markup.HyperLink>
        </Markup.Links>

        <h5>Decorative images</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C9">
                Using CSS to include decorative images
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H67">
                Using null alt text and no title attribute on img elements for images that AT should ignore
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F3">
                Failure of Success Criterion 1.1.1 due to using CSS to include images that convey important information
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F38">
                Failure of Success Criterion 1.1.1 due to not marking up decorative images in HTML in a way that allows assistive technology
                to ignore them
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F39">
                Failure of Success Criterion 1.1.1 due to providing a text alternative that is not null (e.g., alt="spacer" or alt="image")
                for images that should be ignored by assistive technology
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F65">
                Failure of Success Criterion 1.1.1 due to omitting the alt attribute or text alternative on img elements, area elements, and
                input elements of type "image"
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F71">
                Failure of Success Criterion 1.1.1 due to using text look-alikes to represent text without providing a text alternative
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F72">
                Failure of Success Criterion 1.1.1 due to using ASCII art without providing a text alternative
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Provide text alternatives for meaningful images</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html">
                Understanding Success Criterion 1.1.1: Non-text Content
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>

        <h5>Short alternatives</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G94">
                Providing short text alternative for non-text content that serves the same purpose and presents the same information as the
                non-text content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6">
                Using aria-label to provide labels for objects
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA10">
                Using aria-labelledby to provide a text alternative for non-text content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G196">
                Using a text alternative on one item within a group of images that describes all items in the group
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H2">
                Combining adjacent image and text links for the same resource
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H37">
                Using alt attributes on img elements
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H86">
                Providing text alternatives for ASCII art, emoticons, and leetspeak
            </Markup.HyperLink>
        </Markup.Links>

        <h5>Long alternatives</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA15">
                Using aria-describedby to provide descriptions of images
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G73">
                Providing a long description in another location with a link to it that is immediately adjacent to the non-text content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G74">
                Providing a long description in text near the non-text content, with a reference to the location of the long description in
                the short description
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G92">
                Providing long description for non-text content that serves the same purpose and presents the same information
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H45">Using longdesc</Markup.HyperLink>
        </Markup.Links>

        <h5>Alternatives for CAPTCHA images</h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G143">
                Providing a text alternative that describes the purpose of the CAPTCHA{' '}
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F13">
                Failure of Success Criterion 1.1.1 and 1.4.1 due to having a text alternative that does not include information that is
                conveyed by color differences in the image
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F20">
                Failure of Success Criterion 1.1.1 and 4.1.2 due to not updating text alternatives when changes to non-text content occur
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F30">
                Failure of Success Criterion 1.1.1 and 1.2.1 due to using text alternatives that are not alternatives (e.g., filenames or
                placeholder text)
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F67">
                Failure of Success Criterion 1.1.1 and 1.2.1 due to providing long descriptions for non-text content that does not serve the
                same purpose or does not present the same information
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Avoid images of text</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/images-of-text.html">
                Understanding Success Criterion 1.4.5: Images of Text
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
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

        <h4>Additional guidance</h4>
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

        <h3>Provide accessible CAPTCHAs</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html">
                Understanding Success Criterion 1.1.1: Non-text Content
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G144">
                Ensuring that the Web Page contains another CAPTCHA serving the same purpose using a different modality
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/turingtest/">Inaccessibility of CAPTCHA</Markup.HyperLink>
        </Markup.Links>
    </>
));
