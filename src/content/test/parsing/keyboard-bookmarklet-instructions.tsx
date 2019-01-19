// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { React, create, GuidanceTitle } from '../../common';
import { NewTabLink } from '../../../common/components/new-tab-link';

export const keyboardBookmarkletInstructions = create(({ Markup, Link }) => <>
    <Markup.Title>Using a keyboard to add the Nu HTML Checker bookmarklets to Chrome</Markup.Title>
    <ol>
        <li>Open the Chrome <Markup.Term>Bookmarks Manager</Markup.Term>:</li>
        <ol type="a">
            <li>In Chrome, type <Markup.Term>Ctrl + Shift + o.</Markup.Term></li>
            <li>A new browser tab called <Markup.Term>Bookmarks</Markup.Term> will open.</li>
        </ol>

        <li>Add the first bookmarklet (<Markup.Term>Check serialized DOM of current page</Markup.Term>):</li>
        <ol type="a">
            <li>Open the <Markup.Term>Add bookmark</Markup.Term> dialog:</li>
            <ol type="i">
                <li>Navigate to the Organize menu button and activate it.</li>
                <li>Arrow down to Add new bookmark and activate it. The Add bookmark dialog will open.</li>
            </ol>

            <li>Add the bookmarklet's name to the <Markup.Term>Name</Markup.Term> field.</li>

            <li>Add the bookmarklet's JavaScript code to the <Markup.Term>URL</Markup.Term> field:</li>
            <ol type="i">
                <li>Go
                    to <NewTabLink href="https://validator.w3.org/nu/about.html">https://validator.w3.org/nu/about.html</NewTabLink>.</li>
                <li>Navigate to the bookmark link.</li>
                <li>Open the context menu and select <Markup.Term>Copy link address</Markup.Term>.</li>
                <li>Return to the <Markup.Term>Add bookmark dialog</Markup.Term> and paste the
                link address into the <Markup.Term>URL</Markup.Term> field.</li>
            </ol>

            <li>Save the new bookmark.</li>
            <ul>
                <li>Navigate to the <Markup.Term>Save</Markup.Term> button and activate it.
                The bookmarklet will be added to the end of the <Markup.Term>Bookmarks</Markup.Term> bar,
                and the <Markup.Term>Add bookmark</Markup.Term> dialog will close.</li>
            </ul>

            <li>Repeat steps 2a through 2d to add the second bookmarklet
                (<Markup.Term>Check for WCAG 2.0 parsing compliance</Markup.Term>).</li>

            <li>Close the <Markup.Term>Bookmarks Manager</Markup.Term> tab.</li>
        </ol>
    </ol>
</>);
