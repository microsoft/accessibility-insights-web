// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as _ from 'lodash/index';
import { DefaultButton, IconButton } from 'office-ui-fabric-react/lib/Button';
import {
    FocusZone,
    FocusZoneDirection,
} from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { ITextField, TextField } from 'office-ui-fabric-react/lib/TextField';
import * as React from 'react';
import { SingleElementSelector } from '../types/store-data/scoping-store-data';

export interface SelectorInputListProps {
    title: string;
    subtitle: string;
    items: SingleElementSelector[];
    inputType: string;
    inspectMode: string;
    instructions?: JSX.Element;
    onAddSelector: (
        event: React.MouseEvent<HTMLButtonElement>,
        inputType: string,
        selector: string[],
    ) => void;
    onDeleteSelector: (
        event: React.MouseEvent<HTMLButtonElement>,
        inputType: string,
        selector: string[],
    ) => void;
    onChangeInspectMode: (
        event: React.MouseEvent<HTMLButtonElement>,
        inspectType: string,
    ) => void;
}

export interface SelectorInputListState {
    isTextFieldValueValid: boolean;
    value: string;
}

export class SelectorInputList extends React.Component<
    SelectorInputListProps,
    SelectorInputListState
> {
    private textField: ITextField;
    private emptyStringInitialValue = '';

    constructor(props) {
        super(props);
        this.state = {
            isTextFieldValueValid: false,
            value: this.emptyStringInitialValue,
        };
    }

    public componentDidUpdate(previousProps: SelectorInputListProps): void {
        const shouldUpdateState = !_.isEqual(this.props, previousProps);

        if (shouldUpdateState) {
            this.updateFieldValueValidState(null, this.textField.value);
        }
    }

    public render(): JSX.Element {
        return (
            <div className="selector-input-list">
                <h2 className="selector-input-title">{this.props.title}</h2>
                {this.props.instructions}
                <div className="selector-input-add">
                    <TextField
                        className="selector-input-field"
                        ariaLabel={this.props.subtitle}
                        componentRef={this.setTextField}
                        value={this.state.value}
                        onChange={this.updateFieldValueValidState}
                        placeholder="Enter element selector here"
                    />
                    <div className="add-selector-buttons">
                        <DefaultButton
                            className="textbox-add-selector-button"
                            iconProps={{ iconName: 'add' }}
                            onClick={this.addSelector}
                            disabled={!this.state.isTextFieldValueValid}
                            text="Add Selector"
                        />
                        <IconButton
                            iconProps={{
                                iconName: 'scopeTemplate',
                                className: 'inspect-add-selector-button',
                            }}
                            onClick={this.onChangeSelectorHandler}
                        />
                    </div>
                </div>
                <FocusZone
                    className="selector-focus-zone"
                    direction={FocusZoneDirection.vertical}
                >
                    <List
                        className="selector-list"
                        items={this.props.items}
                        onRenderCell={this.onRenderCell}
                    />
                </FocusZone>
            </div>
        );
    }

    protected setTextField = (textField: ITextField): void => {
        this.textField = textField;
    };

    private onRenderCell = (item: string[]): JSX.Element => {
        return (
            <div className="selector-input-itemCell" data-is-focusable={true}>
                <div className="selector-input-itemContent">
                    <div className="selector-input-itemName">
                        {this.renderItemName(item)}
                    </div>
                    <IconButton
                        className="delete-selector-button"
                        iconProps={{
                            iconName: 'cancel',
                            className: 'delete-selector-icon',
                        }}
                        onClick={this.getDeleteSelectorHandler(item)}
                    />
                </div>
            </div>
        );
    };

    private renderItemName(selector: string[]): string {
        return selector.join('; ');
    }

    private updateFieldValueValidState = (
        event,
        textFieldValue: string,
    ): void => {
        this.setState({
            value: textFieldValue,
        });
        const formattedSelector = this.formatSelector(textFieldValue);
        const selectorIsValid =
            !_.isEqual(formattedSelector, ['']) &&
            !_.find(this.props.items, value => {
                return _.isEqual(formattedSelector, value);
            });

        this.setState({ isTextFieldValueValid: selectorIsValid });
    };

    private addSelector = (
        event: React.MouseEvent<HTMLButtonElement>,
    ): void => {
        const selector = this.textField.value;
        this.props.onAddSelector(
            event,
            this.props.inputType,
            this.formatSelector(selector),
        );
        this.restore();
        this.refocus();
    };

    private formatSelector(selector: string): string[] {
        const formattedSelector: string[] = [];
        const selectors = selector.split(';');
        selectors.forEach(element => {
            formattedSelector.push(element.trim());
        });

        return formattedSelector;
    }
    private deleteSelector(
        event: React.MouseEvent<HTMLButtonElement>,
        item: string[],
    ): void {
        this.props.onDeleteSelector(event, this.props.inputType, item);
    }

    private getDeleteSelectorHandler = (
        item: string[],
    ): ((event: React.MouseEvent<HTMLButtonElement>) => void) => {
        return (event: React.MouseEvent<HTMLButtonElement>) => {
            this.deleteSelector(event, item);
        };
    };

    private onChangeSelectorHandler = (
        event: React.MouseEvent<HTMLButtonElement>,
    ): void => {
        this.onChangeSelector(event, this.props.inspectMode);
    };

    private onChangeSelector(
        event: React.MouseEvent<HTMLButtonElement>,
        inspectType: string,
    ): void {
        this.props.onChangeInspectMode(event, inspectType);
    }

    private restore = (): void => {
        this.setState({
            value: this.emptyStringInitialValue,
        });
    };

    private refocus = (): void => {
        this.textField.focus();
    };
}
