import {EventEmitter} from 'events';
import AppDispatcher from '../app-dispatcher';

class DialogStore extends EventEmitter {
  constructor() {
    super();

    AppDispatcher.register((payload) => {
      switch (payload.actionType) {
        case 'open-construct-dialog':
          const {callback, text, constructs} = payload;
          this.emit('open-construct-dialog', callback, text, constructs);
          break;
      }
    });
  }

  addRequestConstructDialogListener(callback) {
    this.on('open-construct-dialog', callback);
  }

  removeRequestConstructDialogListener(callback) {
    this.removeListener('open-construct-dialog', callback);
  }
}

export default new DialogStore();
