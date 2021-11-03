// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { DisplayableVisualizationTypeData } from 'common/types/displayable-visualization-type-data';
import {
    AdhocTabStopsTestView,
    AdhocTabStopsTestViewProps,
} from 'DetailsView/components/adhoc-tab-stops-test-view';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('AdhocTabStopsTestView', () => {
    const props = {
        configuration: {
            displayableData: {
                title: 'test title',
            } as DisplayableVisualizationTypeData,
        },
    } as AdhocTabStopsTestViewProps;

    it('renders with content', () => {
        const rendered = shallow(<AdhocTabStopsTestView {...props} />);
        expect(rendered.getElement()).toMatchSnapshot();
    });
});
