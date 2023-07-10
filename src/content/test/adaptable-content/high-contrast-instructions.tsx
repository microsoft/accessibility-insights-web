// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../../common';

export const highContrastInstructions = create(({ Markup }) => (
    <>
        <h2>Applying a high contrast theme</h2>
        Please follow the instructions for your operating system:
        <h3>Windows 10</h3>
        <ul>
            <li>
                Use <Markup.Term>Windows Settings</Markup.Term> {'>'} <Markup.Term>Ease of Access</Markup.Term> {'>'}{' '}
                <Markup.Term>High contrast</Markup.Term> to apply a high contrast theme.
            </li>
        </ul>
        <h3>Windows 11</h3>
        <ul>
            <li>
                Use <Markup.Term>Windows Settings</Markup.Term> {'>'} <Markup.Term>Accessibility</Markup.Term> {'>'}{' '}
                <Markup.Term>Contrast themes</Markup.Term> to apply a high contrast theme.
            </li>
        </ul>
        <h3>macOS</h3>
        <ul>
            <li>High contrast modes are not applied in the browser on macOS.</li>
        </ul>
    </>
));
