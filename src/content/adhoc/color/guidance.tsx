// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';

export const guidance = create(({ Markup, Link }) => (
    <React.Fragment>
        <GuidanceTitle name={'Color'} />

        <h2>Why color matters</h2>

        <p>
            When color is the only visual means of conveying meaning (such as
            communicating information, indicating an action, prompting a
            response, or distinguishing a visible element), that meaning is not
            available to people who are blind or colorblind. To ensure that
            meaning conveyed through color is available to everyone, it must
            also be conveyed through other visual aspects. (It must also be
            communicated textually to assistive technology, but that's beyond
            the scope of this test.)
        </p>
        <p>
            To learn more, see <Link.WCAG21UnderstandingUseOfColor />.
        </p>

        <h2>About the Color visualization</h2>

        <p>
            By showing the target page in grayscale, the Color visualization
            helps you identify instances where color is the only visible means
            of conveying meaning.
        </p>

        <Markup.Columns>
            <Markup.Do>
                <h3>Feel free to use color to convey meaning.</h3>

                <ul>
                    <li>
                        Color can be a powerful method for communicating things
                        like function, category, or status.
                    </li>
                </ul>
            </Markup.Do>
            <Markup.Dont>
                <h3>
                    Don't use color as the only visual means of conveying
                    meaning.
                </h3>

                <ul>
                    <li>
                        Combine color with other visual aspects, such as shape,
                        size, symbols, or text.
                    </li>
                </ul>

                <h3>
                    Don't offer instructions that rely solely on color or other
                    sensory characteristics.
                </h3>

                <ul>
                    <li>
                        Sensory characteristics include color, shape, size,
                        visual location, orientation and sound.
                    </li>
                    <li>
                        Incorporating text is the best way to ensure your
                        instructions don't rely on sensory characteristics.
                        <ul>
                            <li>
                                Bad: To submit the form, press the green button.
                            </li>
                            <li>
                                Good: To submit the form, press the green 'Go'
                                button.
                            </li>
                            <li>
                                Bad: To view course descriptions, use the links
                                to the right.
                            </li>
                            <li>
                                Good: To view course descriptions, use the
                                'Available courses' links to the right.
                            </li>
                        </ul>
                    </li>
                </ul>
            </Markup.Dont>
        </Markup.Columns>
    </React.Fragment>
));
