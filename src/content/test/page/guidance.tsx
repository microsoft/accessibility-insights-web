// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Page Navigation'} />
        <p>
            Providing multiple methods for locating and navigating to pages in a
            website ensures everyone has a method that works for them. Good page
            titles help all users quickly judge whether a web page contains
            relevant content. Good frame and iframe names are similarly helpful
            to people who use assistive technologies.
        </p>
        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Give every page a title that describes its topic or purpose.
                    (<Link.WCAG_2_4_2 />)
                </h3>

                <h3>
                    Give every frame or iframe an accessible name that describes
                    its content.(
                    <Link.WCAG_4_1_2 />)
                </h3>

                <h3>
                    Provide two or more methods for users to find and navigate
                    to pages in a website. (<Link.WCAG_2_4_5 />)
                </h3>
                <ul>
                    <li>Ideally, make site search one of the methods.</li>
                </ul>
            </Markup.Do>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Give web pages descriptive titles</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html">
                Understanding Success Criterion 2.4.2: Page Titled
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G88">
                Providing descriptive titles for Web pages
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H25">
                Providing a title using the title element
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F25">
                Failure of Success Criterion 2.4.2 due to the title of a Web
                page not identifying the contents
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G127">
                Identifying a Web page's relationship to a larger collection of
                Web pages
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Give frames and iframes descriptive names</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Provide multiple ways to locate pages</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html">
                Understanding Success Criterion 2.4.5: Multiple Ways
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G125">
                Providing links to navigate to related Web pages
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G64">
                Providing a Table of Contents
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G63">
                Providing a site map
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G161">
                Providing a search function to help users find content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G126">
                Providing a list of links to all other Web pages
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G185">
                Linking to all of the pages on the site from the home page
            </Markup.HyperLink>
        </Markup.Links>
    </React.Fragment>
));
