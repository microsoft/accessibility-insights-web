// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Native widgets'} />

        <h2>Why it matters</h2>
        <p>
            Many accessibility issues can be avoided simply by selecting the right native HTML widgets and implementing them to spec. If you
            provide good labels and instructions for your native widgets, browsers will do most of the work needed to make them accessible,
            including keyboard interaction, state changes, and visual styling.
        </p>
        <p>
            Serious accessibility problems are most likely to arise when a native widget is coded in a way that changes its function. For
            example, a button, a text field, and a listbox might be programmed to function together as a combo box. A combo box is a custom
            widget, and for it to be accessible, it must follow the{' '}
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">ARIA design Pattern</Markup.HyperLink> for combo
            boxes. The ARIA design patterns specify (1) required roles, states, and properties and (2) expected keyboard interaction. Custom
            widgets typically require significant coding to meet these requirements.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    If a native widget functions as a custom widget, give it the appropriate ARIA widget role. (<Link.WCAG_4_1_2 />)
                </h3>
                <ul>
                    <li>
                        Familiarize yourself with the{' '}
                        <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">
                            ARIA design Pattern
                        </Markup.HyperLink>{' '}
                        for custom widgets.
                    </li>
                    <li>Determine which design pattern your widget should follow.</li>
                    <li>Add the correct widget role. (Some complex widgets require more than one role.)</li>
                </ul>
                <h3>
                    If a widget has visible instructions, make sure they are programmatically related to it. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>All of a widget's visible instructions must be included in its accessible name or accessible description.</li>
                </ul>
                <h3>
                    Make sure the widget's accessible name or accessible description identifies the expected input. (<Link.WCAG_3_3_2 />)
                </h3>
                <ul>
                    <li>
                         For example, a button should indicate what action it will initiate. A text field should indicate what type of data
                        is expected and whether a specific format is required.
                    </li>
                </ul>
                <h3>
                    Make sure the widget provides the appropriate cues if it is disabled, read-only, or required. (<Link.WCAG_1_3_1 /> ,{' '}
                    <Link.WCAG_4_1_2 />)
                </h3>
                <ul>
                    <li>Use HTML5 attributes for indicating these states.</li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't rely on a widget's visual characteristics to communicate information to users. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>Information communicated visually must also be communicated programmatically.</li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>

        <h3>Provide the right ARIA role</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface component
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>

        <h3>Make sure instructions are programmatically related</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H91">Using HTML form controls and links</Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H44">
                Using label elements to associate text labels with form controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14">
                Using aria-label to provide an invisible label where a visible label cannot be used
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16">
                Using aria-labelledby to provide a name for user interface controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H65">
                Using the title attribute to identify form controls when the label element cannot be used
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H71">
                Providing a description for groups of form controls using fieldset and legend elements
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G162">
                Positioning labels to maximize predictability of relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA1">
                Using the aria-describedby property to provide a descriptive label for user interface controls
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Identify the expected input</h3>
        <h4>WCAG success criteria</h4>
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
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F82">
                Failure of Success Criterion 3.3.2 by visually formatting a set of phone number fields but not including a text label
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Provide appropriate cues</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Link.WCAG21TechniquesG83 />
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H90">
                Indicating required form controls using label or legend
            </Markup.HyperLink>
            <Link.WCAG21TechniquesG138 />
        </Markup.Links>
    </>
));
