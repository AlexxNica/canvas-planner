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
import {func, shape} from 'prop-types';

function getDisplayName (WrappedComponent) {
  return `Animatable(${WrappedComponent.displayName})`;
}

// Components passed to registerAnimatable that the manager uses must provide this interface:
// - getFocusable() returns anything that has a `focus()` method, DOM element or otherwise
// - getScrollable() must return a DOM element
export function animatable(WrappedComponent) {
  return class Animatable extends React.Component {
    static displayName = getDisplayName(WrappedComponent);

    static contextTypes = {
      dynamicUiManager: shape({
        registerAnimatable: func,
      }),
    }

    registerAnimatable = (type, component, index, itemIds) => {
      // This should be required, but I don't want tests to have to muck with wrapping their stuff
      // in a DynamicUiProvider
      if (!this.context.dynamicUiManager) return;
      this.context.dynamicUiManager.registerAnimatable(type, component, index, itemIds);
    }

    render () {
      return <WrappedComponent {...this.props} registerAnimatable={this.registerAnimatable} />;
    }
  };
}
