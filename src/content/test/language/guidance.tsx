// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Language'} />
        <h2>Why it matters</h2>
        <p>
            When the correct language is programmatically identified, browsers
            and assistive technologies can render the text more accurately;
            screen readers can use the correct pronunciation; visual browsers
            can display the correct characters; and media players can show
            captions correctly. All users find it easier to understand the
            page's content.
        </p>
        <p>
            Identifying the correct text direction allows browsers to correctly
            render right-to-left scripts, such as Arabic and Hebrew.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Define the correct default language for the page.(
                    <Link.WCAG_3_1_1 />)
                </h3>
                <ul>
                    <li>
                        Use the correct{' '}
                        <Markup.HyperLink href="http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry">
                            lang attribute
                        </Markup.HyperLink>{' '}
                        on the page's <Markup.Code>{'<html>'}</Markup.Code>{' '}
                        element.
                    </li>
                    <li>
                        An automated check will fail if the{' '}
                        <Markup.Code>{'<html>'}</Markup.Code>element's{' '}
                        <Markup.Code>lang</Markup.Code> attribute is missing or
                        invalid.
                    </li>
                </ul>
                <h3>
                    Define the correct language for any passage in a different
                    language. (<Link.WCAG_3_1_2 />)
                </h3>
                <ul>
                    <li>
                        Add the correct{' '}
                        <Markup.HyperLink href="http://www.iana.org/assignments/language-subtag-registry/language-subtag-registry">
                            lang attribute
                        </Markup.HyperLink>{' '}
                        to an element that contains the text.
                    </li>
                    <li>
                        An automated check will fail if any element has an
                        invalid <Markup.Code>lang</Markup.Code> attribute.
                    </li>
                </ul>
                <h3>
                    Define the correct text direction if the language uses a
                    script that's read right-to-left. (<Link.WCAG_1_3_2 />)
                </h3>
                <ul>
                    <li>
                        If the default language of the page is read
                        right-to-left, add <Markup.Code>dir="rtl"</Markup.Code>{' '}
                        to the page's <Markup.Code>{'<html>'}</Markup.Code>
                        element.
                    </li>
                    <li>
                        If only a passage is read right-to-left, add{' '}
                        <Markup.Code>dir="rtl"</Markup.Code> to the element that
                        contains the passage.
                    </li>
                </ul>
            </Markup.Do>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Define the default language for a page</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html">
                Understanding Success Criterion 3.1.1: Language of Page
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H57">
                Using language attributes on the html element
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Define the language for a passage</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html">
                Understanding Success Criterion 3.1.2: Language of Parts
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H58">
                Using the lang attribute to identify changes in the human
                language
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Define the text direction for a page or passage</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/International/questions/qa-html-dir">
                Structural markup and right-to-left text in HTML
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/International/articles/inline-bidi-markup/">
                Inline markup and bidirectional text in HTML
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H56">
                Using the dir attribute on an inline element to resolve problems
                with nested directional runs
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
