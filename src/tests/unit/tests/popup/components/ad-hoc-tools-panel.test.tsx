// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Enzyme from 'enzyme';
import { Icon, Link } from 'office-ui-fabric-react';
import { AdHocToolsPanel, AdHocToolsPanelProps } from 'popup/components/ad-hoc-tools-panel';
import { DiagnosticViewToggleFactory } from 'popup/components/diagnostic-view-toggle-factory';
import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import { Mock, Times } from 'typemoq';

describe('AdHocToolsPanelTest', () => {
    const diagnosticViewToggleFactoryMock = Mock.ofType(DiagnosticViewToggleFactory);

    beforeEach(() => {
        diagnosticViewToggleFactoryMock
            .setup(factory => factory.createTogglesForAdHocToolsPanel())
            .returns(() => [
                <div key="first">first</div>,
                <div key="second">second</div>,
                <div key="third">third</div>,
                <div key="fourth">fourth</div>,
                <div key="fifth">fifth</div>,
            ]);
    });

    test('render toggles', () => {
        const props: AdHocToolsPanelProps = {
            backLinkHandler: null,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        const component = React.createElement(AdHocToolsPanel, props);
        const testObject = TestUtils.renderIntoDocument(component);

        const result = testObject.render();

        const expectedElements: JSX.Element = (
            <div className="ms-Grid main-section">
                <main>
                    <div className="ms-Grid-row">
                        <div key="visualization-toggle-group-0" className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ad-hoc-tools-panel-group-0">
                            <div key="first">first</div>
                            <div key="diagnostic-view-toggle-divider-0-1" className="ms-fontColor-neutralLight launch-panel-hr" />
                            <div key="second">second</div>
                            <div key="diagnostic-view-toggle-divider-0-3" className="ms-fontColor-neutralLight launch-panel-hr" />
                            <div key="third">third</div>
                        </div>
                        <div key="visualization-toggle-group-1" className="ms-Grid-col ms-sm6 ms-md6 ms-lg6 ad-hoc-tools-panel-group-1">
                            <div key="fourth">fourth</div>
                            <div key="diagnostic-view-toggle-divider-1-1" className="ms-fontColor-neutralLight launch-panel-hr" />
                            <div key="fifth">fifth</div>
                        </div>
                    </div>
                </main>
                <div role="navigation" className="ad-hoc-tools-panel-footer">
                    <Link className="insights-link" onClick={props.backLinkHandler} id="back-to-launchpad-link">
                        <Icon className="back-to-launch-pad-icon" iconName="back" />
                        Back to launch pad
                    </Link>
                </div>
            </div>
        );

        expect(result).toEqual(expectedElements);
    });

    test('adhoc panel matches snapshot', () => {
        const props: AdHocToolsPanelProps = {
            backLinkHandler: null,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        const adhocPanelComponent = Enzyme.shallow(<AdHocToolsPanel {...props} />);
        expect(adhocPanelComponent.getElement()).toMatchSnapshot();
    });

    test('back link clicked', () => {
        diagnosticViewToggleFactoryMock.setup(factory => factory.createTogglesForAdHocToolsPanel()).returns(() => []);

        const backLinkHandlerMock = Mock.ofInstance(() => {});
        backLinkHandlerMock.setup(b => b()).verifiable(Times.once());

        const props: AdHocToolsPanelProps = {
            backLinkHandler: backLinkHandlerMock.object,
            diagnosticViewToggleFactory: diagnosticViewToggleFactoryMock.object,
        };

        const wrapper = Enzyme.shallow(<AdHocToolsPanel {...props} />);

        wrapper.find(Link).simulate('click');

        backLinkHandlerMock.verifyAll();
    });
});
