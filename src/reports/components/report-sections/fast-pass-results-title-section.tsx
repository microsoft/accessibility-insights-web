// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';

export type FastPassResultsTitleSectionProps = {
    title: string;
};

export const FastPassResultsTitleSection = NamedFC<FastPassResultsTitleSectionProps>(
    'FastPassResultsTitleSection',
    props => {
        return (
            <div className="title-section">
                <h2>{props.title}</h2>
            </div>
        );
    },
);
