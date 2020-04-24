// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Parsing',
    },
    ({ Markup }) => (
        <>
            <p>
                Elements must have complete start and end tags, must not contain duplicate attributes, and must be nested according to their
                specifications.
            </p>

            <h2>Why it matters</h2>
            <p>
                Certain parsing errors can prevent assistive technologies from accurately interpreting web content. The following parsing
                issues are relevant to this requirement:
            </p>
            <ul>
                <li>Element doesn't have complete start and end tags.</li>
                <li>Element has mismatched start and end tags.</li>
                <li>Elements are not nested according to their specifications.</li>
                <li>Element has duplicate attributes.</li>
                <li>Element ID is not unique.*</li>
                <li>Attribute is unquoted (under certain circumstances).</li>
                <li>Attribute has mismatched quotes.</li>
                <li>Attributes are not space separated.</li>
                <li>Attribute is malformed.</li>
            </ul>
            <p>*An automated check will fail if duplicate IDs are detected.</p>

            <h2>How to fix</h2>
            <p>
                Address the specific issue identified by the{' '}
                <Markup.HyperLink href="https://validator.w3.org/nu/">Nu Html Checker</Markup.HyperLink>.
            </p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={
                    <p>
                        The checker identified the following error: Element <Markup.Code>h4</Markup.Code> not allowed as child of element{' '}
                        <Markup.Code>span</Markup.Code> in this context.
                    </p>
                }
                passText={
                    <p>
                        The <Markup.Code>span</Markup.Code> element is replaced by a <Markup.Code>section</Markup.Code> element, which is a
                        correct context for a heading element.
                    </p>
                }
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/parsing.html">
                    Understanding Success Criterion 4.1.1: Parsing
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G134">Validating Web pages</Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G192">
                    Fully conforming to specifications
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H88">Using HTML according to spec</Markup.HyperLink>
                <Markup.Inline>
                    <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H74">
                        Ensuring that opening and closing tags are used according to specification
                    </Markup.HyperLink>{' '}
                    and{' '}
                    <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H93">
                        Ensuring that id attributes are unique on a Web page
                    </Markup.HyperLink>{' '}
                    and{' '}
                    <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H94">
                        Ensuring that elements do not contain duplicate attributes
                    </Markup.HyperLink>
                </Markup.Inline>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H75">
                    Ensuring that Web pages are well-formed
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F70">
                    Failure of Success Criterion 4.1.1 due to incorrect use of start and end tags or attribute markup
                </Markup.HyperLink>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F77">
                    Failure of Success Criterion 4.1.1 due to duplicate values of type ID
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
