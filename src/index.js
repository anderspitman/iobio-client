import { request } from 'xhr-stream-dl';
import { EventEmitter } from 'events';


class Client {

  constructor(server, options) {
    const proto = options && options.secure ? 'https://' : 'http://';
    this._server = proto + server;
  }

  streamCommand(commandName, params) {
    return new Command(this._server, commandName, params);
  }
}


class Command extends EventEmitter {
  constructor(server, endpoint, params) {
    super();

    this._server = server;
    this._endpoint = endpoint;
    this._params = params;
    this._numRetries = 3;
  }

  run() {

    const query = this._server + '/' + this._endpoint;

    let numAttempts = 0;

    const attemptRequest = () => {

      let emittedSome = false;

      this._stream = request(query, {
        method: 'POST',
        params: this._params,
        contentType: 'text/plain; charset=utf-8',
      });

      this._stream.onData((data) => {
        this.emit('data', data);
        emittedSome = true;
      });
      this._stream.onEnd(() => {
        this.emit('end');
      });
      this._stream.onError((e) => {
        // If we've already emitted data, don't try to fix the stream, and emit
        // an error. Otherwise we may still be able to retry and succeed.
        if (emittedSome === true) {
          this.emit('error', e);
        }
        else if (numAttempts < this._numRetries) {
          numAttempts += 1;
          attemptRequest();
        }
      });
    }

    attemptRequest();
  }

  cancel() {
    this._stream.cancel();
  }
}


export {
  Client,
};
