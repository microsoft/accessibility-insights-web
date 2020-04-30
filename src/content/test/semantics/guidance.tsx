// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Semantics'} />

        <h2>Why it matters</h2>
        <p>
            Assistive technologies use semantic markup to communicate meaning to users. When semantics are ignored or used incorrectly,
            users are likely to be confused. To ensure the best possible experience for all users, use the correct semantic elements and
            properties, and add CSS styling to achieve your desired visual presentation.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Code lists with semantically correct elements. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        Unordered lists
                        <ul>
                            <li>
                                Use the <Markup.Code>{'<ul>'}</Markup.Code> element for the container.
                            </li>
                            <li>
                                Use the <Markup.Code>{'<li>'}</Markup.Code> element for list items.
                            </li>
                        </ul>
                    </li>
                    <li>
                        Ordered lists
                        <ul>
                            <li>
                                Use the <Markup.Code>{'<ol>'}</Markup.Code> element for the container.
                            </li>
                            <li>
                                Use the <Markup.Code>{'<li>'}</Markup.Code> element for list items.
                            </li>
                        </ul>
                    </li>
                    <li>
                        Definition lists
                        <ul>
                            <li>
                                Use the <Markup.Code>{'<dl>'}</Markup.Code> element for the container.
                            </li>
                            <li>
                                Use the <Markup.Code>{'<dt>'}</Markup.Code> element for terms.
                            </li>
                            <li>
                                Use the <Markup.Code>{'<dd>'}</Markup.Code> element for definitions.
                            </li>
                        </ul>
                    </li>
                </ul>
                <h3>
                    Contain words and phrases that are visually emphasized in semantically correct containers. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        Use the <Markup.Code>{'<em>'}</Markup.Code> element when you want to stress a word or phrase within the context of a
                        sentence or paragraph.
                    </li>
                    <li>
                        Use the <Markup.Code>{'<strong>'}</Markup.Code> element when the word or phrase is important within the context of
                        the entire page.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't use CSS :before or :after to insert meaningful content in the page. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        Some people with visual disabilities need to modify or disable CSS styling, which might cause inserted content to
                        move or disappear entirely.
                    </li>
                </ul>
                <h3>
                    Don’t code elements in a data table as presentational. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        When <Markup.Code>role="presentation"</Markup.Code> is applied to a data table element, assistive technologies can't
                        communicate to users the relationships between cells and row or column headers.
                    </li>
                </ul>
                <h3>
                    Don't use the <Markup.Code>{'<blockquote>'}</Markup.Code> element to indent non-quote text. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        Use CSS <Markup.Code>margin</Markup.Code> properties to create space around blocks of text.
                    </li>
                </ul>
                <h3>
                    Don't use white space characters to increase the spacing between letters of a word. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        Use the CSS <Markup.Code>letter-spacing</Markup.Code> attribute to adjust the spacing between letters.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Use CSS :before and :after correctly</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F87">
                Failure of Success Criterion 1.3.1 due to inserting non-decorative content by using :before and :after pseudo-elements and
                the 'content' property in CSS
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Code data table elements correctly</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H51">
                Using table markup to present tabular information
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H39">
                Using caption elements to associate data table captions with data tables
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H73">
                Using the summary attribute of the table element to give an overview of data tables
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H63">
                Using the scope attribute to associate header cells and data cells in data tables
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H43">
                Using id and headers attributes to associate data cells with header cells in data tables
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F92">
                Failure of Success Criterion 1.3.1 due to the use of role presentation on content which conveys semantic information
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#presentation_role">
                Intentionally Hiding Semantics with the Presentation Role
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Use semantically correct elements for lists</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="http://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/H48">
                Using ol, ul and dl for lists or groups of links
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/2016/NOTE-WCAG20-TECHS-20161007/H40.html">
                Using description lists
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Use semantically correct elements to emphasize important text</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G115">
                Using semantic elements to mark up structure
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H49">
                Using semantic markup to mark emphasized or special text
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F2">
                Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using the
                appropriate markup or text
            </Markup.HyperLink>
        </Markup.Links>

        <h3>
            Use <Markup.Code>{'<blockquote>'}</Markup.Code> elements correctly
        </h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G115">
                Using semantic elements to mark up structure
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H49">
                Using semantic markup to mark emphasized or special text
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F43">
                Failure of Success Criterion 1.3.1 due to using structural markup in a way that does not represent relationships in the
                content
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Control CSS to control letter spacing</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence.html">
                Understanding Success Criterion 1.3.2: Meaningful Sequence
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C8">
                Using CSS letter-spacing to control spacing within a word
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F32">
                Failure of Success Criterion 1.3.2 due to using white space characters to control spacing within a word
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
