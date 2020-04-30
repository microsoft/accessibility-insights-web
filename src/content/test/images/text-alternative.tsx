// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Text alternative',
    },
    ({ Markup }) => (
        <>
            <p>A meaningful image must have a text alternative that serves the equivalent purpose.</p>

            <h2>Why it matters</h2>
            <p>
                Content conveyed through images alone is not available to people who are blind, and it might not be available to people with
                limited vision or with cognitive disabilities that make it difficult to understand visual content. Because text alternatives
                can be rendered as text, braille, or speech, they make image content available to everyone.
            </p>

            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "I do not rely on my sense of sight to understand images, video, or audio content. Provide me with text-alternatives for
                    all non-text content so my screen reader or braille display can describe the content and help me understand how the
                    content shapes meaning, context, and purpose."
                </Markup.Emphasis>
            </p>

            <h2>How to fix</h2>
            <p>Provide a text alternative that serves the same purpose and presents the same information as the image itself.</p>
            <ul>
                <li>
                    If the image's purpose and content <Markup.Emphasis>can</Markup.Emphasis> be communicated in a short text string, give
                    it an accessible name:
                    <ul>
                        <li>
                            For an <Markup.Code>{'<img>'}</Markup.Code>, <Markup.Code>{'<input>'}</Markup.Code>, or{' '}
                            <Markup.Code>{'<area>'}</Markup.Code> element, provide a descriptive <Markup.Code>alt</Markup.Code> attribute.
                        </li>
                        <li>
                            For an icon font, <Markup.Code>{'<svg>'}</Markup.Code> image, or CSS background image, add{' '}
                            <Markup.Code>role="img"</Markup.Code> and provide a descriptive <Markup.Code>aria-label</Markup.Code>,{' '}
                            <Markup.Code>aria-labelledby</Markup.Code>, or <Markup.Code>title</Markup.Code> attribute.
                        </li>
                    </ul>
                </li>
                <li>
                    If the purpose and content <Markup.Emphasis>can't</Markup.Emphasis> be communicated in a short text string, give it an
                    accessible name and accessible description.
                    <ul>
                        <li>Use the accessible name (as described above) to briefly identify the image's purpose, and</li>
                        <li>
                            Use an <Markup.Code>aria-describedby</Markup.Code> attribute to communicate its full meaning.
                        </li>
                    </ul>
                </li>
            </ul>

            <h3>Special cases</h3>
            <p>
                Sometimes an image is part of a process where revealing the image's content would invalidate the process (such as a CAPTCHA
                test to prove you are human, or a test of visual skills). In this case, describe the purpose of the image, but do not
                disclose its full content.
            </p>
            <p>The text alternative of an image of text should exactly match the text in the image.</p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        The banner of Clive County's website includes an image link showing the county logo. Clicking the logo navigates to
                        the site's home page. The logo's text alternative is "Logo," which does not communicate the purpose or content of
                        the image link.
                    </p>
                }
                passText={
                    <p>
                        The logo's text alternative is changed to "Home: Clive County", which better communicates the purpose of the image.
                    </p>
                }
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html">
                    Understanding Success Criterion 1.1.1: Non-text Content
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>

            <h4>Short text alternative techniques</h4>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G94">
                    Providing short text alternative for non-text content that serves the same purpose and presents the same information as
                    the non-text content
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

            <h4>Long text alternative techniques</h4>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA15">
                    Using aria-describedby to provide descriptions of images
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G73">
                    Providing a long description in another location with a link to it that is immediately adjacent to the non-text content
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G74">
                    Providing a long description in text near the non-text content, with a reference to the location of the long description
                    in the short description
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G92">
                    Providing long description for non-text content that serves the same purpose and presents the same information
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H45">Using longdesc</Markup.HyperLink>
            </Markup.Links>

            <h4>Techniques for CAPTCHA images</h4>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G143">
                    Providing a text alternative that describes the purpose of the CAPTCHA
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F13">
                    Failure of Success Criterion 1.1.1 and 1.4.1 due to having a text alternative that does not include information that is
                    conveyed by color differences in the image
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F20">
                    Failure of Success Criterion 1.1.1 and 4.1.2 due to not updating text alternatives when changes to non-text content
                    occur
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F30">
                    Failure of Success Criterion 1.1.1 and 1.2.1 due to using text alternatives that are not alternatives (e.g., filenames
                    or placeholder text)
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F67">
                    Failure of Success Criterion 1.1.1 and 1.2.1 due to providing long descriptions for non-text content that does not serve
                    the same purpose or does not present the same information
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
