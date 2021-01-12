// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { CheckIcon } from 'common/icons/check-icon';
import { CrossIcon } from 'common/icons/cross-icon';
import { shallow } from 'enzyme';
import { UIFactory } from 'packages/accessibility-insights-ui/ui-factory';
import * as React from 'react';
import { GuidanceTitle } from 'views/content/guidance-title';

describe('UIFactory', () => {
    const applicationTitle = 'THE_APPLICATION_TITLE';
    const options = {
        applicationTitle,
        setPageTitle: true,
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
        });
    });

    it('exports ContentView', () => {
        const wrapper = shallow(<ui.ContentView>CONTENTS</ui.ContentView>);
        expect(wrapper.getElement()).toMatchSnapshot();
    });
});
