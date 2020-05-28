// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Headings'} />

        <h2>Why it matters</h2>

        <p>
            The function of a heading is to label a section of content. Headings should not be used as a convenient way to style other text.
        </p>

        <p>
            Assistive technologies use markup tags to help users navigate pages and find content more quickly. Screen readers recognize
            coded headings, and can announce each heading along with its level, or provide another audible cue like a beep. Other assistive
            technologies can change the visual display of a page, using properly coded headings to display an outline or alternate view.
        </p>

        <p>
            See <Link.BingoBakery>this fun video</Link.BingoBakery> to learn how landmarks, headings, and tab stops work together to provide
            efficient navigation.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Provide a way for keyboard users to bypass blocks of repeated content. (<Link.WCAG_2_4_1 />)
                </h3>

                <ul>
                    <li>If you use headings to meet this requirement, you must use them correctly.</li>
                </ul>

                <h3>Use headings to label sections of page content. (best practice)</h3>

                <ul>
                    <li>Headings are especially helpful on pages with a lot of text content.</li>
                </ul>

                <h3>
                    Write a heading that accurately describes the block of content that follows it. (<Link.WCAG_2_4_6 />)
                </h3>

                <ul>
                    <li>If a heading doesn't provide an accurate label for the following content, that's a failure.</li>
                </ul>

                <h3>
                    Align programmatic hierarchy and visual hierarchy. (<Link.WCAG_1_3_1 />)
                </h3>

                <ul>
                    <li>Programmatic heading levels should match their visual appearance (like size and boldness).</li>
                </ul>

                <h3>Use exactly one top-level heading. (best practice) </h3>
                <ul>
                    <li>
                        Top-level (<Markup.Code>h1</Markup.Code>) headings should give an overall description of the page content.
                    </li>
                    <li>
                        Top-level (<Markup.Code>h1</Markup.Code>) headings can be similar, or even identical, to the page title.
                    </li>
                </ul>

                <h3>Structure multiple headings on a page hierarchically. (best practice) </h3>
                <ul>
                    <li>
                        For example, try to follow nested content under an <Markup.Code>h2</Markup.Code> heading with{' '}
                        <Markup.Code>h3</Markup.Code> before you use <Markup.Code>h4</Markup.Code>.
                    </li>
                    <li>
                        Exception: For fixed content that repeats across pages (like a footer or a sidebar), the heading level should not
                        change.
                    </li>
                </ul>

                <h3>In that case, consistency across pages is more important. Use native HTML heading elements. (best practice)</h3>
                <ul>
                    <li>
                        Exception: It's OK to add <Markup.Code>role="heading"</Markup.Code> to another element if it's necessary for an
                        accessibility retrofit.
                    </li>
                    <li>
                        The Headings visualization indicates which method is used for each heading:
                        <ul>
                            <li>
                                An uppercase <Markup.Code>H</Markup.Code> indicate headings made using heading tags.
                            </li>
                            <li>
                                A lowercase <Markup.Code>h</Markup.Code> indicates headings made using role="heading".
                            </li>
                            <li>
                                A lowercase <Markup.Code>h</Markup.Code> followed by a dash (<Markup.Code>h-</Markup.Code>) indicates that
                                the element does not have an <Markup.Code>aria-level</Markup.Code> attribute.
                            </li>
                        </ul>
                    </li>
                </ul>
            </Markup.Do>

            <Markup.Dont>
                <h3>
                    Don't use headings to style text that doesn't function as a heading. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>Use styles instead, like font size, bolding, or italics.</li>
                </ul>

                <h3>
                    Don't use styling alone to make text <Markup.Emphasis>look like</Markup.Emphasis> a heading. (<Link.WCAG_1_3_1 />,{' '}
                    <Link.WCAG_2_4_1 />)
                </h3>
                <ul>
                    <li>
                        Assistive technology depends on explicit markup. It does not interpret visual styling to identify structural
                        elements.
                    </li>
                </ul>

                <h3>
                    Don't use <Markup.Code>display:none</Markup.Code>, <Markup.Code>visibility:hidden</Markup.Code> or{' '}
                    <Markup.Code>aria-hidden</Markup.Code> to make headings invisible <Markup.Emphasis>only</Markup.Emphasis> to sighted
                    users. (a11y tech tip)
                </h3>
                <ul>
                    <li>
                        Those properties make headings unavailable to everyone, including assistive technology users. Use this CSS instead:{' '}
                        <Markup.Code>className="element-invisible"</Markup.Code>
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Write descriptive headings</h3>

        <h4>WCAG success Criteria</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html">
            Understanding Success Criterion 2.4.6: Headings and Labels
        </Markup.HyperLink>

        <h4>Sufficient techniques</h4>
        <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/G130.html">Providing descriptive headings</Markup.HyperLink>

        <h3>Convey structure and relationships programmatically</h3>

        <h4>WCAG success Criteria</h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
            Understanding Success Criterion 1.3.1: Info and Relationships
        </Markup.HyperLink>

        <h4>Sufficient techniques</h4>
        <Link.IdentifyHeadings>Using h1 - h6 to identify headings</Link.IdentifyHeadings>
        <br />
        <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/G141.html">Organizing a page using headings</Markup.HyperLink>

        <h4>Common failures</h4>
        <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F2.html">
            Failure of Success Criterion 1.3.1 due to using changes in text presentation to convey information without using the appropriate
            markup or text
        </Markup.HyperLink>
        <br />
        <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F43.html">
            Failure of Success Criterion 1.3.1 due to using structural markup in a way that does not represent relationships in the content
        </Markup.HyperLink>

        <h3>Use headings to bypass blocks</h3>
        <h4>WCAG success Criteria </h4>
        <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html">
            Understanding Success Criterion 2.4.1: Bypass Blocks
        </Markup.HyperLink>

        <h4>Sufficient techniques</h4>
        <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/H69.html">
            Providing heading elements at the beginning of each section of content
        </Markup.HyperLink>
    </>
));
