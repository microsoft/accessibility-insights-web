// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>A web page must have a title that describes its topic or purpose.</p>

        <h2>Why it matters</h2>
        <p>
            Page titles frequently appear in search results, site maps, and browser tabs. A good page title helps all users quickly judge
            whether a web page contains relevant content.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I am recovering from a stroke and sometimes forget where I am at in a website or large set of open applications. Provide a
                page title on every document so I can quickly ascertain where I am. In situations where the document title is dynamically
                generated, such as a banking website or complex workflows, be explicit in your page title. For example: 'Account Summary for
                John Doe'."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Make sure the page title describes its topic or purpose.</p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    This page has a <Markup.Code>{'<title>'}</Markup.Code> tag, but it doesn't describe the purpose of the page.
                </p>
            }
            failExample={`<html>
                <head>
                [<title>flu-page</title>]
                </head>
                <body>
                ...`}
            passText={
                <p>
                    This page has a <Markup.Code>{'<title>'}</Markup.Code> tag that describes its purpose.
                </p>
            }
            passExample={`<html>
                <head>
                [<title>Tips for treating your child's flu</title>]
                </head>
                <body>
                ...`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/page-titled.html">
                Understanding Success Criterion 2.4.2: Page Titled
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G88">
                Providing descriptive titles for Web pages
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H25">
                Providing a title using the title element
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F25">
                Failure of Success Criterion 2.4.2 due to the title of a Web page not identifying the contents
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G127">
                Identifying a Web page's relationship to a larger collection of Web pages
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
