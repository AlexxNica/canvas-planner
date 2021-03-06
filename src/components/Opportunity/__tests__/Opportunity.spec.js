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
import { shallow } from 'enzyme';
import { Opportunity } from '../index';

function defaultProps (option) {
  return {
    id: "1",
    dueAt: "2017-03-09T20:40:35Z",
    courseName: "course about stuff",
    opportunityTitle: "this is a description about the opportunity",
    points: 20,
    url: "http://www.non_default_url.com",
    timeZone: 'America/Denver',
    dismiss: () => {},
  };
}

it('renders the base component correctly', () => {
  const wrapper = shallow(
    <Opportunity {...defaultProps()} />
  );
  expect(wrapper).toMatchSnapshot();
});

it('calls the onClick prop when dismissed is clicked', () => {
  let tempProps = defaultProps();
  tempProps.dismiss = jest.fn();
  const wrapper = shallow(
    <Opportunity {...tempProps}/>
  );
  wrapper.find('Button').simulate('click');
  expect(tempProps.dismiss).toHaveBeenCalled();
});

it('renders the base component correctly without points', () => {
  let tempProps = defaultProps();
  tempProps.points = null;
  const wrapper = shallow(
    <Opportunity {...tempProps} />
  );
  expect(wrapper).toMatchSnapshot();
});
