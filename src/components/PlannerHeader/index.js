import React, { Component } from 'react';
import { connect } from 'react-redux';
import themeable from 'instructure-ui/lib/themeable';
import Button from 'instructure-ui/lib/components/Button';
import IconPlusLine from 'instructure-icons/lib/Line/IconPlusLine';
import IconAlertLine from 'instructure-icons/lib/Line/IconAlertLine';
import Popover, {PopoverTrigger, PopoverContent} from 'instructure-ui/lib/components/Popover';
import PropTypes from 'prop-types';
import UpdateItemTray from '../UpdateItemTray';
import Tray from 'instructure-ui/lib/components/Tray';
import Badge from 'instructure-ui/lib/components/Badge';
import Opportunities from '../Opportunities';
import {addDay, savePlannerItem, deletePlannerItem, getOpportunities, dismissOpportunity} from '../../actions';
import focusStore from '../../utilities/focusStore';

import styles from './styles.css';
import theme from './theme.js';
import formatMessage from '../../format-message';
export class PlannerHeader extends Component {

  static propTypes = {
    courses: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      longName: PropTypes.string,
    })).isRequired,
    addDay: PropTypes.func,
    savePlannerItem: PropTypes.func.isRequired,
    deletePlannerItem: PropTypes.func.isRequired,
    locale: PropTypes.string.isRequired,
    timeZone: PropTypes.string.isRequired,
    opportunities: PropTypes.array.isRequired,
    getOpportunities: PropTypes.func.isRequired,
    dismissOpportunity: PropTypes.func.isRequired,
    todo: PropTypes.object,
    ariaHideElement: PropTypes.instanceOf(Element).isRequired
  };

  constructor (props) {
    super(props);
    let opportunities = props.opportunities.filter((opportunity) => this.isOpportunityVisible(opportunity));
    this.state = {
      opportunities,
      trayOpen: false,
      opportunitiesOpen: false,
    };
  }

  componentDidMount() {
    this.props.getOpportunities();
  }

  componentWillReceiveProps(nextProps) {
    let opportunities = nextProps.opportunities.filter((opportunity) => this.isOpportunityVisible(opportunity));
    if (nextProps.todo.updateTodoItem) {
      this.setState({trayOpen: true, updateTodoItem: nextProps.todo.updateTodoItem}, () => {
        this.toggleAriaHiddenStuff(this.state.trayOpen);
      });
    }
    this.setState({opportunities});
  }

  handleSavePlannerItem = (plannerItem) => {
    this.toggleUpdateItemTray();
    this.props.savePlannerItem(plannerItem);
  }

  isOpportunityVisible = (opportunity) => {
    return opportunity.planner_override ? !opportunity.planner_override.marked_complete : true;
  }

  handleDeletePlannerItem = (plannerItem) => {
    this.toggleUpdateItemTray();
    this.props.deletePlannerItem(plannerItem);
  }

  toggleAriaHiddenStuff = (hide) => {
    if (hide) {
      this.props.ariaHideElement.setAttribute('aria-hidden', 'true');
    } else {
      this.props.ariaHideElement.removeAttribute('aria-hidden');
    }
  }

  toggleUpdateItemTray = () => {
    const trayOpen = this.state.trayOpen;
    this.setState({ trayOpen: !trayOpen }, () => {
      if (this.state.trayOpen) {
        focusStore.setItemToFocus(this.addNoteBtn);
      }
      this.toggleAriaHiddenStuff(this.state.trayOpen);
    });
  }

  toggleOpportunitiesDropdown = () => {
    this.opportunitiesButton.focus();
    this.setState({opportunitiesOpen: !this.state.opportunitiesOpen}, () => {
      this.toggleAriaHiddenStuff(this.state.opportunitiesOpen);
    });
  }

  noteBtnOnClose = () => {
    focusStore.focus();
  }

  opportunityTitle = () => {
    return (
      formatMessage(`{
        count, plural,
        =0 {# opportunities}
        one {# opportunity}
        other {# opportunities}
      }`, { count: this.state.opportunities.length })
    );
  }

  getTrayLabel = () => {
    if (this.state.updateTodoItem) {
      return formatMessage('Edit {title}', { title: this.state.updateTodoItem.title });
    }
    return formatMessage("Add To Do");
  }

  render () {
    return (
      <div className={styles.root}>
        <Button
          variant="icon"
          onClick={this.toggleUpdateItemTray}
          ref={(b) => { this.addNoteBtn = b; }}
        >
          <IconPlusLine title={formatMessage("Add To Do")} />
        </Button>
        <Popover
          onToggle={this.toggleOpportunitiesDropdown}
          show={this.state.opportunitiesOpen}
          on="click">
          <PopoverTrigger>
            <Button
              onClick={this.toggleOpportunitiesDropdown}
              variant="icon"
              ref={(b) => { this.opportunitiesButton = b; }}>
              <Badge {...this.state.opportunities.length ? {count :this.state.opportunities.length} : {}}>
                <IconAlertLine title={this.opportunityTitle()} />
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Opportunities
              togglePopover={this.toggleOpportunitiesDropdown}
              opportunities={this.state.opportunities}
              courses={this.props.courses}
              timeZone={this.props.timeZone}
              dismiss={this.props.dismissOpportunity}
            />
          </PopoverContent>
        </Popover>
        <Tray
          closeButtonLabel={formatMessage("Close")}
          isOpen={this.state.trayOpen}
          label={this.getTrayLabel()}
          placement="end"
          trapFocus={true}
          onExited={this.noteBtnOnClose}
          onRequestClose={this.toggleUpdateItemTray}
        >
          <UpdateItemTray
            locale={this.props.locale}
            timeZone={this.props.timeZone}
            noteItem={this.state.updateTodoItem}
            onSavePlannerItem={this.handleSavePlannerItem}
            onDeletePlannerItem={this.handleDeletePlannerItem}
            courses={this.props.courses}
          />
        </Tray>
      </div>
    );
  }
}

export const ThemedPlannerHeader = themeable(theme, styles)(PlannerHeader);

const mapStateToProps = ({opportunities, loading, courses, todo}) => ({opportunities, loading, courses, todo});
const mapDispatchToProps = {addDay, savePlannerItem, deletePlannerItem, getOpportunities, dismissOpportunity};

export default connect(mapStateToProps, mapDispatchToProps)(ThemedPlannerHeader);
