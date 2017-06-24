import React from 'react';
import { shallow, mount } from 'enzyme';
import { PlannerHeader } from '../index';

function defaultProps (option) {
  return {
    courses: [{id: "1", shortName: "Course Short Name"}],
    opportunities: [{id: "1", course_id: "1", due_at: "2017-03-09T20:40:35Z", html_url: "http://www.non_default_url.com", name: "learning object title"}],
    getOpportunities: () => {},
    savePlannerItem: () => {},
    locale: 'en',
    timeZone: 'America/Denver',
    deletePlannerItem: () => {},
    dismissOpportunity: () => {},
    ariaHideElement: document.createElement('div')
  };
}

it('renders the base component correctly with two buttons and a tray', () => {
  const wrapper = shallow(
    <PlannerHeader {...defaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('toggles the new item tray', () => {
  const wrapper = mount(
    <PlannerHeader {...defaultProps()} />
  );
  const button = wrapper.find('[children="Add To Do"]');
  button.simulate('click');
  expect(wrapper.find('Tray').props().isOpen).toEqual(true);
  button.simulate('click');
  expect(wrapper.find('Tray').props().isOpen).toEqual(false);
});

it('sends focus back to the add new item button', () => {
  const wrapper = mount(
    <PlannerHeader {...defaultProps()} />
  );
  wrapper.instance().toggleUpdateItemTray();
  const btn = wrapper.instance().addNoteBtn;
  wrapper.instance().noteBtnOnClose();
  expect(btn.focused).toBe(true);
});

it('calls getOpportunities when component is mounted', () => {
  let tempProps = defaultProps();
  const mockDispatch = jest.fn();
  tempProps.getOpportunities = mockDispatch;
  mount(
    <PlannerHeader {...tempProps} />
  );
  expect(tempProps.getOpportunities).toHaveBeenCalled();
});

it('toggles aria-hidden on the ariaHideElement when opening the opportunities popover', () => {
  const fakeElement = document.createElement('div');
  const wrapper = mount(
    <PlannerHeader {...defaultProps()} ariaHideElement={fakeElement} />
  );
  const button = wrapper.find('PopoverTrigger').find('Button');
  button.simulate('click');
  expect(fakeElement.getAttribute('aria-hidden')).toBe('true');
  button.simulate('click');
  expect(fakeElement.getAttribute('aria-hidden')).toBe(null);
});

it('toggles aria-hidden on the ariaHideElement when opening the add to do item tray', () => {
  const fakeElement = document.createElement('div');
  const wrapper = mount(
    <PlannerHeader {...defaultProps()} ariaHideElement={fakeElement} />
  );

  const button = wrapper.find('IconPlusLine').parent();

  button.simulate('click');
  expect(fakeElement.getAttribute('aria-hidden')).toBe('true');
  button.simulate('click');
  expect(fakeElement.getAttribute('aria-hidden')).toBe(null);
});

it('renders the tray with the name of an existing item when provided', () => {
  const wrapper = shallow(
    <PlannerHeader {...defaultProps()} />
  );

  wrapper.setState({ updateTodoItem: { title: 'abc' }});
  expect(wrapper.find('Tray').prop('label')).toBe('Edit abc');
});
