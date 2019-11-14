// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { create, React } from '../common';

export const uniqueLandmark = create(({ Markup }) => (
    <>
        <h1>
            Landmarks must have a unique role or role/label combination
            (aria-label OR aria-labelledby)
        </h1>

        <h2>Rule Description</h2>

        <p>
            Every landmark in an HTML document have a different role or
            role/label combination.
        </p>

        <h2>How this is checked</h2>

        <p>
            For each landmark, if there exists another landmark with the same
            role and label combination, it is a failure.
        </p>

        <h2>Why this is important</h2>

        <p>
            Screen reader users use landmarks to navigate through the page. Each
            landmark is announced to the user with the landmark role and, if
            present, label. If more than one landmark shares the same role/label
            combination, this would be either confusing to the user in that they
            would have no way to differentiate the content indicated by the
            landmarks.
        </p>

        <h2>How to fix it</h2>

        <p>
            Ensure that there is only one landmark of a given role in the
            document. If it is desired to have more than one landmark of a given
            role, ensure that there is a descriptive label distinguishing
            between the two landmarks.
        </p>
    </>
));
