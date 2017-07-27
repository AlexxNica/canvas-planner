/*
 * Copyright (C) 2017 - present Instructure, Inc.
 *
 * This module is part of Canvas.
 *
 * This module and Canvas are free software: you can redistribute them and/or modify them under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation, version 3 of the License.
 *
 * This module and Canvas are distributed in the hope that they will be useful, but WITHOUT ANY
 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
 * A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License along
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */
import React from 'react';
import { shallow, mount } from 'enzyme';
import Grouping from '../index';

const getDefaultProps = () => ({
  items: [{
    id: "5",
    title: 'San Juan',
    date: '2017-04-25T05:06:07-08:00',
    context: {
      url: 'example.com',
      color: "#5678",
      id: 256
    }
  }, {
    id: "6",
    date: '2017-04-25T05:06:07-08:00',
    title: 'Roll for the Galaxy',
    context: {
      color: "#5678",
      id: 256
    }
  }],
  timeZone: "America/Denver",
  color: "#5678",
  id: 256,
  url: 'example.com',
  title: 'Board Games',
  updateTodo: () => {}
});

it('renders the base component with required props', () => {
  const wrapper = shallow(
    <Grouping {...getDefaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('grouping contains link pointing to course url', () => {
  const props = getDefaultProps();
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper).toMatchSnapshot();
});

it('renders to do items correctly', () => {
  const props = {
    items: [{
      id: "700",
      title: 'To Do 700',
      date: '2017-06-16T05:06:07-06:00',
      context: null,
    }],
    timeZone: "America/Denver",
    color: null,
    id: null,
    url: null,
    title: null,
    updateTodo: () => {}
  };
  const wrapper = shallow(
    <Grouping {...props} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('does not render completed items by default', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('PlannerItem')).toHaveLength(1);
});

it('renders a CompletedItemsFacade when completed items are present by default', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper).toMatchSnapshot();
});

it('renders completed items when the facade is clicked', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = mount(
    <Grouping {...props} />
  );

  wrapper.instance().handleFacadeClick();
  expect(wrapper.find('PlannerItem')).toHaveLength(2);
});

it('renders completed items when they have the show property', () => {
  const props = getDefaultProps();
  props.items[0].show = true;
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('PlannerItem')).toHaveLength(2);
});

it('does not render a CompletedItemsFacade when showCompletedItems state is true', () => {
  const props = getDefaultProps();
  props.items[0].completed = true;

  const wrapper = shallow(
    <Grouping {...props} />
  );

  wrapper.setState({ showCompletedItems: true });
  expect(wrapper.find('CompletedItemsFacade')).toHaveLength(0);
});

it('renders an activity notification when there is new activity', () => {
  const props = getDefaultProps();
  props.items[1].newActivity = true;
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('Badge')).toHaveLength(1);
  expect(wrapper.find('Badge')).toHaveProperty('node.props.variant', 'primary');
  expect(wrapper.find('ScreenReaderContent')).toHaveLength(1);
  expect(wrapper.find('ScreenReaderContent')).toHaveProperty('node.props.children', 'New activity for ' + props.title);
});

it('renders a danger activity notification when there is a missing item', () => {
  const props = getDefaultProps();
  props.items[1].status = {missing: true};
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('Badge')).toHaveLength(1);
  expect(wrapper.find('Badge')).toHaveProperty('node.props.variant', 'danger');
  expect(wrapper.find('ScreenReaderContent')).toHaveLength(1);
  expect(wrapper.find('ScreenReaderContent')).toHaveProperty('node.props.children', 'Missing items for ' + props.title);
});

it('renders the to do screenreader text when there is no course', () => {
  let props = getDefaultProps();
  props.title = null;
  props.items[1].newActivity = true;
  const wrapper = shallow(
    <Grouping {...props} />
  );

  expect(wrapper.find('ScreenReaderContent')).toHaveLength(1);
  expect(wrapper.find('ScreenReaderContent')).toHaveProperty('node.props.children', 'New activity for To Do');
});

it('does not render an activity badge when things have no new activity', () => {
  const props = getDefaultProps();
  const wrapper = shallow(
    <Grouping {...props} />
  );
  expect(wrapper.find('Badge')).toHaveLength(0);
});

it('invokes the takeFocusRef (if passed) on a focusable element', () => {
  const mockTakeFocus = jest.fn();
  mount(<Grouping {...getDefaultProps()} takeFocusRef={mockTakeFocus} />);
  expect(mockTakeFocus).toHaveBeenCalledWith(expect.anything());
});

describe('handleFacadeClick', () => {
  it('sets focus to the groupingLink when called', () => {
    const wrapper = mount(
      <Grouping {...getDefaultProps()} />
    );
    wrapper.instance().handleFacadeClick();
    expect(document.activeElement).toBe(wrapper.instance().groupingLink);
  });

  it('calls preventDefault on an event if given one', () => {
    const wrapper = mount(
      <Grouping {...getDefaultProps()} />
    );
    const fakeEvent = {
      preventDefault: jest.fn()
    };
    wrapper.instance().handleFacadeClick(fakeEvent);
    expect(fakeEvent.preventDefault).toHaveBeenCalled();
  });
});

describe('toggleCompletion', () => {
  it('binds the toggleCompletion method to item', () => {
    const mock = jest.fn();
    const props = getDefaultProps();
    const wrapper = mount(
      <Grouping
        {...props}
        toggleCompletion={mock}
      />
    );
    wrapper.find('input').first().simulate('change');
    expect(mock).toHaveBeenCalledWith(props.items[0]);
  });
});
