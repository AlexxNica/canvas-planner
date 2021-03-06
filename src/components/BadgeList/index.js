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
import React, { Children, Component } from 'react';
import themeable from 'instructure-ui/lib/themeable';
import CustomPropTypes from 'instructure-ui/lib/util/CustomPropTypes';
import Pill from 'instructure-ui/lib/components/Pill';

import styles from './styles.css';
import theme from './theme.js';

class BadgeList extends Component {

  static propTypes = {
    children: CustomPropTypes.Children.oneOf([Pill])
  }

  renderChildren () {
    return Children.map(this.props.children, (child) => {
      return (
        <li className={styles.item}>
          {child}
        </li>
      );
    });
  }

  render () {
    return (
      <ul className={styles.root}>
        {this.renderChildren()}
      </ul>
    );
  }
}

export default themeable(theme, styles)(BadgeList);
