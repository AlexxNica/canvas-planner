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
import React, { Component } from 'react';
import _ from 'lodash';
import themeable from 'instructure-ui/lib/themeable';
import Container from 'instructure-ui/lib/components/Container';
import FormFieldGroup from 'instructure-ui/lib/components/FormFieldGroup';
import ScreenReaderContent from 'instructure-ui/lib/components/ScreenReaderContent';
import Button from 'instructure-ui/lib/components/Button';
import formatMessage from '../../format-message';
import PropTypes from 'prop-types';
import TextInput from 'instructure-ui/lib/components/TextInput';
import Select from 'instructure-ui/lib/components/Select';
import TextArea from 'instructure-ui/lib/components/TextArea';
import DateInput from 'instructure-ui/lib/components/DateInput';
import moment from 'moment-timezone';

import styles from './styles.css';
import theme from './theme.js';

export class UpdateItemTray extends Component {
  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      longName: PropTypes.string,
    })).isRequired,
    noteItem: PropTypes.object,
    onSavePlannerItem: PropTypes.func.isRequired,
    onDeletePlannerItem: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
  };

  constructor (props) {
    super(props);
    const updates = _.cloneDeep(props.noteItem) || {};
    if (updates.context) {
      updates.courseId = updates.context.id;
      delete updates.context;
    }
    if (!updates.date) {
      updates.date = moment.tz(props.timeZone).format();
    }
    this.state = {
      updates,
      titleMessages: [],
      dateMessages: [],
    };
  }

  handleSave = () => {
    const updates = Object.assign({}, this.state.updates);
    if (updates.courseId) {
      updates.context = { id: updates.courseId };
    }
    delete updates.courseId;
    this.props.onSavePlannerItem(updates);
  }

  handleChange = (field, value) => {
    this.setState({
      updates: {
        ...this.state.updates,
        [field]: value
      }
    });
  }

  handleCourseIdChange = (e) => {
    let value = e.target.value;
    if (value === 'none') value = undefined;
    this.handleChange('courseId', value);
  }

  handleTitleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      this.setState({
        titleMessages: [{type: 'error', text: formatMessage('title is required')}]
      });
    } else {
        this.setState({titleMessages: []});
    }
    this.handleChange('title', value);
  }

  handleDateChange = (date) => {
    const value = date;
    this.handleChange('date', value);
    if (value === '') {
      this.setState({dateMessages: [{type: 'error', text: formatMessage('date is required')}]});
    } else {
      this.setState({dateMessages: []});
    }
  }

  handleDeleteClick = () => {
    this.props.onDeletePlannerItem(this.props.noteItem);
  }

  findCurrentValue (field) {
    return this.state.updates[field] || '';
  }

  isValid () {
    if (this.state.updates.title && this.state.updates.date) {
      return this.state.updates.title.replace(/\s/g, '').length > 0;
    }
    return false;
  }

  renderDeleteButton () {
    if (this.props.noteItem == null) return;
    return <Button
      variant="light"
      margin="0 x-small 0 0"
      onClick={this.handleDeleteClick}>
      {formatMessage("Delete")}
    </Button>;
  }

  renderSaveButton () {
    return <Button
      variant="primary"
      margin="0 0 0 x-small"
      disabled={!this.isValid()}
      onClick={this.handleSave}>
        {formatMessage("Save")}
    </Button>;
  }

  renderTitleInput () {
    const value = this.findCurrentValue('title');
    return (
      <TextInput
        label={formatMessage("Title")}
        value={value}
        messages={this.state.titleMessages}
        onChange={this.handleTitleChange}
      />
    );
  }

  renderDateInput () {
    let startingDate = moment.tz(this.props.timeZone).format();
    if (this.props.noteItem) {
      startingDate = this.props.noteItem.date || startingDate;
    }
    return (
      <DateInput
        label={formatMessage("Date")}
        nextLabel={formatMessage("Next Month")}
        previousLabel={formatMessage("Previous Month")}
        locale={this.props.locale}
        timeZone={this.props.timeZone}
        placement="start"
        defaultDateValue={startingDate}
        onDateChange={this.handleDateChange}
      />
    );
  }

  renderCourseSelectOptions () {
    if (!this.props.courses) return [];
    return this.props.courses.map(course => {
      return <option key={course.id} value={course.id}>{course.longName}</option>;
    });
  }

  renderCourseSelect () {
    let courseId = this.findCurrentValue('courseId');
    if (courseId == null) courseId = 'none';
    return (
      <Select
        label={formatMessage("Course")}
        value={courseId}
        onChange={this.handleCourseIdChange}
      >
        <option value="none">{formatMessage("Optional: Add Course")}</option>
        {this.renderCourseSelectOptions()}
      </Select>
    );
  }

  renderDetailsInput () {
    const value = this.findCurrentValue('details');
    return (
      <TextArea
        label={formatMessage("Details")}
        height="10rem"
        autoGrow={false}
        value={value}
        onChange={(e) => this.handleChange('details', e.target.value)}
      />
    );
  }

  renderTrayHeader () {
    if (this.props.noteItem) {
      return (
        <h2>{formatMessage('Edit {title}', { title: this.props.noteItem.title })}</h2>
      );
    } else {
      return (
        <h2>{formatMessage("Add To Do")}</h2>
      );
    }
  }

  render () {
    return (
      <div className={styles.root}>
        <Container
          as="div"
          padding="large medium medium"
        >
          <FormFieldGroup
            rowSpacing="small"
            description={
              <ScreenReaderContent>
                {this.renderTrayHeader()}
              </ScreenReaderContent>
            }
          >
            {this.renderTitleInput()}
            {this.renderDateInput()}
            {this.renderCourseSelect()}
            {this.renderDetailsInput()}
          </FormFieldGroup>
          <Container as="div" margin="small 0 0" textAlign="end">
            {this.renderDeleteButton()}
            {this.renderSaveButton()}
          </Container>
        </Container>
      </div>
    );
  }
}

export default themeable(theme, styles)(UpdateItemTray);
