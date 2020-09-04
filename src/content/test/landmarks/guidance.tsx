// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';
import { LandmarkTable } from './landmark-table';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Landmarks'} />

        <h2>Why it matters</h2>
        <p>Note: Landmarks are not required; however, if landmarks are used, they must be used correctly.</p>
        <p>
            Landmarks help users understand a web page's structure and organization. Adding ARIA landmark roles to a page's sections takes
            structural information that is conveyed visually and represents it programmatically. Screen readers and other assistive
            technologies, like browser extensions, can use this information to enable or enhance navigation.
        </p>
        <p>
            For more information about how to use ARIA landmarks, see{' '}
            <Link.WAIARIAAuthoringPractices>WAI-ARIA Authoring Practices 1.1: Landmark Regions</Link.WAIARIAAuthoringPractices>
        </p>
        <p>
            See <Link.BingoBakery>this fun video</Link.BingoBakery> to learn how landmarks, headings, and tab stops work together to provide
            efficient navigation.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Contain all visible content within landmark regions. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        Turn on the <Markup.Term>Landmarks</Markup.Term> visual helper, then zoom out so you can see the entire page. If you
                        see any visible content (like text, images, or controls) outside the dashed borders, that’s a failure.
                    </li>
                    <li>
                        An automated check will fail if the page uses landmarks and some visible content is not contained within a landmark.
                    </li>
                </ul>
                <h3>
                    Choose the landmark role that best describes the area’s content. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>In the visual helper, each landmark role has a unique color, and the role is displayed in its tag.</li>
                </ul>
                <LandmarkTable markup={Markup} />

                <h3>
                    Provide exactly one main landmark in every page. (<Link.WCAG_1_3_1 />, <Link.WCAG_2_4_1 />)
                </h3>
                <ul>
                    <li>An automated check will fail if the page contains more than one main landmark.</li>
                    <li>
                        Exception: If the page contains nested document or application roles, each one can have its own{' '}
                        <Markup.Term>banner</Markup.Term>, <Markup.Term>main</Markup.Term> and <Markup.Term>contentinfo</Markup.Term>{' '}
                        landmarks.
                    </li>
                </ul>

                <h3>
                    Include all of the page's primary content in the main landmark. (<Link.WCAG_1_3_1 />, <Link.WCAG_2_4_1 />)
                </h3>

                <h3>
                    If you use the same landmark role more than once in a page, give each instance a unique accessible label. (
                    <Link.WCAG_2_4_1 />)
                </h3>
                <ul>
                    <li>
                        In the visual helper, accessible labels (<Markup.Term>aria-label</Markup.Term> or{' '}
                        <Markup.Term>aria-labelledby</Markup.Term>) are enclosed in quotes.
                    </li>
                    <li>
                        Exception: If the page has two or more navigation landmarks that contain the same set of links, those landmarks
                        should have the same label.
                    </li>
                    <li>An automated check will fail if the page contains non-unique landmarks.</li>
                </ul>

                <h3>Provide a descriptive label for any region landmark. (best practice)</h3>
                <ul>
                    <li>Regions allow you to create custom landmarks when the standard roles don’t accurately describe your content.</li>
                    <li>
                        A <Markup.Code>{'<section>'}</Markup.Code> element is a landmark region <Markup.Emphasis>only</Markup.Emphasis> if
                        it has a label.
                    </li>
                </ul>
                <h3>Provide a visible label for any form landmarks. (best practice)</h3>
                <ul>
                    <li>
                        Use <Markup.Term>aria-labelledby</Markup.Term> to programmatically associate the visible label with the landmark.
                    </li>
                </ul>
                <h3>Use Native html sectioning elements where possible. (best practice)</h3>
                <ul>
                    <li>
                        <Markup.Term>Search</Markup.Term> is the only landmark that requires an ARIA <Markup.Term>role</Markup.Term>{' '}
                        attribute. All other landmarks can be implemented using native HTML elements.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>Don’t include any repeated content in the main landmark. (WCAG 2.4.1)</h3>
                <ul>
                    <li>
                        The main landmark should not include any blocks of content that repeat on multiple pages, such as site navigation
                        links.
                    </li>
                </ul>
                <h3>Don't use too many landmarks. (best practice)</h3>
                <ul>
                    <li>
                        Five to seven landmarks in a page is ideal. More than that makes it difficult for users to efficiently navigate the
                        page.
                    </li>
                </ul>
                <h3>Don't repeat the landmark’s role in its label. (best practice)</h3>
                <ul>
                    <li>
                        In the visual helper, the label displayed for each landmark approximates how most screen readers would announce it.
                    </li>
                </ul>
                <h3>Don't use more than one main, banner, or contentinfo landmark.</h3>
                <ul>
                    <li>An automated check will fail if the page contains more than one banner or contentinfo landmark.</li>
                    <li>An automated check will fail if a banner, contentinfo, or main landmark is nested within another landmark.</li>
                    <li>
                        Exception: If the page contains nested document or application roles, each one can have its own banner, main and
                        contentinfo landmarks.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>
        <h3>Make page structure available to assistive technologies</h3>

        <Markup.Emphasis>WCAG success criteria</Markup.Emphasis>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Use landmarks to bypass blocks</h3>

        <Markup.Emphasis>WCAG success criteria</Markup.Emphasis>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html">
                Understanding Success Criterion 2.4.1: Bypass Blocks
            </Markup.HyperLink>
        </Markup.Links>

        <Markup.Emphasis>Sufficient techniques</Markup.Emphasis>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA11">
                Using ARIA landmarks to identify regions of a page
            </Markup.HyperLink>
        </Markup.Links>

        <Markup.Emphasis>Additional guidance</Markup.Emphasis>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/examples/landmarks/index.html">
                ARIA Landmarks Example
            </Markup.HyperLink>
            <Link.WAIARIAAuthoringPractices>WAI-ARIA Authoring Practices 1.1: Landmark Regions</Link.WAIARIAAuthoringPractices>
        </Markup.Links>
    </>
));
