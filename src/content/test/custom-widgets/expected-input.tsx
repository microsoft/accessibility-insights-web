// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup, Link }) => (
    <>
        <p>A custom widget must have a label and/or instructions that identify the expected input.</p>
        <h2>Why it matters</h2>
        <p>When a widget clearly communicates its expected input, all users are likely to make fewer input mistakes.</p>
        <h3>From a user's perspective</h3>
        <p>
            <Markup.Emphasis>
                "I do not rely on visual cues for reading, I use a screen reader. For any required input you need from me, provide me with
                general instructions on what is being asked, what is required and, examples of valid input so I can provide the requested
                information."
            </Markup.Emphasis>
        </p>
        <p>
            <Link.FormLabelsVideo>This video</Link.FormLabelsVideo> explains how screen reader users are impacted when the label and the
            form element are not programmatically related, which makes it difficult for the user to know what information they should input.
        </p>

        <h2>How to fix</h2>
        <p>
            Make sure the widget's accessible name and/or accessible description communicates the expected input. For example, a button
            should indicate what action it will initiate. A text field should indicate what type of data is expected and whether a specific
            format is required.
        </p>
        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    The label for this combo box does not clearly communicate that users are expected to enter an abbreviation for their
                    state.
                </p>
            }
            failExample={`<label for="where-input" id="where-label" class="combobox-label">[Location]</label>
            <div role="combobox" aria-expanded="false" aria-owns="where-listbox" aria-haspopup="listbox" id="where-combobox">
            <input type="text" aria-autocomplete="list" aria-controls="where-listbox" id="where-input">
            </div>`}
            passText={
                <p>
                    An accessible description has been created using <Markup.Code>aria-describedby</Markup.Code>. The description clarifies
                    the expected input.
                </p>
            }
            passExample={`<label for="where-input" id="where-label" class="combobox-label">[Location]</label>
            [<p id="where-desc">Enter the 2-letter abbreviation for your state.</p>]
            <div role="combobox" aria-expanded="false" aria-owns="where-listbox" aria-haspopup="listbox" id="where-combobox">
            <input type="text" aria-autocomplete="list" aria-controls="ex1-listbox" id="where-input" [aria-describedby="where-desc"]>
            </div>`}
        />
        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/labels-or-instructions.html">
                Understanding Success Criterion 3.3.2: Labels or Instructions
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Link.WCAG21TechniquesG131 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA1">
                Using the aria-describedby property to provide a descriptive label for user interface controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA9">
                Using aria-labelledby to concatenate a label from several text nodes
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA17">
                Using grouping roles to identify related form controls
            </Markup.HyperLink>
            <Link.WCAG21TechniquesG89 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G184">
                Providing text instructions at the beginning of a form or set of fields that describes the necessary input
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G162">
                Positioning labels to maximize predictability of relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h3>Common failures</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F82">
                Failure of Success Criterion 3.3.2 by visually formatting a set of phone number fields but not including a text label
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
