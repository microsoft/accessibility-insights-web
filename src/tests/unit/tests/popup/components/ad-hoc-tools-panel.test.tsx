// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react-components';
import { render } from '@testing-library/react';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import { AdHocToolsPanel, AdHocToolsPanelProps } from 'popup/components/ad-hoc-tools-panel';
import { DiagnosticViewToggleFactory } from 'popup/components/diagnostic-view-toggle-factory';
import * as React from 'react';
import { Mock, Times } from 'typemoq';
import {
    getMockComponentClassPropsForCall,
    mockReactComponents,
} from '../../../mock-helpers/mock-module-helpers';

jest.mock('@fluentui/react-components');
describe('AdHocToolsPanelTest', () => {
    mockReactComponents([Link]);
    const diagnosticViewToggleFactoryMock = Mock.ofType(DiagnosticViewToggleFactory);
    const flagName: string = 'showAccessibleNames';

    test('adhoc panel matches snapshot', () => {
        diagnosticViewToggleFactoryMock
            .setup(factory => factory.createTogglesForAdHocToolsPanel())
            .returns(() => [
                <div key="first">first</div>,
                <div key="second">second</div>,
                <div key="third">third</div>,
                <div key="fourth">fourth</div>,
                <div key="fifth">fifth</div>,
            ]);
        const props: AdHocToolsPanelProps = {
            backLinkHandler: null,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        const renderResult = render(<AdHocToolsPanel {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('adhoc panel with needs review sixth toggle matches snapshot', () => {
        diagnosticViewToggleFactoryMock
            .setup(factory => factory.createTogglesForAdHocToolsPanel())
            .returns(() => [
                <div key="first">first</div>,
                <div key="second">second</div>,
                <div key="third">third</div>,
                <div key="fourth">fourth</div>,
                <div key="fifth">fifth</div>,
                <div key="sixth">sixth</div>,
            ]);
        const props: AdHocToolsPanelProps = {
            backLinkHandler: null,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        const renderResult = render(<AdHocToolsPanel {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('adhoc tools panel with accessible names feature', () => {
        const featureFlagStoreData: FeatureFlagStoreData = {};
        featureFlagStoreData[flagName] = true;
        diagnosticViewToggleFactoryMock
            .setup(factory => factory.createTogglesForAdHocToolsPanel())
            .returns(() => [
                <div key="first">first</div>,
                <div key="second">second</div>,
                <div key="third">third</div>,
                <div key="fourth">fourth</div>,
                <div key="fifth">fifth</div>,
                <div key="sixth">sixth</div>,
                <div key="seventh">seventh</div>,
            ]);
        const props: AdHocToolsPanelProps = {
            backLinkHandler: null,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        const renderResult = render(<AdHocToolsPanel {...props} />);
        expect(renderResult.asFragment()).toMatchSnapshot();
    });

    test('back link clicked', () => {
        diagnosticViewToggleFactoryMock
            .setup(factory => factory.createTogglesForAdHocToolsPanel())
            .returns(() => []);

        const backLinkHandlerMock = Mock.ofInstance(() => {});
        backLinkHandlerMock.setup(b => b()).verifiable(Times.once());

        const props: AdHocToolsPanelProps = {
            backLinkHandler: backLinkHandlerMock.object,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        render(<AdHocToolsPanel {...props} />);

        getMockComponentClassPropsForCall(Link).onClick();

        backLinkHandlerMock.verifyAll();
    });
});
