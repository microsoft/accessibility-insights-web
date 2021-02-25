// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { InjectedDialogActions } from 'background/actions/injected-dialog-actions';
import { VisualizationActions } from 'background/actions/visualization-actions';
import { InjectedDialogStore } from 'background/stores/injected-dialog-store';
import { Action } from 'common/flux/action';

describe('InjectedDialogStore', () => {
    let testSubject: InjectedDialogStore;
    let injectedDialogActions: InjectedDialogActions;
    let visualizationActions: VisualizationActions;
    let changeListener: jest.Mock<void, [store: InjectedDialogStore, args?: unknown]>;

    beforeEach(() => {
        injectedDialogActions = new InjectedDialogActions();
        visualizationActions = new VisualizationActions();
        changeListener = jest.fn();
        testSubject = new InjectedDialogStore(injectedDialogActions, visualizationActions);
        testSubject.initialize();
        testSubject.addChangedListener(changeListener);
    });

    it('is initially closed', () => {
        const initialState = testSubject.getState();
        expect(initialState.isOpen).toBe(false);
        expect(initialState.target).toBeNull();
    });

    it('opens if currently closed', () => {
        injectedDialogActions.openDialog.invoke({ target: ['stub', 'target'] });

        const state = testSubject.getState();
        expect(state.isOpen).toBe(true);
        expect(state.target).toEqual(['stub', 'target']);
        expect(changeListener).toHaveBeenCalledTimes(1);
    });

    it('updates target if currently open', () => {
        injectedDialogActions.openDialog.invoke({ target: ['old'] });
        changeListener.mockReset();

        injectedDialogActions.openDialog.invoke({ target: ['new'] });

        const state = testSubject.getState();
        expect(state.isOpen).toBe(true);
        expect(state.target).toEqual(['new']);
        expect(changeListener).toHaveBeenCalledTimes(1);
    });

    describe.each`
        actionsGroup               | actionName
        ${'injectedDialogActions'} | ${'closeDialog'}
        ${'visualizationActions'}  | ${'enableVisualization'}
        ${'visualizationActions'}  | ${'disableVisualization'}
        ${'visualizationActions'}  | ${'updateSelectedPivot'}
        ${'visualizationActions'}  | ${'updateSelectedPivotChild'}
    `('$actionsGroup $actionName behavior', ({ actionsGroup, actionName }) => {
        let action: Action<unknown>;
        beforeEach(() => {
            action = { injectedDialogActions, visualizationActions }[actionsGroup][actionName];
        });

        it('no-ops if already closed', () => {
            action.invoke(null);

            const state = testSubject.getState();
            expect(state.isOpen).toBe(false);
            expect(state.target).toBeNull();
            expect(changeListener).not.toHaveBeenCalled();
        });

        it('closes if currently open', () => {
            injectedDialogActions.openDialog.invoke({ target: ['irrelevant'] });
            changeListener.mockReset();

            action.invoke(null);

            const state = testSubject.getState();
            expect(state.isOpen).toBe(false);
            expect(state.target).toBeNull();
            expect(changeListener).toHaveBeenCalledTimes(1);
        });
    });
});
