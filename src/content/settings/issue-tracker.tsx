import { autobind } from '@uifabric/utilities';
import * as React from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { ActionAndCancelButtonsComponent } from '../../DetailsView/components/action-and-cancel-buttons-component';

export interface IIssueTrackerInputProps {
    onSave: (state: string) => void;
    issueTrackerPath?: string;
}
export interface IIssueTrackerState {
    issueTrackerPath: string;
}
export class IssueTrackerInput extends React.Component<IIssueTrackerInputProps, IIssueTrackerState> {
    constructor(props) {
        super(props);
        this.state = {
            issueTrackerPath: '',
        };
    }
    public render(): JSX.Element {
        return (
            <div className="issue-tracker-input">
                <TextField
                    placeholder={this.props.issueTrackerPath}
                    label="Path to issue tracker (e.g. 'https://github.com/Microsoft/vscode/issues')"
                    value={this.state.issueTrackerPath}
                    onChange={this.onIssueTrackerPathChange}
                />
                <ActionAndCancelButtonsComponent
                    isHidden={false}
                    primaryButtonDisabled={this.state.issueTrackerPath === ''}
                    primaryButtonText="Save"
                    primaryButtonOnClick={this.onSaveClick}
                    cancelButtonOnClick={this.onCancelClick}
                />
            </div>
        );
    }

    @autobind
    protected onIssueTrackerPathChange(event, value: string): void {
        this.setState({ issueTrackerPath: value });
    }

    @autobind
    protected onSaveClick(id: string): void {
        this.props.onSave(this.state.issueTrackerPath);
        this.setState({ issueTrackerPath: '' });
    }

    @autobind
    protected onCancelClick(id: string): void {
        this.setState({ issueTrackerPath: '' });
    }
}
