// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
# Enzyme Migration

These are cursory notes on the migration to help folks get a sense of the process and some common API differences.

## Codemod usage

1. Edit the paths variable in `tools/codeshift.js` to include the files you want to migrate.
1. Run `yarn codeshift`
1. Run `yarn test -u` to update snapshots
1. Commit tests and snapshots that pass and look fairly similar to old snapshots (don’t have a ton of new content due to the full render instead of shallow rendering)
1. Make manual changes as needed to finish migrating the remaining tests.
  1. Running `yarn test -f -u` and fixing failing tests with each run is helpful

## Manual code changes

### Mocking

A large portion of changes that will need to be manually made are mocking changes. Our tests heavily use Enzyme’s Shallow render functionality. Shallow render does not fully render React components that are used to compose the component being tested but renders them as JSX instead, with their props intact.

Because React Testing Library does not have equivalent functionality, we need to mock any React Elements that are used to compose the component we are testing to make our snapshot tests meaningful without a bunch of redundant content that is tested elsewhere already. This also solves the issue where props from nested React components are not defined in the test because it wasn’t required for a shallow render but a full render expects it to be there.

The one caveat to this is if the test requires that element be fully rendered to interact with it (e.g., the test interacts with a button that is rendered through a React element). These tests will likely not use a snapshot.

#### Mocking components

Add `jest.mock(‘/path/to/file/with/component’)` under the imports of the file.

 * If there are multiple components that need mocking from the same path, only one `jest.mock` call is needed.
 * If there are multiple components that need mocking from different paths, there should be one `jest.mock` call per path.

In the `describe` block, add `mockReactComponents([ComponentName])`.
 * This array should contain all the components that need to be mocked, though it is often only a single component.

#### Snapshot parity

If the test snapshot appears to be missing information because one of the props for the mocked component is rendered as `[Object object]`, an additional snapshot for the props of that component should be added:

`expectMockedComponentPropsToMatchSnapshot([ComponentName])`

or

`expect(getMockComponentClassPropsForCall(ComponentName)).toMatchSnapshot()`

#### Testing if a component is present (e.g., if the original test code has something like `expect(wrapper.find(ComponentName)).not.toBeNull()`)

For this case you should mock the component and then use `expect(ComponentName).toBeCalled()`


### API Differences

The codemod handles all of the straightforward API differences, but many of our tests use custom helpers and have too many interdependent variables for the codemod to be able to correctly migrate it.

#### `.find(ComponentName)`

NOTE: the codemod changes all `.find()` calls, as the vast majority are for Enzyme. However, some number of regular `Array.find()` calls will be mistakenly changed. These can just be changed back.

NOTE: the codemod automatically changes `.find()` to be `.querySelector()`, as that is most often the correct API call to migrate to. If the selected variable's value should be an array instead of a standalone element, it should be updated to use `.querySelectorAll()` instead. Additionally, all React Testing Library query calls have “All” variations. For example, `getAllByRole`.

The treatment of these calls will depend on what operations are performed on the object after this call.

If the component is some sort of `ButtonComponent` and the old code used `foundComponentVariableName.simulate(‘click’)` after the `.find` call, then this can likely be migrated as `renderResult.getByRole(‘button’)` and then the simulate line can be migrated separately.

If the component is just being used to verify that the content made it to the page (checking if the found component is `null`), you can instead [mock that component](#mocking-components) and `assert` that the component was called.

Alternatively, if the test is checking for specific text to be present, something like `renderResult.findByText(‘text content’)` and `assert` that the result is *not* `null`.

If the test is checking to see if something is *not* there, you will likely need to utilize the `queryBy` API (e.g. `renderResult.queryByRole(‘button’)`), which won’t error if it can’t find a result.

If the element being searched for is outside of the originally rendered element, you may need to use the `screen.getBy` APIs instead, as this will look for the element in the entire screen, and not just inside a small portion. `screen` is part of `@testing-library/react`.

You will likely need to look at the composition of the component you are testing to select which [`getBy` or `queryBy` API call](https://testing-library.com/docs/queries/about#priority) you need. The ones most likely to be useful are `getByRole`, `getByLabelText`, and `getByText`


#### `.is(tag)`

`expect(elementVar.tagName).toBe(tag.toUppercase());`


#### `.simulate`

Simulating events can be achieved in two ways. The preferred method is using [`userEvent`](https://testing-library.com/docs/user-event/intro), imported from `@testing-library/user-event`. This fires off an actual full fledged event as if an actual user interaction had occurred. The other method is by importing [`fireEvent`](https://testing-library.com/docs/dom-testing-library/api-events#fireevent) from `@testing-library/react`, which still calls `dispatchEvent` but may not fire all events in the same order as an actual user interaction.

Many of our enzyme tests construct a stubEvent to pass into the simulate call. This stub will not be necessary as a near-real event will be triggered by the new APIs. Any mock functions expecting the stubEvent will have to be modified.

##### `user-event`

The codemod will automatically change any `button.simulate(‘click’)` to be `await userEvent.click(renderResult.getByRole(‘button’))` because that works for the majority of cases. You’ll just need to delete the obsolete code previously used to delete the button.

To type into an input, use `await userEvent.type(elementVariable, value)`. `type` documentation: [https://testing-library.com/docs/user-event/utility#type](https://testing-library.com/docs/user-event/utility#type)

To press a specific key regardless of element, use `await userEvent.keyboard(keyActions)`. `keyboard` documentation: [https://testing-library.com/docs/user-event/utility#type](https://testing-library.com/docs/user-event/utility#type)

Check out the [user-event documentation](https://testing-library.com/docs/user-event/intro) if you run into other cases.

##### `fireEvent`

`fireEvent` is most useful for when we want to mock an event function like `stopPropagation` and check that it is called because the event can be created and modified before it is passed into `fireEvent`. For example:

```
const event = createEvent.click(link);

event.stopPropagation = stopPropagationMock;

fireEvent(link, event);

expect(stopPropagationMock).toHaveBeenCalledTimes(1);
```

`createEvent` (used in the example above) is also part of `@testing-library/react`.

#### Manipulating React state

Directly modifying React state after initial render is not possible in React Testing Library. Instead, you should figure out how that state change is triggered and use [user-event](#user-event) or updated `props` to achieve the same result by interacting with the rendered component.

To check if an expected React state is produced, test that the UI reflects that state as expected.

#### Updating React `props` after initial render

To update `props` after initial render, use the [`rerender`](https://testing-library.com/docs/react-testing-library/api#rerender) function and pass in the new `props`.  This function is available on the `renderResult` object produced by the `render` function.
