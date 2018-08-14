import React from 'react';
import 'font-awesome/css/font-awesome.min.css';

import { PrintingState } from '../../helper/productState';
import { setContent, setEmpty, setTable } from '../../functions/jsx/printing';

import Config from '../../Config';
import { setUrl } from '../../functions/setUrl';
import mainModelInstance from '../../model/mainModel';
import productModelInstance from '../../model/productModel';
import ProductModel from '../../model/productModel';
import Busy from '../dumb/Busy.jsx';
import Title from '../dumb/Title.jsx';
import PrintingAdd from '../modal/PrintingAdd.jsx';

export default class Printings extends React.Component {
  constructor(props){
    super(props);
    this.mainModel = mainModelInstance;
    this.model = productModelInstance();
    this.state = PrintingState;
  }

  componentDidMount() {
    this.checkPrintings();
    this.setState({ inSearch: true });
  }

  componentDidUpdate() {
    if (this.state.saveFile) {
      this.saveFile();
    } else if (this.state.setTimeout) {
      this.setTimeout();
    }
  }
  componentWillUsetEmptypdate(nextProps, nextState) {
    if (nextState.saveFile) {
      this.setState({ saveFile: false });
    } else if (nextState.setTimeout) {
      this.setState({ setTimeout: false });
    }
  }

  checkPrintings() {
    this.model.getPrintings()
      .then((response) => {
        if (response.status === 200 && response.data.success) {
          let data = {
            deliveryList: response.data.deliveryList,
            list: response.data.list || null,
            empty: response.data.empty,
            emptyDelivery: response.data.emptyDelivery || null
          };
          this.props.handle(data);
        } else {
          throw new Error(response.data.reason);
        }
      })
      .catch((err) => this.mainModel.setMessage('warning', err.message))
      .finally(() => this.setState({ inSearch: false }));
  }

  closeModal() {
    this.setState({ modal: false });
  }
  deleteHandler(id) {
    this.model.deletePrinting(id)
      .then((response) => {
        let action = response.data.success  ? 'success' : 'warning';
        this.mainModel.setMessage(action, response.data.reason);
        if (response.data.success) {
          this.props.getPrintings();
        }
      })
      .catch((err) => this.mainModel.setMessage('warning', err.reason));
  }
  fileSelectedHandler = event => {
    let files = event.target.files;
    if (files.length > 1) {
      this.mainModel.setMessage('warning', Config.message.products.oneFileOnly);
    } else {
      this.setState({ file: files[0], modal: true });
    }
  }
  saveFile = () => {
    const fd = new FormData();
    fd.append('file[]', this.state.file, this.state.file.name);
    this.model.saveFile(this.state.description, fd)
      .then((response) => {
        let type = response.data.success  ? 'success' : 'warning';
        this.setMessage(type, response.data.reason);
      })
      .catch((err) =>this.setMessage('warning', err.reason));
  };
  setDescription = event => {
    let saveDisable = value.length < 4;
    this.setState({ description: event.target.value, saveDisable: saveDisable });
  }
  setMessage(type, message) {
    this.setState({ messageContent: message, messageType: type, setTimeout: true });
  }
  setSaveFile = () => {
    this.setState({ disabled: true, saveFile: true });
  }
  setTimeout() {
    setTimeout(() => {
      this.closeModal();
      this.props.getPrintings();
    }, Config.timer);
  }

  render() {
    let data = this.props.data || {};
    if (this.state.inSearch) {
      return <Busy title={Config.message.printingsSearch} />;
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
            value={Config.message.products.chooseFile}
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
            message={Config.message}
            messageContent={this.state.messageContent}
            messageType={this.state.messageType}
            save={this.setSaveFile.bind(this)}
            saveDisable={this.state.saveDisable}
            show={this.state.modal}
          />
        );
      }
      if (data.empty) {
        return setEmpty(Config.message, inputs, modal);
      } else if (data.list) {
        return setTable(data.list, this.deleteHandler, this, inputs, modal);
      } else {
        return <Title title={Config.message.products.printingsLoading} />;
      }
    }
  }
}
