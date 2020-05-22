// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Color must not be used as the only visual means for conveying meaning.</p>

        <h2>Why it matters</h2>
        <p>
            Use of color in web content can enhance aesthetic appeal, usability, and accessibility. However, information conveyed{' '}
            <Markup.Emphasis>only</Markup.Emphasis> through color isn't available to people with limited color vision.
        </p>
        <p>
            Note: This requirement is intended specifically to help people with who have difficulty distinguishing colors. Other
            requirements, related to programmatic access, are intended to help people who are blind or have low vision.
        </p>

        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "No one sees color the same way. Ensure I can understand content, initiate action or, distinguish one visual element from
                another without relying on color alone."
            </Markup.Emphasis>
        </p>

        <h2>How to fix</h2>
        <p>Add text or other visual characteristics to supplement the use of color.</p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={<p>A form indicates a required field by showing its label in a different color (color only).</p>}
            failExample={`CSS
            [.req {color: red;}]

            HTML
            <p> Required fields have <span class="req">red</span> labels.</p>
            <form action="http://www.test.com" method="post">
            <label for="firstname">[<span class="req">First name</span>]: </label>
            <input type="text" name="firstname" id="firstname" />`}
            passText={<p>The form indicates a required field by showing a red asterisk next to its label (color + shape).</p>}
            passExample={`CSS
            [.req {color:red; font-size: 150%}]

            HTML
            <p> Required fields are marked with a red asterisk (<span class="req">*</span>).</p>
            <form action="http://www.test.com" method="post">
            <label for="firstname">[<span class="req">* </span>First name]: </label>
            <input type="text" name="firstname" id="firstname" />`}
        />

        <h2>More examples</h2>

        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html">
                Understanding Success Criterion 1.4.1: Use of Color
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Sufficient techniques</h3>
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

        <h3>Common failures</h3>
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
    </>
));
