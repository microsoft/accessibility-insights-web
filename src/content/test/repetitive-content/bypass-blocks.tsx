// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const whyItMatters = create(() => (
    <p>
        Web pages typically have blocks of content that repeat across multiple pages, such as banners and site navigation menus. A person
        who uses a mouse can visually skim past that repeated content to access a link or other control within the primary content with a
        single click. Similarly, a bypass mechanism allows keyboard users to navigate directly to the page’s main content without dozens of
        keystrokes. People with limited mobility could find this task difficult or painful, and people who use screen readers could find it
        tedious to listen as each repeated element is announced.
    </p>
));

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>A page must provide a keyboard-accessible method to bypass repetitive content.</p>

        <h2>Why it matters</h2>
        <p>
            Web pages typically have blocks of content that repeat across multiple pages, such as banners and site navigation menus. A
            person who uses a mouse can visually skim past that repeated content to access a link or other control within the primary
            content with a single click. Similarly, a bypass mechanism allows keyboard users to navigate directly to the page’s main
            content. Otherwise, reaching the primary content could require dozens of keystrokes. People with limited mobility could find
            this task difficult or painful, and people who use screen readers could find it tedious to listen as each repeated element is
            announced.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I navigate content and interfaces using a screen reader and a keyboard. Repeated blocks of navigation and content force me
                to 're-read' everything as I work back and forth over the interface to complete a task or, enjoy content. Allow me a way to
                'bypass' repetitive blocks of navigation and content via keyboard commands, skip links, and WAI-ARIA regions."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Implement one or more of the following keyboard-accessible methods for bypassing repetitive content:</p>
        <ul>
            <li>
                Provide a link for bypassing repeated content (preferred, as it helps all keyboard users):
                <ul>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G1">
                                Add a 'skip link' at the top of the page that navigates directly to the main content
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G123">
                                Add a link at the beginning of a block of repeated content that navigates to the end of the block
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G124">
                                Add links at the top of the page that navigate to each section of content
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                </ul>
            </li>
            <li>
                Group blocks of content so they can be bypassed (acceptable, but it helps only users of assistive technology):
                <ul>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                                Use ARIA landmarks to identify regions of a page
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H69">
                                Provide headings at the beginning of each section of content
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H70">
                                Use frame elements to group blocks of repeated content
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                    <li>
                        <Markup.Links>
                            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR28">
                                Contain repeated content in a collapsible menu
                            </Markup.HyperLink>
                        </Markup.Links>
                    </li>
                </ul>
            </li>
        </ul>

        <Markup.PassFail
            failText={<p>This page has no keyboard-accessible method for bypassing repetitive content.</p>}
            failExample={`<body>
            ...
            <main>
            <p>It was Ralph Waldo Emerson who said, "Build a better mousetrap, and the world will beat a path to your door."</p>
            `}
            passText={
                <p>
                    A skip link is added as the first item in the page. In this case, the skip link is always visible, but it could be{' '}
                    <Markup.HyperLink href="https://webaim.org/techniques/css/invisiblecontent/#skipnavlinks">
                        hidden using CSS.
                    </Markup.HyperLink>
                </p>
            }
            passExample={`<body>
            [<a href="#maincontent">Skip to main content</a>]
            ...
            <main [id="maincontent"]>
            <p>It was Ralph Waldo Emerson who said, "Build a better mousetrap, and the world will beat a path to your door."</p>
            `}
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks">
                Understanding Success Criterion 2.4.1: Bypass Blocks
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
        <p>Use one of these techniques to provide a link for bypassing repeated content:</p>

        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G1">
                Adding a 'skip link' at the top of the page that navigates directly to the main content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G123">
                Adding a link at the beginning of a block of repeated content that navigates to the end of the block
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G124">
                Adding links at the top of the page that navigate to each section of content
            </Markup.HyperLink>
        </Markup.Links>

        <p>OR use one of these techniques to group blocks of repeated content so they can be bypassed:</p>

        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                Using ARIA landmarks to identify regions of a page
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H69">
                Providing headings at the beginning of each section of content
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H70">
                Using frame elements to group blocks of repeated content
            </Markup.HyperLink>
            and
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H64">
                Using the title attribute of the frame and iframe elements
            </Markup.HyperLink>
        </Markup.Links>

        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR28">
                Containing repeated content in a collapsible menu
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
