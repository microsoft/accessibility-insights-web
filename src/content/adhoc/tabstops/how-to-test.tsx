// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { HeadingElementForLevel, HeadingLevel } from 'common/components/heading-element-for-level';
import { create, React } from '../../common';

export const createHowToTest = (headingLevel: number) => {
    return create(({ Markup }) => (
        <>
            <p>
                <Markup.Emphasis>
                    Note: this test requires you to use a keyboard and to visually identify interactive elements.
                </Markup.Emphasis>
            </p>
            <HeadingElementForLevel headingLevel={headingLevel as HeadingLevel}>How to test</HeadingElementForLevel>
            <ol>
                <li>Refresh the target page to put it in its default state.</li>
                <li>Turn on the Show tab stops toggle. An empty circle will highlight the element with focus.</li>
                <li>
                    Use your keyboard to move input focus through all the interactive elements in the page:
                    <ul>
                        <li>Use Tab and Shift+Tab to navigate between standalone controls.</li>
                        <li>Use the arrow keys to navigate between the focusable elements within a composite control.</li>
                    </ul>
                </li>
                <li>
                    As you navigate to each element, look for these <Markup.Term>accessibility problems</Markup.Term>:
                    <ul>
                        <li>An interactive element can't be reached using the Tab and arrow keys.</li>
                        <li>An interactive element "traps" input focus and prevents navigating away.</li>
                        <li>An interactive element doesn't give a visible indication when it has input focus.</li>
                        <li>The tab order is inconsistent with the logical order that's communicated visually.</li>
                        <li>Input focus moves unexpectedly without the user initiating it.</li>
                    </ul>
                </li>
            </ol>
        </>
    ));
};
