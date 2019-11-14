// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';
import { toolName } from '../../strings/application';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Landmarks'} />
        <h2>Why landmarks matter</h2>

        <p>
            ARIA landmark roles help users identify a web page's structure and
            organization. Classifying and labeling a page's sections takes
            structural information that is conveyed visually and represents it
            programmatically. Screen readers and other assistive technologies,
            like browser extensions, can use this information into enable or
            enhance navigation.
        </p>

        <p>
            For more information about how to use ARIA landmarks, see&nbsp;
            <Link.LandmarkRegions />.
        </p>

        <h2>About the Landmarks visualization</h2>

        <p>
            The visualizations in {toolName} enable developers to see
            accessibility markup that’s normally invisible. The{' '}
            <Markup.Term>Landmarks</Markup.Term> visualization highlights
            landmarks directly on the page. It does not highlight landmarks that
            are unavailable to assistive technology because they have the{' '}
            <Markup.Term>hidden</Markup.Term> attribute.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>Contain all visible content within the landmark areas.</h3>

                <ul>
                    <li>
                        Turn on the <Markup.Term>Landmarks</Markup.Term>{' '}
                        visualization, then zoom out so you can see the entire
                        page. If you see any visible content (like text, images,
                        or controls) outside the dashed borders, that’s a
                        failure.
                    </li>
                </ul>

                <h3>Provide exactly one main landmark in every page.</h3>

                <ul>
                    <li>
                        Exception: If the page contains nested document or
                        application roles, each one can have its own{' '}
                        <Markup.Term>banner</Markup.Term>,{' '}
                        <Markup.Term>main</Markup.Term> and{' '}
                        <Markup.Term>contentinfo</Markup.Term>
                        landmarks.
                    </li>
                </ul>

                <h3>
                    Choose the landmark role that best describes the area’s
                    content.
                </h3>

                <ul>
                    <li>
                        In the visualization, each landmark role has a unique
                        color, and the role is displayed in its tag.
                    </li>
                </ul>

                <Markup.Table>
                    <li>
                        <Markup.LandmarkLegend role="banner">
                            banner
                        </Markup.LandmarkLegend>
                        An area at the beginning of the page containing
                        site-oriented content
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="complementary">
                            complementary
                        </Markup.LandmarkLegend>
                        An area of the page that supports the main content, yet
                        remains meaningful on its own
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="contentinfo">
                            contentinfo
                        </Markup.LandmarkLegend>
                        An area at the end of the page containing info about the
                        main content or website
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="form">
                            form
                        </Markup.LandmarkLegend>
                        An area of the page containing a collection of
                        form-related elements
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="main">
                            main
                        </Markup.LandmarkLegend>
                        The area containing the page's primary content
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="navigation">
                            navigation
                        </Markup.LandmarkLegend>
                        An area of the page containing a group of links for
                        website or page navigation
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="region">
                            region
                        </Markup.LandmarkLegend>
                        An area of the page containing information that is
                        sufficiently important that users should be able to
                        navigate to it
                    </li>
                    <li>
                        <Markup.LandmarkLegend role="search">
                            search
                        </Markup.LandmarkLegend>
                        An area of the page containing search functionality
                    </li>
                </Markup.Table>

                <h3>
                    If you use the same landmark role more than once in a page,
                    give each instance an accessible label that makes it unique.
                </h3>

                <ul>
                    <li>
                        In the visualization, accessible labels (
                        <Markup.Term>aria-label</Markup.Term> or{' '}
                        <Markup.Term>aria-labelledby</Markup.Term>) are enclosed
                        in quotes.
                    </li>
                    <li>
                        There’s an automated check for non-unique landmarks.
                    </li>
                    <li>
                        Exception: If the page has two or more navigation
                        landmarks that contain the same set of links, those
                        landmarks should have the same label.
                    </li>
                </ul>

                <h3>Provide a descriptive label for any region landmarks.</h3>

                <ul>
                    <li>
                        Regions allow you to create custom landmarks when the
                        standard roles don’t accurately describe your content.
                    </li>
                </ul>

                <h3>Provide a visible label for any form landmarks.</h3>

                <ul>
                    <li>
                        Use <Markup.Term>aria-labelledby</Markup.Term> to
                        programmatically associate the visible label with the
                        landmark.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>Don’t use too many landmarks.</h3>

                <ul>
                    <li>
                        Five to seven landmarks in a page is ideal. More than
                        that makes it difficult for users to efficiently
                        navigate the page.
                    </li>
                </ul>

                <h3>Don’t repeat the landmark’s role in its label.</h3>

                <ul>
                    <li>
                        In the visualization, the label displayed for each
                        landmark approximates how most screen readers would
                        announce it.
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>
    </React.Fragment>
));
