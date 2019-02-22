// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create } from '../../common';

export const howToTest = create(({ Markup }) => (
    <>
        <h2>How to test</h2>
        <ol>
            <li>Refresh the target page to put it in its default state.</li>
            <li>Turn on the Show tab stops toggle. An empty circle will highlight the current tab stop.</li>
            <li>Press the Tab key to move input focus through all the interactive elements in the page.</li>
            <li>
                As you tab to each element, look for these <Markup.Term>accessibility problems</Markup.Term>:
                <ul>
                    <li>An interactive element can't be reached using the Tab key.</li>
                    <li>An interactive element "traps" input focus and prevents tabbing away.</li>
                    <li>An interactive element doesn't give a visible indication when it has input focus.</li>
                    <li>The tab order is inconsistent with the logical order that's communicated visually.</li>
                    <li>Input focus moves unexpectedly without the user initiating it.</li>
                </ul>
            </li>
        </ol>
    </>
));
