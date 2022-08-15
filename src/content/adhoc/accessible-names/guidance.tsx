// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Accessible names'} />

        <h2>Why Accessible names matter</h2>

        <p>
            The Accessible name is a short label that provides information about the purpose of a user interface element. Without it, people
            that use Assistive Technologies (AT) would have difficulty understanding the purpose of an element and interacting with it.
        </p>
        <p>
            For more information about Accessible names and their computation, please check out <Link.accessileNameComputation />.
        </p>

        <h2>About Accessible names visualization</h2>

        <p>
            The visualization in Accessibility Insights for Web enable developers to see accessibility markup that’s normally invisible. The{' '}
            <Markup.Term>Accessible names</Markup.Term> visualization highlights elements that have accessible names and, when possible,
            shows the accessible name. It does not highlight elements with empty, or no accessible names.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>
                    If a widget has visible label, make sure they are programmatically related to it.{' '}
                    <Link.WCAG21UnderstandingInfoAndRelationships /> <Link.WCAG21UnderstandingLabelInName />
                </h3>

                <ul>
                    <li>A widget's visible label should be included in its accessible name.</li>
                </ul>
                <h3>
                    Use the widget's accessible name and/or accessible description to identify the expected input.{' '}
                    <Link.WCAG21UnderstandingLabelsOrInstructions />
                </h3>

                <ul>
                    <li>
                        For example, a button should indicate what action it will initiate. A text field should indicate what type of data
                        is expected and whether a specific format is required.
                    </li>
                </ul>
            </Markup.Do>
        </Markup.Columns>
    </React.Fragment>
));
