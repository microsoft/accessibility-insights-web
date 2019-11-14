// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Repetitive Content'} />
        <h2>Why it matters</h2>
        <p>
            When interacting with a website or web app, keyboard users need a
            way to skip repetitive content and navigate directly to the page's
            primary content. Content that appears repeatedly within a website or
            web app must be ordered and identified consistently to allow users
            to locate specific information efficiently.
        </p>
        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide at least one method for keyboard users to navigate
                    directly to the page’s main content. (<Link.WCAG_2_4_1 />)
                </h3>
                <ul>
                    <li>
                        Acceptable methods include{' '}
                        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G1">
                            skip links
                        </Markup.HyperLink>
                        ,{' '}
                        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                            landmarks
                        </Markup.HyperLink>
                        , and
                        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H69">
                            headings
                        </Markup.HyperLink>
                        .
                    </li>
                    <li>
                        Skip links are a best practice, as they're available to
                        all keyboard users, even if they don't use any assistive
                        technology.{' '}
                    </li>
                </ul>
                <h3>
                    Make sure navigational links that appear on multiple pages
                    are ordered consistently. (<Link.WCAG_3_2_3 />)
                </h3>
                <ul>
                    <li>
                        It’s ok if non-repeated (page-specific) links are
                        inserted between repeated (site-wide) links.
                    </li>
                </ul>
                <h3>
                    Make sure functional components that appear on multiple
                    pages are identified consistently. (<Link.WCAG_3_2_4 />)
                </h3>
                <ul>
                    <li>
                        Every time the same specific functional component
                        appears, use the same label, icon, and/or text
                        alternative.
                    </li>
                </ul>
            </Markup.Do>
        </Markup.Columns>
        <h2>Learn more</h2>
        <h3>Allow users to bypass blocks of repeated content</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks">
                Understanding Success Criterion 2.4.1: Bypass Blocks
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <h5>
            Use one of these techniques to provide a link for bypassing repeated
            content:
        </h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G1">
                Adding a 'skip link' at the top of the page that navigates
                directly to the main content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G123">
                Adding a link at the beginning of a block of repeated content
                that navigates to the end of the block
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G124">
                Adding links at the top of the page that navigate to each
                section of content
            </Markup.HyperLink>
        </Markup.Links>

        <h5>
            Use one of these techniques to group blocks of repeated content so
            they can be bypassed:
        </h5>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                Using ARIA landmarks to identify regions of a page
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H69">
                Providing headings at the beginning of each section of content
            </Markup.HyperLink>
            <Markup.Inline>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H70">
                    Using frame elements to group blocks of repeated content
                </Markup.HyperLink>{' '}
                and{' '}
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H64">
                    Using the title attribute of the frame and iframe elements
                </Markup.HyperLink>
            </Markup.Inline>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR28">
                Containing repeated content in a collapsible menu
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Provide consistent navigation</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation">
                Understanding Success Criterion 3.2.3: Consistent Navigation
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G61">
                Presenting repeated components in the same relative order each
                time they appear
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F66">
                Failure of 3.2.3 due to presenting navigation links in a
                different relative order on different pages
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Provide consistent identification</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification">
                Understanding Success Criterion 3.2.4: Consistent Identification
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G197">
                Using consistent labels, names, and text alternatives for
                content that has the same functionality
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F31">
                Failure due to using two different labels for the same function
                on different pages
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
