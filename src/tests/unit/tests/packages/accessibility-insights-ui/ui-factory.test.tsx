// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { render } from '@testing-library/react';
import { CheckIcon } from 'common/icons/check-icon';
import { CrossIcon } from 'common/icons/cross-icon';
import { NarrowModeThresholds } from 'common/narrow-mode-thresholds';
import { UIFactory } from 'packages/accessibility-insights-ui/ui-factory';
import * as React from 'react';
import { GuidanceTitle } from 'views/content/guidance-title';
import {
    expectMockedComponentPropsToMatchSnapshots,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';
import { ContentView } from '../../../../../views/content/content-view';
jest.mock('../../../../../views/content/content-view');

describe('UIFactory', () => {
    mockReactComponents([ContentView]);
    const applicationTitle = 'THE_APPLICATION_TITLE';
    const narrowModeThresholds = {
        collapseHeaderAndNavThreshold: 600,
        collapseCommandBarThreshold: 960,
    } as NarrowModeThresholds;
    const options = {
        applicationTitle,
        setPageTitle: true,
        getNarrowModeThresholds: () => narrowModeThresholds,
    };
    const ui = UIFactory(options);

    it('exports CheckIcon', () => {
        expect(ui.CheckIcon).toBe(CheckIcon);
    });
    it('exports CrossIcon', () => {
        expect(ui.CrossIcon).toBe(CrossIcon);
    });
    it('exports GuidanceTitle', () => {
        expect(ui.GuidanceTitle).toBe(GuidanceTitle);
    });
    describe('exports Markup', () => {
        const markup = ui.Markup;

        const exports = [
            'Code',
            'CodeExample',
            'Column',
            'Columns',
            'Do',
            'Dont',
            'Emphasis',
            'Fail',
            'Highlight',
            'HyperLink',
            'Inline',
            'LandmarkLegend',
            'Links',
            'Pass',
            'PassFail',
            'ProblemList',
            'Table',
            'Tag',
            'Term',
            'Title',
        ];

        it.each(exports)('exports %s', exp => {
            expect(markup).toHaveProperty(exp);
        });

        it('does not export Include', () => {
            expect(markup).not.toHaveProperty('Include');
        });

        it('has correct options', () => {
            const opts = (markup as any).options;
            expect(opts.applicationTitle).toEqual(applicationTitle);
            expect(opts.setPageTitle).toEqual(true);
            expect(opts.getNarrowModeThresholds()).toEqual(narrowModeThresholds);
        });
    });

    it('exports ContentView', () => {
        const renderResult = render(<ui.ContentView>CONTENTS</ui.ContentView>);
        expect(renderResult.asFragment()).toMatchSnapshot();
        expectMockedComponentPropsToMatchSnapshots([ContentView]);
    });
});
