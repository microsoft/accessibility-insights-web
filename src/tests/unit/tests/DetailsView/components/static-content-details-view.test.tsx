// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { shallow } from 'enzyme';
import * as React from 'react';
import { IMock, It, Mock, Times } from 'typemoq';

import { VisualizationToggle } from '../../../../../common/components/visualization-toggle';
import { StaticContentDetailsView, StaticContentDetailsViewProps } from '../../../../../DetailsView/components/static-content-details-view';
import { EventStubFactory, INativeEventStub } from '../../../common/event-stub-factory';

describe('StaticContentDetailsViewTest', () => {
    test('render', () => {
        const props: StaticContentDetailsViewProps = new StaticContentDetailsViewPropsBuilder().build();

        const actual = shallow(<StaticContentDetailsView {...props} />);

        expect(actual).toMatchSnapshot();
    });

    test('click the toggle', () => {
        const event = new EventStubFactory().createMouseClickEvent() as any;
        const clickHandlerMock = Mock.ofInstance(event => {});
        clickHandlerMock.setup(chm => chm(event)).verifiable(Times.once());

        const propsBuilder = new StaticContentDetailsViewPropsBuilder().setupOnToggleClickMock(event);
        const props: StaticContentDetailsViewProps = propsBuilder.build();
        const testObject = shallow(<StaticContentDetailsView {...props} />);
        const visualizationToggle = testObject.find(VisualizationToggle);
        visualizationToggle.prop('onClick')(event);
        propsBuilder.verifyAll();
    });
});

class StaticContentDetailsViewPropsBuilder {
    private title: string = 'my test title';
    private visualizationEnabled: boolean = true;
    private toggleLabel: string = 'my test toggle label';
    private onToggleClickMock: IMock<(event) => void> = Mock.ofInstance(event => {});
    private content: JSX.Element = <div>my test static content</div>;

    public setupOnToggleClickMock(event: INativeEventStub): StaticContentDetailsViewPropsBuilder {
        this.onToggleClickMock.setup(click => click(It.isValue(event))).verifiable(Times.once());

        return this;
    }

    public build(): StaticContentDetailsViewProps {
        const props: StaticContentDetailsViewProps = {
            title: this.title,
            visualizationEnabled: this.visualizationEnabled,
            toggleLabel: this.toggleLabel,
            content: this.content,
            onToggleClick: this.onToggleClickMock.object,
        };

        return props;
    }

    public verifyAll(): void {
        this.onToggleClickMock.verifyAll();
    }
}
