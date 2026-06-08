import { pa1 } from "./core";

const _resolve = Promise.resolve;

export function chann() {
  return new Chann();
}

export function isChann(x) {
  return x instanceof Chann;
}

export function push(chann, value) {
  return chann._push(value);
}

export function pop(chann) {
  return chann._pop();
}

export function close(chann) {
  return chann._close();
}

export function isClosed(chann) {
  return chann._closed;
}

export async function alt(...channs) {
  const { length } = channs;
  const offset = Math.random() * length | 0
  for (let i = 0; i < length; ++i) {
    const c = channs[(i + offset) % length];
    if (c._senders.size > 0) {
      const send = c._senders.values().next().value;
      c._senders.delete(send);

      const [value, resolve] = send;
      resolve();
      return _resolve(value);
    }
  }

  let recv;
  try {
    return await new Promise((resolve, reject) => {
      recv = [resolve, reject];
      for (const c of channs) {
        c._receivers.add(recv);
      }
    });
  } finally {
    for (const c of channs) {
      c._receivers.delete(recv);
    }
  }
}

export function connectWorker(worker) {
  const input = chann();
  const output = chann();
  const error = chann();

  worker.addEventListener("message", pa1(push, output));
  worker.addEventListener("error", pa1(push, error));
  worker.addEventListener("messageerror", pa1(push, error));
  (async () => {
    for (; ;) {
      const value = await pop(input);
      worker.postMessage(value);
    }
  })();

  return { input, output, error };
}

export class Chann {
  constructor() {
    this._closed = false;
    this._senders = new Set();
    this._receivers = new Set();
  }

  _push(value) {
    const { _receivers } = this;

    if (_receivers.size > 0) {
      const recv = _receivers.values().next().value;
      _receivers.delete(recv);

      const [resolve] = recv;
      resolve(value);
      return _resolve();
    }
    return new Promise((resolve, reject) => {
      this._senders.add([value, resolve, reject]);
    });
  }

  _pop() {
    const { _senders } = this;

    if (_senders.size > 0) {
      const send = _senders.values().next().value;
      _senders.delete(send);

      const [value, resolve] = send;
      resolve();
      return _resolve(value);
    }

    return new Promise((resolve, reject) => {
      this._receivers.add([resolve, reject]);
    });
  }

  _close() {
    this._closed = true;
    this._senders.forEach(([, , reject]) => reject(Error("chann closed")));
    this._receivers.forEach(([, reject]) => reject(Error("chann closed")));
    this._senders.clear();
    this._receivers.clear();
    this._push = _throwClosedError;
    this._pop = _throwClosedError;
  }

  static fromPromise(promise) {
    const c = chann();
    (async () => {
      try {
        const value = await promise;
        push(c, value);
      } finally {
        close(c);
      }
    })();
    return c;
  }
}

function _throwClosedError() {
  throw Error("chann closed");
}
