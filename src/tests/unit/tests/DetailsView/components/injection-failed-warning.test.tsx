// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import {
    InjectingState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { InjectionFailedWarning } from 'DetailsView/components/injection-failed-warning';
import { shallow } from 'enzyme';
import * as React from 'react';

describe('InjectionFailedWarning', () => {
    test('render with injection failed', () => {
        const storeData = {
            injectingState: InjectingState.injectingFailed,
        } as VisualizationStoreData;
        const wrapper = shallow(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('render with injection not failed', () => {
        const storeData = {
            injectingState: InjectingState.notInjecting,
        } as VisualizationStoreData;
        const wrapper = shallow(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(wrapper.getElement()).toBeNull();
    });

    test('render without injection failed', () => {
        const storeData = {} as VisualizationStoreData;
        const wrapper = shallow(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(wrapper.getElement()).toBeNull();
    });
});
