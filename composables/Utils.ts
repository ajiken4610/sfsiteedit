export class Synchronizer {
  _tasks: unknown[] = [];

  /**
   * 関数を渡された順にロックして実行します。
   * @param func 実行する関数。Promiseを返すと、awaitします。
   */
  async synchronized(func: () => unknown) {
    if (this._tasks.length > 0) {
      let promise = (async function (synchronizer) {
        await synchronizer._tasks[synchronizer._tasks.length - 1];
        await func();
        synchronizer._tasks = synchronizer._tasks.filter(
          (task) => task !== promise
        );
      })(this);
      this._tasks.push(promise);
      await promise;
    } else {
      let promise = func();
      this._tasks.push(promise);
      await promise;
      this._tasks = this._tasks.filter((task) => task !== promise);
    }
  }
}

// awaitでスリープを実現するクラス。synchronizerのお供に使うといい感じ
export class Sleeper {
  static sleep(ms: number, callback?: () => unknown) {
    let promise = new Promise((resolve) => setTimeout(resolve, ms));
    promise.then(() => {
      if (callback) callback;
    });
    return promise;
  }
}

// BiGramに分割したりするクラス。別に特筆することはない
export class BiGram {
  static splitBy(text: string, separators: string) {
    for (let i = 1; i < text.length; i++) {
      text = text.replace(separators[i], separators[0]);
    }
    return text.split(separators[0]);
  }

  // ビグラムをオブジェクトで作成
  static createBiGramObject(text: string, separators?: string) {
    if (separators) {
      return this.createBiGramObjectFromTexts(this.splitBy(text, separators));
    } else {
      let returnObject: { [key: string]: true } = {};
      for (let i = 0; i < text.length - 1; i++) {
        const current = text.substring(i, i + 2);
        if (!current.match(/[\.\[\]\*\n`]/) && current.length === 2)
          returnObject[current] = true;
      }
      return returnObject;
    }
  }

  // ビグラムを配列で作成
  static createBiGramArray(text: string, separators?: string) {
    return Object.keys(this.createBiGramObject(text, separators));
  }

  static createBiGramObjectFromTexts(array: string[], separators?: string) {
    let returnObject = {};
    if (separators) {
      array.forEach((text) => {
        Object.assign(
          returnObject,
          this.createBiGramObjectFromTexts(this.splitBy(text, separators))
        );
      });
    } else {
      array.forEach((text) => {
        Object.assign(returnObject, this.createBiGramObject(text));
      });
    }

    return returnObject;
  }

  static createBiGramArrayFromTexts(array: string[], separators?: string) {
    return Object.keys(this.createBiGramObjectFromTexts(array, separators));
  }
}
