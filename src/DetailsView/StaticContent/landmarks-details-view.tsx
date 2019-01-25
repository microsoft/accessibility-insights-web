// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';

import { NewTabLink } from '../../common/components/new-tab-link';

import { toolName } from '../../content/strings/application';

export const landmarksContent: JSX.Element = (
    <div>
        <h2>Why landmarks matter</h2>

        <div className="why-vis">
            ARIA landmark roles help users identify a web page's structure and organization. Classifying and labeling a page's sections
            takes structural information that is conveyed visually and represents it programmatically. Screen readers and other assistive
            technologies, like browser extensions, can use this information into enable or enhance navigation.
        </div>

        <div className="more-info">
            For more information about how to use ARIA landmarks, see&nbsp;
            <NewTabLink href="https://www.w3.org/TR/wai-aria-practices-1.1/#aria_landmark">
                WAI-ARIA Authoring Practices 1.1: Landmark Regions
            </NewTabLink>
            .
        </div>

        <h2>About the Landmarks visualization</h2>

        <div className="about-vis">
            The visualizations in {toolName} enable developers to see accessibility markup that’s normally invisible. The <b>Landmarks</b>{' '}
            visualization highlights landmarks directly on the page. It does not highlight landmarks that are unavailable to assistive
            technology because they have the <b>hidden</b> attribute.
        </div>

        <h2>Do</h2>

        <h3>Contain all visible content within the landmark areas.</h3>

        <ul className="insights-list">
            <li>
                Turn on the <b>Landmarks</b> visualization, then zoom out so you can see the entire page. If you see any visible content
                (like text, images, or controls) outside the dashed borders, that’s a failure.
            </li>
        </ul>

        <h3>Provide exactly one main landmark in every page.</h3>

        <ul className="insights-list">
            <li>
                Exception: If the page contains nested document or application roles, each one can have its own <b>banner</b>, <b>main</b>{' '}
                and <b>contentinfo</b> landmarks.
            </li>
        </ul>

        <h3>Choose the landmark role that best describes the area’s content.</h3>

        <ul className="insights-list">
            <li>In the visualization, each landmark role has a unique color, and the role is displayed in its tag.</li>
        </ul>

        <ul className="landmark-roles-table">
            <li>
                <span className="landmarks-legend banner-landmark">banner</span>
                <span className="landmarks-legend-description">An area at the beginning of the page containing site-oriented content</span>
            </li>
            <li>
                <span className="landmarks-legend complementary-landmark">complementary</span>
                <span className="landmarks-legend-description">
                    An area of the page that supports the main content, yet remains meaningful on its own
                </span>
            </li>
            <li>
                <span className="landmarks-legend contentinfo-landmark">contentinfo</span>
                <span className="landmarks-legend-description">
                    An area at the end of the page containing info about the main content or website
                </span>
            </li>
            <li>
                <span className="landmarks-legend form-landmark">form</span>
                <span className="landmarks-legend-description">An area of the page containing a collection of form-related elements</span>
            </li>
            <li>
                <span className="landmarks-legend main-landmark">main</span>
                <span className="landmarks-legend-description">The area containing the page's primary content</span>
            </li>
            <li>
                <span className="landmarks-legend navigation-landmark">navigation</span>
                <span className="landmarks-legend-description">
                    An area of the page containing a group of links for website or page navigation
                </span>
            </li>
            <li>
                <span className="landmarks-legend region-landmark">region</span>
                <span className="landmarks-legend-description">
                    An area of the page containing information that is sufficiently important that users should be able to navigate to it
                </span>
            </li>
            <li>
                <span className="landmarks-legend search-landmark">search</span>
                <span className="landmarks-legend-description">An area of the page containing search functionality</span>
            </li>
        </ul>

        <h3>If you use the same landmark role more than once in a page, give each instance an accessible label that makes it unique.</h3>

        <ul className="insights-list ">
            <li>
                In the visualization, accessible labels (<b>aria-label</b> or <b>aria-labelledby</b>) are enclosed in quotes.
            </li>
            <li>There’s an automated check for non-unique landmarks.</li>
            <li>
                Exception: If the page has two or more navigation landmarks that contain the same set of links, those landmarks should have
                the same label.
            </li>
        </ul>

        <h3>Provide a descriptive label for any region landmarks.</h3>

        <ul className="insights-list ">
            <li>Regions allow you to create custom landmarks when the standard roles don’t accurately describe your content.</li>
        </ul>

        <h3>Provide a visible label for any form landmarks.</h3>

        <ul className="insights-list ">
            <li>
                Use <b>aria-labelledby</b> to programmatically associate the visible label with the landmark.
            </li>
        </ul>

        <h2>Don't</h2>

        <h3>Don’t use too many landmarks.</h3>

        <ul className="insights-list ">
            <li>
                Five to seven landmarks in a page is ideal. More than that makes it difficult for users to efficiently navigate the page.
            </li>
        </ul>

        <h3>Don’t repeat the landmark’s role in its label.</h3>

        <ul className="insights-list ">
            <li>In the visualization, the label displayed for each landmark approximates how most screen readers would announce it.</li>
        </ul>
    </div>
);
