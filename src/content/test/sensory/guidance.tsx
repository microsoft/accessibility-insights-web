// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Sensory'} />
        <h2>Why it matters</h2>
        <p>
            When color, shape, location, audio, or other sensory characteristics are the <Markup.Emphasis>only</Markup.Emphasis> means used
            to convey information, people with disabilities do not have access to the same information that others have.
        </p>
        <p>
            Meaning communicated through sensory characteristics must <Markup.Emphasis>also</Markup.Emphasis> be available in a textual
            format that can be viewed by all users and read by screen reader software.
        </p>
        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Feel free to use color <Markup.Emphasis>redundantly</Markup.Emphasis> to convey information.{' '}
                </h3>
                <ul>
                    <li>Color can be a powerful method for communicating things like function, category, or status.</li>
                </ul>
                <h3>
                    Feel free to use audio cues <Markup.Emphasis>redundantly</Markup.Emphasis> to convey information.
                </h3>
                <ul>
                    <li>Audio cues can draw the user's attention to important events or state changes.</li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don’t use color as the only visual means of conveying information. (<Link.WCAG_1_4_1 />)
                </h3>
                <ul>
                    <li>Combine color with other visual aspects, such as shape, color, size symbols, or text.</li>
                </ul>
                <h3>
                    Don't offer instructions that rely solely on color or other sensory characteristics to identify user interface
                    components. (<Link.WCAG_1_3_3 />)
                </h3>
                <ul>
                    <li>Sensory characteristics include color, shape, size, visual location, orientation, and sound.</li>
                    <li>
                        Incorporating text is the best way to ensure your instructions don't rely on sensory characteristics.
                        <ul>
                            <li>
                                <Markup.Term>Bad</Markup.Term>: To submit the form, press the green button.
                            </li>
                            <li>
                                <Markup.Term>Good</Markup.Term>: To submit the form, press the green 'Go' button.
                            </li>
                            <li>
                                <Markup.Term>Bad</Markup.Term>: To view course descriptions, use the links to the right.
                            </li>
                            <li>
                                <Markup.Term>Good</Markup.Term>: To view course descriptions, use the 'Available courses' links to the
                                right.
                            </li>
                        </ul>
                    </li>
                </ul>
                <h3>
                    Don't use audio as the only means of conveying information. (<Link.WCAG_1_1_1 />)
                </h3>
                <ul>
                    <li>Convey the same information visually, such as through text or icons.</li>
                </ul>
                <h3>
                    Don't show content that flashes more than three times per second. (<Link.WCAG_2_3_1 />)
                </h3>
                <ul>
                    <li>
                        Content that flashes at certain frequencies can trigger seizures in people with photosensitive seizure disorders.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Avoid using color alone</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html">
                Understanding Success Criterion 1.4.1: Use of Color
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G14">
                Ensuring that information conveyed by color differences is also available in text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G205">
                Including a text cue whenever color cues are used
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G182">
                Ensuring that additional visual cues are available when text color differences are used to convey information
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G183">
                Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on focus for links or controls
                where color alone is used to identify them
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G111">Using color and pattern</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G14">
                Ensuring that information conveyed by color differences is also available in text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/css/C15">
                Using CSS to change the presentation of a user interface component when it receives focus
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F13">
                Failure due to having a text alternative that does not include information that is conveyed by color in the image
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F73">
                Failure of Success Criterion 1.4.1 due to creating links that are not visually evident without color vision
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F81">
                Failure of 1.4.1 due to identifying required or error fields using color differences only
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Avoid using sensory characteristics alone</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/sensory-characteristics.html">
                Understanding Success Criterion 1.3.3: Sensory Characteristics
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/G96.html">
                Providing textual identification of items that otherwise rely only on sensory information to be understood
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F14.html">
                Failure of Success Criterion 1.3.3 due to identifying content only by its shape or location
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG20-TECHS/F26.html">
                Failure of Success Criterion 1.3.3 due to using a graphical symbol alone to convey information
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Ensure flashing content is safe</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/three-flashes-or-below-threshold.html">
                Understanding Success Criterion 2.3.1: Three Flashes or Below Threshold
            </Markup.HyperLink>
        </Markup.Links>

        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G19">
                Ensuring that no component of the content flashes more than three times in any 1-second period.
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
