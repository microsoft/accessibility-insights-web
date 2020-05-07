// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Users must have multiple ways to locate and navigate to a page.</p>

        <h2>Why it matters</h2>
        <p>
            All users benefit when they can find content in a way that's convenient for them. A person using a screen reader or magnifier
            might find it easier to locate a page using search rather than a navigation menu. A person with a reading disability might
            prefer a site map or a table of contents.
        </p>

        <h2>How to fix</h2>
        <ul>
            <li>Good: Provide two or more methods for users to find and navigate to pages in a website.</li>
            <li>Better: Make site search one of the methods.</li>
        </ul>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    Each page in a website has a navigation menu with links to all other pages in the site. The page offers no other method
                    for locating pages.
                </p>
            }
            passText={
                <p>
                    In addition to the navigation menu, each page has a search mechanism that allows users to find pages that contain
                    specific words or phrases.
                </p>
            }
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/multiple-ways.html">
                Understanding Success Criterion 2.4.5: Multiple Ways
            </Markup.HyperLink>
        </Markup.Links>

        <h3> Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G125">
                Providing links to navigate to related Web pages
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G64">Providing a Table of Contents</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G63">Providing a site map</Markup.HyperLink>
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
    </>
));
