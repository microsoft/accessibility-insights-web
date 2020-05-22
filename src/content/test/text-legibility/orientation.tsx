// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const infoAndExamples = create(({ Markup }) => (
    <>
        <p>Web content must not be locked to a particular screen orientation.</p>

        <h2>Why it matters</h2>
        <p>
            Some people with dexterity impairments prefer to use a device mounted in a fixed orientation. Some people with low vision prefer
            to view content in landscape orientation because it allows a larger text size. Not locking the content orientation allows it to
            match the device orientation.
        </p>

        <h2>How to fix</h2>
        <p>
            Do not lock the content orientation unless a specific orientation is{' '}
            <Markup.HyperLink href="https://www.w3.org/TR/WCAG21/#dfn-essential">essential</Markup.HyperLink> to the functionality.
        </p>

        <h2>Example</h2>
        <Markup.PassFail
            failText={
                <p>
                    A banking application uses <Markup.Code>Screen.lockOrientation('landscape')</Markup.Code> to lock all content to a
                    horizontal orientation.
                </p>
            }
            passText={
                <p>
                    The banking application locks the content to a horizontal orientation only when the user is capturing an image of a
                    check to deposit.
                </p>
            }
        />

        <h2>More examples</h2>
        <h3>WCAG success criteria</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://www.w3.org/WAI/WCAG21/Understanding/orientation.html">
                Understanding Success Criterion 1.3.4 Orientation
            </Markup.HyperLink>
        </Markup.Links>

        <h3>Additional guidance</h3>
        <Markup.Links>
            <Markup.HyperLink href="https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Managing_screen_orientation">
                Managing screen orientation
            </Markup.HyperLink>
        </Markup.Links>
    </>
));
