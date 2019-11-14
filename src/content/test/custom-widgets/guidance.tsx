// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <>
        <GuidanceTitle name={'Custom widgets'} />

        <h2>Why it matters</h2>
        <p>
            Many accessibility issues can be avoided simply by selecting the
            right native HTML widgets and implementing them to spec. If native
            widgets have (1) accurate programmatically-related labels and
            instructions and (2) appropriate autocomplete attributes, browsers
            will do most of the remaining work needed to make them accessible,
            including keyboard interaction, state changes, and visual styling.
        </p>
        <p>
            Serious accessibility problems are most likely to arise when a
            native widget is coded in a way that changes its function. For
            example, a button, a text field, and a listbox might be programmed
            to function together as a combo box. A combo box is a custom widget,
            and for it to be accessible, it must follow the{' '}
            <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">
                ARIA design Pattern
            </Markup.HyperLink>{' '}
            for combo boxes. The ARIA design patterns specify (1) required
            roles, states, and properties and (2) expected keyboard interaction.
            Custom widgets typically require significant coding to meet these
            requirements.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    Use the right ARIA widget role for your custom widget. (
                    <Link.WCAG_4_1_2 />)
                </h3>
                <ul>
                    <li>
                        Familiarize yourself with the{' '}
                        <Markup.HyperLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_ex">
                            ARIA design Pattern
                        </Markup.HyperLink>{' '}
                        for custom widgets.
                    </li>
                    <li>
                        Determine which design pattern your widget should
                        follow.
                    </li>
                    <li>
                        Add the correct widget role. (Some complex widgets
                        require more than one role.)
                    </li>
                </ul>

                <h3>
                    If a widget has visible instructions, make sure they are
                    programmatically related to it. (<Link.WCAG_1_3_1 />,{' '}
                    <Link.WCAG_2_5_3 />)
                </h3>
                <ul>
                    <li>
                        A widget's visible label should be included in its
                        accessible name.
                    </li>
                    <li>
                        Any additional instructions that are visible should be
                        included in the widget's accessible description.
                    </li>
                </ul>

                <h3>
                    Use the widget's accessible name or accessible description
                    to identify the expected input. (<Link.WCAG_3_3_2 />)
                </h3>
                <ul>
                    <li>
                        For example, a button should indicate what action it
                        will initiate. A text field should indicate what type of
                        data is expected and whether a specific format is
                        required.
                    </li>
                </ul>

                <h3>
                    Use the roles, states, and properties specified by the ARIA
                    design patterns. (<Link.WCAG_4_1_2 />)
                </h3>

                <h3>
                    Provide appropriate cues when a widget is disabled,
                    read-only, or required. (<Link.WCAG_1_3_1 />,{' '}
                    <Link.WCAG_4_1_2 />)
                </h3>

                <h3>
                    Support the keyboard interactions specified by the ARIA
                    design patterns. (<Link.WCAG_2_1_1 />)
                </h3>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't rely on a widget's visual characteristics to
                    communicate information to users. (<Link.WCAG_1_3_1 />)
                </h3>
                <ul>
                    <li>
                        State information communicated visually (for example,
                        graying out a disabled widget) must also be communicated
                        programmatically (for example, by adding the
                        aria-disabled attribute).
                    </li>
                </ul>
                <h3>
                    Don’t use a custom widget when a native widget will do.
                    (best practice)
                </h3>
                <ul>
                    <li>
                        • As a rule, it's better to use native semantics than to
                        modify them using ARIA roles.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>

        <h2>Learn more</h2>
        <h3>Use the right ARIA role</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html">
                Understanding Success Criterion 4.1.2: Name, Role, Value
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface
                component
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F59">
                Failure of Success Criterion 4.1.2 due to using script to make
                div or span a user interface control in HTML without providing a
                role for the control
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>

        <h3>Make sure labels and instructions are programmatically related</h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/label-in-name.html">
                Understanding 2.5.3 Label in Name
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html">
                Understanding Success Criterion 1.3.1: Info and Relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G208">
                Ensure the "accessible name" includes the visible text
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H91">
                Using HTML form controls and links
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H44">
                Using label elements to associate text labels with form controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA14">
                Using aria-label to provide an invisible label where a visible
                label cannot be used
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA16">
                Using aria-labelledby to provide a name for user interface
                controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H65">
                Using the title attribute to identify form controls when the
                label element cannot be used
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H71">
                Providing a description for groups of form controls using
                fieldset and legend elements
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F96">
                Failure due to "accessible name" not containing the visible
                label text
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G162">
                Positioning labels to maximize predictability of relationships
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA1">
                Using the aria-describedby property to provide a descriptive
                label for user interface controls
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G131">
                Providing descriptive labels
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA1">
                Using the aria-describedby property to provide a descriptive
                label for user interface controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA9">
                Using aria-labelledby to concatenate a label from several text
                nodes
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA17">
                Using grouping roles to identify related form controls
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G89">
                Providing expected data format and example
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G184">
                Providing text instructions at the beginning of a form or set of
                fields that describes the necessary input
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G162">
                Positioning labels to maximize predictability of relationships
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F82">
                Failure of Success Criterion 3.3.2 by visually formatting a set
                of phone number fields but not including a text label
            </Markup.HyperLink>
        </Markup.Links>

        <h3>
            Use the roles, states, and properties specified by the ARIA design
            patterns
        </h3>
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA4">
                Using a WAI-ARIA role to expose the role of a user interface
                component
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA5">
                Using WAI-ARIA state and property attributes to expose the state
                of a user interface component
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F59">
                Failure of Success Criterion 4.1.2 due to using script to make
                div or span a user interface control in HTML without providing a
                role for the control
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F15">
                Failure of Success Criterion 4.1.2 due to implementing custom
                controls that do not use an accessibility API for the
                technology, or do so incompletely
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F79">
                Failure of Success Criterion 4.1.2 due to the focus state of a
                user interface component not being programmatically determinable
                or no notification of change of focus state available
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
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
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G83">
                Providing text descriptions to identify required fields that
                were not completed
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/html/H90">
                Indicating required form controls using label or legend
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G138">
                Using semantic markup whenever color cues are used
            </Markup.HyperLink>
        </Markup.Links>

        <h3>
            Support the keyboard interactions specified by the ARIA design
            patterns
        </h3>
        <h4>WCAG success criteria</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/keyboard.html">
                Understanding Success Criterion 2.1.1: Keyboard
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Sufficient techniques</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G202">
                Ensuring keyboard control for all functionality
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/general/G90">
                Providing keyboard-triggered event handlers
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR20">
                Using both keyboard and other device-specific functions
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR35">
                Making actions keyboard accessible by using the onclick event of
                anchors and buttons
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/client-side-script/SCR2">
                Using redundant keyboard and mouse event handlers
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Common failures</h4>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F54">
                Failure of Success Criterion 2.1.1 due to using only
                pointing-device-specific event handlers (including gesture) for
                a function
            </Markup.HyperLink>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F42">
                Failure of Success Criteria 1.3.1, 2.1.1, 2.1.3, or 4.1.2 when
                emulating links
            </Markup.HyperLink>
        </Markup.Links>
        <h4>Additional guidance</h4>
        <Markup.Links>
            <Link.WAIARIAAuthoringPractices />
        </Markup.Links>
    </>
));
