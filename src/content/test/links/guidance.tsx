// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Links'} />

        <h2>Why it matters</h2>

        <p>
            A link is a specific type of widget (interactive interface
            component) that navigates the user to new content. An anchor element
            that's programmed to function as something other than a link is a
            custom widget, and it requires an ARIA widget role. The role
            communicates the correct function to assistive technologies and
            enables them to interact with the widget.
        </p>

        <p>
            Understanding a link's purpose helps users decide whether they want
            to follow it. When the link text alone is unclear, sighted users can
            examine the surrounding context for clues about the link's purpose.
            Assistive technologies similarly help non-sighted users by reporting
            the link's programmatically related context.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    {' '}
                    If an anchor element functions as a button, give it the
                    appropriate ARIA widget role. (<Link.WCAG_4_1_2 />)
                </h3>
                <ul>
                    <li>
                        Good: Add <Markup.Code>role="button"</Markup.Code> to
                        the anchor element.
                    </li>
                    <li>
                        Better: Use a <Markup.Code>{`<button>`}</Markup.Code>{' '}
                        element instead of an <Markup.Code>{`<a>`}</Markup.Code>{' '}
                        element. (As a rule, it's better to use native semantics
                        than to modify them using ARIA roles.)
                    </li>
                </ul>

                <h3>
                    {' '}
                    Describe the purpose of each link. (<Link.WCAG_2_4_4 />)
                </h3>
                <ul>
                    <li>
                        Use any of the following:
                        <ul>
                            <li>Good: Programmatically related context</li>
                            <li>
                                Better: Accessible name and/or accessible
                                description
                            </li>
                            <li>Best: Link text</li>
                        </ul>
                    </li>

                    <li>
                        Programmatically related context includes:
                        <ul>
                            <li>
                                Text in the same sentence, paragraph, list item,
                                or table cell as the link
                            </li>
                            <li>Text in a parent list item</li>
                            <li>
                                Text in a table header cell associated with cell
                                that contains the link
                            </li>
                        </ul>
                    </li>

                    <li>
                        Writing tips:
                        <ul>
                            <li>
                                If a link's destination is a document or web
                                application, the name of the document or
                                application is sufficient.
                            </li>
                            <li>
                                Links with different destinations should have
                                different descriptions; links with the same
                                destination should have the same description.{' '}
                            </li>
                            <li>
                                Programmatically related context is easier to
                                understand when it precedes the link.
                            </li>
                        </ul>
                    </li>
                </ul>
            </Markup.Do>
        </Markup.Columns>

        <h2>Learn more</h2>
        <h3>Provide the right ARIA role</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface
                component
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>

        <h3>Describe the purpose of a link</h3>

        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html">
                Understanding Success Criterion 2.4.4: Link Purpose (In Context)
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H30">
                Providing link text that describes the purpose of a link for
                anchor elements
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H33">
                Supplementing link text with the title attribute
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA7">
                Using aria-labelledby for link purpose
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA8">
                Using aria-label for link purpose
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G53">
                Identifying the purpose of a link using link text combined with
                the text of the enclosing sentence
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H77">
                Identifying the purpose of a link using link text combined with
                its enclosing list item
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H78">
                Identifying the purpose of a link using link text combined with
                its enclosing paragraph
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H79">
                Identifying the purpose of a link in a data table using the link
                text combined with its enclosing table cell and associated table
                header cells
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H81">
                Identifying the purpose of a link in a nested list using link
                text combined with the parent list item under which the list is
                nested
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F63">
                Failure of Success Criterion 2.4.4 due to providing link context
                only in content that is not related to the link
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F89">
                Failure of Success Criteria 2.4.4, 2.4.9 and 4.1.2 due to not
                providing an accessible name for an image which is the only
                content in a link
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.nngroup.com/articles/title-attribute/">
                Using the Title Attribute to Help Users Predict Where They Are
                Going
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
