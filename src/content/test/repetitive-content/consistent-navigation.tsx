// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { createWithTitle, React } from '../../common';

export const infoAndExamples = createWithTitle(
    {
        pageTitle: 'Consistent navigation',
    },
    ({ Markup }) => (
        <>
            <p>Navigational mechanisms that appear on multiple pages must be presented in the same relative order.</p>

            <h2>Why it matters</h2>
            <p>
                When navigational mechanisms (typically links) appear in the same order on each page of a website or web app, users can
                navigate within and across pages more efficiently. Consistent navigation is helpful for everyone, especially people who use
                screen readers or screen magnifiers and people with cognitive disabilities.
            </p>
            <h3>From a user's perspective</h3>
            <p>
                <Markup.Emphasis>
                    "I have trouble quickly moving around a website and may sometimes, forget where I am or, where I started. Place
                    navigation controls in a consistent location and order wherever they appear so I can rely on them to help keep me
                    re-orient."
                </Markup.Emphasis>
            </p>

            <h2>How to fix</h2>
            <p>
                Arrange navigational mechanisms that repeat across pages so they always appear in the same relative order. Note it is not
                necessary for <Markup.Emphasis>page-specific</Markup.Emphasis> links to appear in the same exact order.
            </p>

            <h2>Example</h2>
            <Markup.PassFail
                failText={<p>A website contains a group of related pages. Each page has a uniquely-ordered navigation menu.</p>}
                failExample={`Page 1 menu
            <div id="mainmenu">
            <a href="SQL.htm">SQL</a><br />
            [<a href="Java.htm">Java and Javascript</a><br />
            <a href="C.htm">C# and C++</a><br />
            <a href="Python.htm">Python</a>]
            </div>

            Page 2 menu
            <div id="mainmenu">
            <a href="SQL.htm">SQL</a><br />
            [<a href="C.htm">C# and C++</a><br />
            <a href="Python.htm">Python</a>
            <a href="Java.htm">Java and Javascript</a><br />]
            </div>`}
                passText={<p>All page groups use the same navigation menu.</p>}
                passExample={`All pages have the same menu
            [<div id="mainmenu">
            <a href="SQL.htm">SQL</a><br />
            <a href="Java.htm">Java and Javascript</a><br />
            <a href="C.htm">C# and C++</a><br />
            <a href="Python.htm">Python</a>]
            </div>`}
            />

            <h2>More examples</h2>

            <h3>WCAG success criteria</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/consistent-navigation">
                    Understanding Success Criterion 3.2.3: Consistent Navigation
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Sufficient techniques</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G61">
                    Presenting repeated components in the same relative order each time they appear
                </Markup.HyperLink>
            </Markup.Links>

            <h3>Common failures</h3>
            <Markup.Links>
                <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F66">
                    Failure of 3.2.3 due to presenting navigation links in a different relative order on different pages
                </Markup.HyperLink>
            </Markup.Links>
        </>
    ),
);
