// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Link } from '@fluentui/react';
import { FeatureFlagStoreData } from 'common/types/store-data/feature-flag-store-data';
import * as Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import { AdHocToolsPanel, AdHocToolsPanelProps } from 'popup/components/ad-hoc-tools-panel';
import { DiagnosticViewToggleFactory } from 'popup/components/diagnostic-view-toggle-factory';
import * as React from 'react';
import { Mock, Times } from 'typemoq';

describe('AdHocToolsPanelTest', () => {
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
            featureFlagStoreData: {},
        };

        const wrapper = shallow(<AdHocToolsPanel {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
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
            featureFlagStoreData: {},
        };

        const wrapper = shallow(<AdHocToolsPanel {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('adhoc tools panel with accessible names feature flag enabled', () => {
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
            featureFlagStoreData: featureFlagStoreData,
        };

        const wrapper = shallow(<AdHocToolsPanel {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
    });

    test('adhoc tools panel with accessible names feature flag disabled', () => {
        const featureFlagStoreData: FeatureFlagStoreData = {};
        featureFlagStoreData[flagName] = false;
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
            featureFlagStoreData: {},
        };

        const wrapper = shallow(<AdHocToolsPanel {...props} />);
        expect(wrapper.getElement()).toMatchSnapshot();
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
            featureFlagStoreData: {},
        };

        const wrapper = Enzyme.shallow(<AdHocToolsPanel {...props} />);

        wrapper.find(Link).simulate('click');

        backLinkHandlerMock.verifyAll();
    });
});
