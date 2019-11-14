// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, GuidanceTitle, React } from '../../common';
import { productName } from '../../strings/application';

export const guidance = create(({ Markup }) => (
    <>
        <GuidanceTitle name={'Automated checks'} />
        <p>
            The automated checks in {productName} can identify more than 40
            types of critical accessibility issues in seconds.
        </p>

        <h2>No false positives</h2>
        <p>
            The automated checks focus on issues that can be detected reliably
            through automation. For example, an automated check can determine
            whether a button has an accessible name; it does not attempt to
            determine whether the button has a good accessible name.
        </p>
        <p>
            We use the{' '}
            <Markup.HyperLink href="https://www.deque.com/axe/">
                axe-core
            </Markup.HyperLink>{' '}
            rules and engine for our automated checks. Axe-core is open source
            and actively maintained by a team of expert developers who are
            committed to quickly eliminating any false positives reported by
            users.
        </p>

        <h2>Fix these issues first</h2>
        <p>
            We recommend fixing any issues detected through automated checks
            before proceeding to the remaining tests, which require human
            judgement. The human-powered tests are easier, faster, and more
            reliable when the auto-detected issues have already been eliminated.
        </p>
    </>
));
