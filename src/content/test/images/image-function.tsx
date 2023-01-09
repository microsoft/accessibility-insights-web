// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        Screen readers will ignore any image coded as decorative, even if it has an accessible name. Unless an image is coded as decorative,
        screen readers will assume it's meaningful. In an attempt to communicate the image's meaning, they might announce the image's
        filename.
    </p>
));

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Every image must be correctly coded as either meaningful or decorative.</p>

        <h2>Why it matters</h2>
        <p>
            Screen readers will ignore any image coded as decorative, even if it has an accessible name. Unless an image is coded as
            decorative, screen readers will assume it's meaningful. In an attempt to communicate the image's meaning, they might announce
            the image's filename.
        </p>

        <h2>How to fix</h2>
        <ol>
            <li>
                Determine the <Markup.Emphasis>function</Markup.Emphasis> of the image:
                <ul>
                    <li>
                        If the image conveys information that isn't available through other page content, it's{' '}
                        <Markup.Emphasis>meaningful</Markup.Emphasis>.
                    </li>
                    <li>
                        If the image could be removed from the page with no impact on meaning for function, it's{' '}
                        <Markup.Emphasis>decorative</Markup.Emphasis>.
                    </li>
                </ul>
            </li>
            <li>
                If the image is meaningful:
                <ul>
                    <li>
                        Make sure it has a descriptive accessible name using a <Markup.Emphasis>non-empty</Markup.Emphasis>{' '}
                        <Markup.Code>alt</Markup.Code>, <Markup.Code>aria-label</Markup.Code>, <Markup.Code>aria-labelledby</Markup.Code>,
                        or <Markup.Code>title</Markup.Code> attribute. (Only <Markup.Code>{'<img>'}</Markup.Code>,{' '}
                        <Markup.Code>{'<input>'}</Markup.Code>, and <Markup.Code>{'<area>'}</Markup.Code> elements can have{' '}
                        <Markup.Code>alt</Markup.Code> attributes.)
                    </li>
                    <li>
                        If it's an icon font, <Markup.Code>{'<svg>'}</Markup.Code> image, or CSS background image, also add{' '}
                        <Markup.Code>role="img"</Markup.Code>.
                    </li>
                    <li>
                        If it's a CSS background image, also add a text element that conveys the image's information and is visible when CSS
                        is turned off.
                    </li>
                </ul>
            </li>
            <li>
                If the image is decorative:
                <ul>
                    <li>
                        And it's an <Markup.Code>{'<img>'}</Markup.Code>, <Markup.Code>{'<input>'}</Markup.Code>, or{' '}
                        <Markup.Code>{'<area>'}</Markup.Code> element, add an <Markup.Emphasis>empty</Markup.Emphasis>{' '}
                        <Markup.Code>alt</Markup.Code> attribute (<Markup.Code>alt</Markup.Code> or <Markup.Code>alt=""</Markup.Code>).
                    </li>
                    <li>
                        And it's an icon font or <Markup.Code>{'<svg>'}</Markup.Code> image, add <Markup.Code>role="img"</Markup.Code> and{' '}
                        <Markup.Code>aria-hidden="true"</Markup.Code>.
                    </li>
                    <li>And it's a CSS background image, no additional markup is needed.</li>
                </ul>
            </li>
        </ol>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A web page about pets has an image link that opens a page about hamsters. Because the image of the hamster is redundant
                    to the text link, the image is decorative, and its alt attribute is redundant. The screen reader will announce
                    "Hamsters" twice.
                </p>
            }
            failExample={`<a href="hamsters.html">
                <img src="hamster.jpg" [alt="Hamsters"]>
                <strong> Hamsters</strong>
                </a>`}
            passText={
                <p>
                    The image has an empty <Markup.Code>alt</Markup.Code> attribute, so screen readers will announce "Hamsters" only once.
                </p>
            }
            passExample={`<a href="hamsters.html">
                <img src="hamster.jpg" [alt=""]>
                <strong> Hamsters</strong>
                </a>`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html">
                Understanding Success Criterion 1.1.1: Non-text Content
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>

        <h4>Techniques to indicate meaningful images</h4>
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

        <h4>Techniques to indicate decorative images</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C9">
                Using CSS to include decorative images
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H67">
                Using null alt text and no title attribute on img elements for images that AT should ignore
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
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
    </>
));
