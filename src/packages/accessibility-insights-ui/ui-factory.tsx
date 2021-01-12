// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CheckIcon } from 'common/icons/check-icon';
import { CrossIcon } from 'common/icons/cross-icon';
import { NamedFC } from 'common/react/named-fc';
import * as React from 'react';
import { ContentView, ContentViewDeps } from 'views/content/content-view';
import { GuidanceTitle } from 'views/content/guidance-title';
import { createMarkup, MarkupDeps } from 'views/content/markup';

type UIOptions = {
    applicationTitle: string;
    setPageTitle: boolean;
};

const nullCreator = () => {};

export const contentViewFactory = ({ applicationTitle }: UIOptions) => {
    const contentViewDeps: ContentViewDeps = {
        textContent: {
            applicationTitle,
        },
        storeActionMessageCreator: {
            getAllStates: nullCreator,
        },
        storesHub: null,
        storesActionCreator: null,
        getNarrowModeThresholds: null,
    };

    return NamedFC('ContentView', props => (
        <ContentView deps={contentViewDeps}>{props.children}</ContentView>
    ));
};

export const markupFactory = (options: UIOptions) => {
    const { applicationTitle } = options;
    const markupDeps: MarkupDeps = {
        textContent: {
            applicationTitle,
        },
        contentActionMessageCreator: {
            openContentHyperLink: nullCreator,
        },
    };
    const { Include, ...Markup } = createMarkup(markupDeps, options);
    return Markup;
};

export const UIFactory = (options: UIOptions) => {
    return {
        ContentView: contentViewFactory(options),
        GuidanceTitle,
        Markup: markupFactory(options),
        CheckIcon,
        CrossIcon,
    };
};
