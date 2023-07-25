// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NewTabLink } from '../../../common/components/new-tab-link';
import { create, React } from '../../common';

export const keyboardBookmarkletInstructions = create(({ Markup }) => (
    <>
        <Markup.Title>Using a keyboard to add the Nu HTML Checker bookmarklets</Markup.Title>
        <h2>Google Chrome instructions</h2>
        <ol>
            <li>
                Open the Chrome <Markup.Term>Bookmarks</Markup.Term> manager:
                <ol type="a">
                    <li>
                        In Chrome, type <Markup.Term>Ctrl + Shift + o</Markup.Term> or <Markup.Term>⌘ + Option + b</Markup.Term>.
                    </li>
                    <li>
                        A new browser tab called <Markup.Term>Bookmarks</Markup.Term> will open.
                    </li>
                </ol>
            </li>

            <li>
                Add the first bookmarklet (<Markup.Term>Check serialized DOM of current page</Markup.Term>):
                <ol type="a">
                    <li>
                        Open the <Markup.Term>Add bookmark</Markup.Term> dialog:
                        <ol type="i">
                            <li>Navigate to the Organize menu button and activate it.</li>
                            <li>Arrow down to Add new bookmark and activate it. The Add bookmark dialog will open.</li>
                        </ol>
                    </li>

                    <li>
                        Add the bookmarklet's name to the <Markup.Term>Name</Markup.Term> field.
                    </li>

                    <li>
                        Add the bookmarklet's JavaScript code to the <Markup.Term>URL</Markup.Term> field:
                        <ol type="i">
                            <li>
                                Go to{' '}
                                <NewTabLink href="https://validator.w3.org/nu/about.html">
                                    https://validator.w3.org/nu/about.html
                                </NewTabLink>
                                .
                            </li>
                            <li>Navigate to the bookmark link.</li>
                            <li>
                                Open the context menu and select <Markup.Term>Copy link address</Markup.Term>.
                            </li>
                            <li>
                                Return to the <Markup.Term>Add bookmark dialog</Markup.Term> and paste the link address into the{' '}
                                <Markup.Term>URL</Markup.Term> field.
                            </li>
                        </ol>
                    </li>

                    <li>
                        Save the new bookmark.
                        <ol type="i">
                            <li>
                                Navigate to the <Markup.Term>Save</Markup.Term> button and activate it.
                            </li>
                            <li>
                                The bookmarklet will be added to the end of the <Markup.Term>Bookmarks</Markup.Term> bar, and the{' '}
                                <Markup.Term>Add bookmark</Markup.Term> dialog will close.
                            </li>
                        </ol>
                    </li>
                </ol>
            </li>

            <li>
                Repeat steps 2a through 2d to add the second bookmarklet (<Markup.Term>Check for WCAG 2.0 parsing compliance</Markup.Term>).
            </li>

            <li>
                Close the <Markup.Term>Bookmarks</Markup.Term> tab.
            </li>
        </ol>

        <h2>Microsoft Edge instructions</h2>
        <ol>
            <li>
                Open the Microsoft Edge <Markup.Term>Favorites</Markup.Term> manager:
                <ol type="a">
                    <li>
                        In Microsoft Edge, type <Markup.Term>Ctrl + Shift + o</Markup.Term>.
                    </li>
                    <li>
                        A new browser tab called <Markup.Term>Favorites</Markup.Term> will open.
                    </li>
                </ol>
            </li>

            <li>
                Add the first bookmarklet (<Markup.Term>Check serialized DOM of current page</Markup.Term>):
                <ol type="a">
                    <li>
                        Open the <Markup.Term>Add favorite</Markup.Term> dialog:
                        <ol type="i">
                            <li>Navigate to the Add Favorite button and activate it.</li>
                            <li>The Add favorite dialog will open.</li>
                        </ol>
                    </li>

                    <li>
                        Add the bookmarklet's name to the <Markup.Term>Name</Markup.Term> field.
                    </li>

                    <li>
                        Add the bookmarklet's JavaScript code to the <Markup.Term>URL</Markup.Term> field:
                        <ol type="i">
                            <li>
                                Go to{' '}
                                <NewTabLink href="https://validator.w3.org/nu/about.html">
                                    https://validator.w3.org/nu/about.html
                                </NewTabLink>
                                .
                            </li>
                            <li>Navigate to the bookmark link.</li>
                            <li>
                                Open the context menu and select <Markup.Term>Copy link</Markup.Term>.
                            </li>
                            <li>
                                Return to the <Markup.Term>Add favorite dialog</Markup.Term> and paste the link address into the{' '}
                                <Markup.Term>URL</Markup.Term> field.
                            </li>
                        </ol>
                    </li>

                    <li>
                        Save the new favorite.
                        <ol type="i">
                            <li>
                                Navigate to the <Markup.Term>Save</Markup.Term> button and activate it.
                            </li>
                            <li>
                                The bookmarklet will be added to the end of the <Markup.Term>Favorites</Markup.Term> bar, and the{' '}
                                <Markup.Term>Add favorite</Markup.Term> dialog will close.
                            </li>
                        </ol>
                    </li>
                </ol>
            </li>

            <li>
                Repeat steps 2a through 2d to add the second bookmarklet (<Markup.Term>Check for WCAG 2.0 parsing compliance</Markup.Term>).
            </li>

            <li>
                Close the <Markup.Term>Favorites</Markup.Term> tab.
            </li>
        </ol>
    </>
));
