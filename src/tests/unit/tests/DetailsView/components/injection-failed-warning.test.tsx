// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { VisualizationStoreData } from 'common/types/store-data/visualization-store-data';
import { InjectionFailedWarning } from 'DetailsView/components/injection-failed-warning';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InjectionFailedWarning', () => {
    test('render with injection failed true', () => {
        const storeData = { injectionFailed: true } as VisualizationStoreData;
        const wrapper = shallow(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render with injection failed false', () => {
        const storeData = { injectionFailed: false } as VisualizationStoreData;
        const wrapper = shallow(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(wrapper.getElement()).toBeNull();
    });

    test('render without injection failed', () => {
        const storeData = {} as VisualizationStoreData;
        const wrapper = shallow(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(wrapper.getElement()).toBeNull();
    });
});
