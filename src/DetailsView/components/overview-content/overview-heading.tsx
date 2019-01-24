// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as React from 'react';
import { NamedSFC } from '../../../common/react/named-sfc';
import { productName } from '../../../content/strings/application';

export const OverviewHeading = NamedSFC('OverviewHeading', () => {
    return (
        <>
            <div className="overview-heading">
                <h1>Overview</h1>
                <div>
                    This summary indicates the overall accessibility of the website or web app, through a combination of automated and
                    manual tests, covering all WCAG 2.0 AA success criteria. Each manual test covers a set of related accessibility
                    requirements, with provided step-by-step testing instructions and guidance. Where possible, {productName} "assists" the
                    manual test process by generating a list of instances to evaluate and highlighting them on the screen. {productName}{' '}
                    also allows you to manually record failure instances.
                </div>
            </div>
        </>
    );
});
