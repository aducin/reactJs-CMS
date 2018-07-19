import React from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

import Helper from '../../helper/Helper.jsx';
import { setUrl } from '../../helper/functions.js';

import Busy from '../dumb/Busy.jsx';
import Title from '../dumb/Title.jsx';
import PrintingAdd from '../modal/PrintingAdd.jsx';

const styles = {
  padding15px: {paddingTop: '15px'}
};

export default class Printings extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      description: '',
      disabled: false,
      file: null,
      messageContent: null,
      messageType: null,
      modal: false,
      saveDisable: true
    }
  }

  closeModal() {
    this.setState({
      modal: false
    });
  }

  deleteHandler(id) {
    let url = setUrl('pathProducts', 'printing');
    url +=  '/' + id + '/' + this.props.token;
    axios.delete(url)
      .then((response) => {
        let action = response.data.success  ? 'setSuccess' : 'setError';
        this.props[action](response.data.reason);
        if (response.data.success) {
          this.props.getPrintings();
        }
      })
      .catch((err) =>{
        this.setError(err.reason);
      });
  }

  fileSelectedHandler = event => {
    let files = event.target.files;
    if (files.length > 1) {
      this.props.setError(this.props.message.products.oneFileOnly);
    } else {
      this.setState({
        file: files[0],
        modal: true
      });
    }
  }

  saveFile = () => {
    this.setState({
      disabled: true
    }, () => {
      let url = setUrl('pathProducts', 'printing');
      url += '/' + this.props.token + '?description=' + this.state.description;
      const fd = new FormData();
      fd.append('file[]', this.state.file, this.state.file.name);
      axios.post(url, fd)
        .then((response) => {
          let type = response.data.success  ? 'success' : 'warning';
          this.setMessage(type, response.data.reason);
        })
        .catch((err) =>{
          this.setMessage('warning', err.reason);
        });
    });
  }

  setDescription = event => {
    let value = event.target.value;
    let saveDisable = value.length < 4;
    this.setState({
      description: value,
      saveDisable: saveDisable
    });
  }

  setMessage(type, message) {
    this.setState({
      messageContent: message,
      messageType: type
    }, () => {
      setTimeout(() => {
        this.setState({
          disabled: false,
          messageContent: null,
          messageType: null
        }, () => {
          this.closeModal();
          this.props.getPrintings();
        });
      }, 3000);
    });
  }

  render() {
    let data = this.props.data || {};
    let text = this.props.message;
    if (this.props.inSearch) {
      return (
        <Busy title={text.printingsSearch} />
      );
    } else {
      let modal;
      let inputs = (
        <div>
          <input
            type="file"
            style={{display: 'none'}}
            onChange={ this.fileSelectedHandler }
            ref={fileInput => this.fileInput = fileInput}
          />
          <input
            class="form-control btn btn-primary"
            type="button"
            value={text.products.chooseFile}
            onClick={() => this.fileInput.click()}
          />
        </div>
      );
      if (this.state.modal) {
        modal = (
          <PrintingAdd
            close={this.closeModal.bind(this)}
            description={this.state.description}
            descriptionChangeHandler={this.setDescription.bind(this)}
            disabled={this.state.disabled}
            file={this.state.file.name}
            message={text}
            messageContent={this.state.messageContent}
            messageType={this.state.messageType}
            save={this.saveFile.bind(this)}
            saveDisable={this.state.saveDisable}
            show={this.state.modal}
          />
        );
      }
      if (data.empty) {
        return (
          <div class="container">
            <div class="col-xs-12 col-md-10">
              <h3>{text.noPrintings}</h3>
            </div>
            <div class="col-xs-12 col-md-2 marginTop15px paddingBottomResp">
              {inputs}
              {modal}
            </div>
          </div>
        )
      } else if (data.list) {
        let title = text.labels.printings;
        let head = Helper.createTableHead(['Lp.', 'Nazwa', 'Opis', 'Data', 'Akcja']);
        let list = data.list.map((el, index) => {
          let linkPath = this.props.url.filePath + 'printing/' + el.id + '/' + el.name;
          return (
            <tr key={ index } class="textCentered">
              <td style={styles.padding15px}>{index + 1}</td>
              <td style={styles.padding15px}><a href={linkPath} target="blank">{el.name}</a></td>
              <td style={styles.padding15px}>{el.description}</td>
              <td style={styles.padding15px}>{el.createdTime}</td>
              <td>
                <div class="col-xs-6 pull-left marginTop7px">
                  <a href={linkPath} download><i class="fa fa-download" aria-hidden="true"></i></a>
                </div>
                <div class="col-xs-6 pull-left marginTop7px">
                  <i onClick={ this.deleteHandler.bind(this, el.id) } class="fa fa-trash cursorPointer" aria-hidden="true"></i>
                </div>
              </td>
            </tr>
          )
        });
        let table = Helper.setTable(title, head, list);
        return (
          <div class="container bgrContent paddingBottom2 marginTop2 borderRadius10">
            <div class="col-xs-12 col-md-2 marginTop15px">
              {inputs}
              {modal}
            </div>
            {table}
          </div>
        )
      } else {
        return (
          <Title title={text.products.printingsLoading} />
        )
      }
    }
  }
}
