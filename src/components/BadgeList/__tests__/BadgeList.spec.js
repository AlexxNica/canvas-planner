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
import BadgeList from '../index';
import Pill from 'instructure-ui/lib/components/Pill';

it('renders Pill components as list items', () => {
  const wrapper = shallow(
    <BadgeList>
      <Pill text="Pill 1" />
      <Pill text="Pill 2" />
      <Pill text="Pill 3" />
    </BadgeList>
  );
  expect(wrapper).toMatchSnapshot();
});
