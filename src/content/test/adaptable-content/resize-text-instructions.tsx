// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const resizeTextInstructions = create(({ Markup }) => (
    <>
        <h2>Setting the screen size for your operating system</h2>
        Please follow the instructions for your operating system:
        <h3>Windows</h3>
        <ul>
            <li>
                Use <Markup.Term>Windows Settings</Markup.Term> {'>'} <Markup.Term>System</Markup.Term> {'>'}{' '}
                <Markup.Term>Display</Markup.Term> {'>'} <Markup.Term>Scale and layout</Markup.Term> to
                <ol>
                    <li>Set the resolution to 1280 pixels wide.</li>
                    <li>Set scaling to 100%.</li>
                </ol>
            </li>
            <li>From the browser, set the target page's zoom to 200%. This will simulate the screen width needed for the test.</li>
        </ul>
        <h3>macOS</h3>
        <ul>
            <li>
                Open the <Markup.Term>System Settings</Markup.Term> app.
            </li>
            <li>
                Open the <Markup.Term>Displays</Markup.Term> tab.
            </li>
            <li>
                Select a <Markup.Term>Use as</Markup.Term> option with a width that is a multiple of 640. If more than one option has a
                width that is a multiple of 640, select the option with the lowest resolution.
            </li>
            <li>
                From the browser, set the target page's zoom to the screen width / 640. For example, if your screen width is 1920, set the
                target page zoom to 300%. Ths will simulate the screen width needed for the test.
            </li>
        </ul>
    </>
));
