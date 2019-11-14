// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Parsing'} />
        <h2>Why it matters</h2>
        <p>
            Certain parsing errors can prevent assistive technologies from
            accurately interpreting web content.
        </p>
        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Ensure that assistive technologies can accurately parse your
                    page’s content. (<Link.WCAG_4_1_1 />)
                </h3>
                <ul>
                    <li>
                        Elements must be nested according to their
                        specifications.
                    </li>
                    <li>Elements must have complete start and end tags.</li>
                    <li>Elements must not contain duplicate attributes.</li>
                </ul>
            </Markup.Do>
        </Markup.Columns>
        <h2>Learn more</h2>

        <h3>Avoid parsing errors </h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/parsing.html">
                Understanding Success Criterion 4.1.1: Parsing
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G134">
                Validating Web pages
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G192">
                Fully conforming to specifications
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H88">
                Using HTML according to spec
            </Markup.HyperLink>
            <Markup.Inline>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H74">
                    Ensuring that opening and closing tags are used according to
                    specification
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
            <h4>Common failures</h4>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F70">
                Failure of Success Criterion 4.1.1 due to incorrect use of start
                and end tags or attribute markup
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F77">
                Failure of Success Criterion 4.1.1 due to duplicate values of
                type ID
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
