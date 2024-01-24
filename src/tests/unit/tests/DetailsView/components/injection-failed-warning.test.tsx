// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { MessageBar } from '@fluentui/react';
import { render } from '@testing-library/react';
import {
    InjectingState,
    VisualizationStoreData,
} from 'common/types/store-data/visualization-store-data';
import { InjectionFailedWarning } from 'DetailsView/components/injection-failed-warning';
import * as React from 'react';
import { mockReactComponents } from '../../../mock-helpers/mock-module-helpers';
jest.mock('@fluentui/react');

describe('InjectionFailedWarning', () => {
    mockReactComponents([MessageBar]);
    test('render with injection failed', () => {
        const storeData = {
            injectingState: InjectingState.injectingFailed,
        } as VisualizationStoreData;
        const renderResult = render(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('render with injection not failed', () => {
        const storeData = {
            injectingState: InjectingState.notInjecting,
        } as VisualizationStoreData;
        const renderResult = render(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(renderResult.container.firstChild).toBeNull();
    });

    test('render without injection failed', () => {
        const storeData = {} as VisualizationStoreData;
        const renderResult = render(<InjectionFailedWarning visualizationStoreData={storeData} />);
        expect(renderResult.container.firstChild).toBeNull();
    });
});
