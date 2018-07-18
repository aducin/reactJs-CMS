import React from 'react';
import { Router, Route, IndexRoute, browserHistory, hashHistory } from 'react-router';
import { connect } from 'react-redux';

import store from '../store';
import * as customer from '../actions/customerActions.jsx';
import Busy from '../components/dumb/Busy.jsx';
import Config from '../Config';
import Header from '../components/dumb/Header.jsx';
import Message from '../components/dumb/Message.jsx';
import CustomerDetails from '../components/customer/CustomerDetails.jsx';
import CustomerHeader from '../components/customer/CustomerHeader.jsx';
import CustomerDelete from '../components/modal/CustomerDelete.jsx';
import CustomerModel from '../model/customerModel.js';
import { State } from '../helper/customerState';
import { validateEmail } from '../helper/validator';

@connect((store) => {
  return { customer: store.customer };
})

export default class CustomerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = State;
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.approved && nextProps.token) {
      if (nextProps.params.email !== undefined && nextProps.params.email !== nextState.curAddress) {
        this.setState({
          action: 'search',
          curAddress: nextProps.params.email,
          inProgress: true
        });
      } else if (nextProps.params.email === undefined && nextState.curAddress !== undefined) {
        this.setState({
          action: null,
          curAddress: undefined
        });
      } else if (nextState.action) {
        this.setAction(nextState);
      }
    }
  }

  emailAction(action) {
    this.setState({
      action: 'email',
      emailAction: action,
      inProgress: true
    });
  }
  searchCustomer() {
    CustomerModel.getCustomerByEmail(this.state.curAddress, this.props.token)
      .then((response) => {
        if (response.data.success) {
          store.dispatch(customer.setData(response.data));
        } else {
          throw new Error(response.data.reason);
        }
      })
      .catch((err) =>{
        let message = err.message || Config.message.error;
        this.props.setWarning(message);
      })
      .finally(() => {
        this.setState({
          action: null,
          inProgress: false
        });
      });
  }
  sendEmail(action) {
    CustomerModel.sendCustomerEmail(this.state.emailAction, this.state.curAddress, this.props.token)
      .then((response) => {
        if (response.data.success) {
          this.props.setSuccess(response.data.reason);
        } else {
          throw new Error(response.data.reason);
        }
      })
      .catch((err) =>{
        let message = err.message || Config.message.error;
        this.props.setWarning(message);
      })
      .finally(() =>{
        this.setState({
          emailAction: null,
          inProgress: false
        });
      });
  }
  setAction(state) {
    if (state.action === 'search' && state.curAddress) {
      this.searchCustomer();
    } else if (state.action === 'email') {
      this.sendEmail(state.emailAction);
    }
  }
  setAddress(e) {
    let value = e.target.value;
    let emailCheck = validateEmail(value);
    let address = {
      text: value,
      valid: emailCheck
    };
    this.setState({
      address: address
    });
  }
  setModal(bool) {
    this.setState({
      showModal: bool
    });
  }
  setUrl() {
    let url = Config.url.path + Config.url.pathSuffix + Config.url.pathCustomers + '/' + this.state.address.text;
    window.location.href = url;
  }

  render() {
    let empty = this.props.customer.empty;
    let busy, customerDetails, customerHeader, header, message, messageStyle, modal;
    if (this.props.success) {
      messageStyle = "alert alert-success alertHeight textAlignCenter";
    } else if (this.props.error) {
      messageStyle = "alert alert-danger alertHeight textAlignCenter";
    }
    if (this.props.approved) {
      header = (
        <div class="height12">
          <Header
            active="customers"
            buttonHandler={this.props.logoutHandler.bind(this)}
            disable={this.state.disable}
            fields={Config.fields}
          />
        </div>
      );
      message = (
        <Message
          message={this.props.toDisplay}
          messageStyle={messageStyle}
        />
      );
      customerHeader = (
        <CustomerHeader
          address={this.state.address}
          disable={this.state.inProgress}
          message={Config.message}
          searchCustomer={this.setUrl.bind(this)}
          setAddress={this.setAddress.bind(this)}
        />
      );
      if (this.state.inProgress) {
        busy = <Busy title={Config.message.loading} />;
      }
      if (!this.state.inProgress) {
        customerDetails = (
          <CustomerDetails
            address={this.state.curAddress}
            data={this.props.customer}
            delete={this.setModal.bind(this, true)}
            disable={this.state.inProgress}
            empty={empty}
            message={Config.message}
            send={this.emailAction.bind(this)}
            token={this.props.token}
            url={Config.url}
          />
        );
      }if (this.state.showModal) {
        modal = (
          <CustomerDelete
            close={this.setModal.bind(this, false)}
            message={Config.message}
          />
        );
      }

    }
    return(
      <div>
        {header}
        {message}
        {customerHeader}
        {busy}
        {customerDetails}
        {modal}
      </div>
    );
  }
}