import { Line } from '../Line/mod.ts';

export type TextComponent = Text;

export class Text {
  protected parentLines: Line[] = [];
  protected watchTower: (string | symbol)[] = [];

  constructor (
    protected _renderedText: string = ''
  ) {
    return new Proxy(this, {
      set: (target, key, value) => {
        // @ts-ignore Proxy Set
        target[key] = value;
        if (this.watchTower.includes(key)) this.render();

        return true;
      },
      get: (target, key) => {
        if(key === 'renderedText') FunctionalText.collector?.(this);

        // @ts-ignore Proxy get
        return target[key];
      }
    });
  }

  addParentLine (line: Line) {
    if (!this.parentLines.includes(line)) this.parentLines.push(line);
    return this;
  }

  get renderedText() : string {
    return this._renderedText;
  }

  render () {
    this.parentLines.forEach(line => line.update());
  }

  toString () {
    return this.renderedText;
  }
}

export class LoadingIndicator extends Text {
  index = 0;
  id?: number;
  isCompleted = false;
  completeText = '✔';

  constructor (
    protected indicators: string[] = ['⠙', '⠸', '⠴', '⠦' , '⠇', '⠋'],
    protected updateInterval: number = 200
  ) {
    super();
    this.watchTower.push('index', 'isCompleted');

    this.next();
    this.start();
  }

  start () {
    this.id = setInterval(() => this.next(), this.updateInterval);
  }

  next () {
     this.index++;
    if(this.index >= this.indicators.length) this.index = 0;
  }

  get renderedText (): string {
    return (this.isCompleted && this.completeText) ? this.completeText : this.indicators[this.index];
  }

  complete () {
    this.isCompleted = true;
    this.stop();
  }

  stop () {
    this.id && clearInterval(this.id);
    this.id = undefined;
  }
}

export class FunctionalText extends Text {
  static collector: null | ((instance: Text) => void);

  constructor (line: Line, protected renderFunction: () => string) {
    super();
    FunctionalText.collector = (instance) => instance.addParentLine(line);
    renderFunction()
    FunctionalText.collector = null;
  }

  get renderedText(): string {
      return this.renderFunction();
  }
}

export class ProgressBar extends Text {

  constructor (
    public value: number,
    public max: number,
    protected width: number = 50,
    protected option: {
      filled: string,
      empty: string
    } = {
      filled: '=',
      empty: '-'
    }
  ) {
    super();

    this.watchTower.push('value', 'max');
  }

  get renderedText(): string {
    const filledCount = Math.min(this.width, Math.round(this.value / this.max * this.width));
    const emptyCount = this.width - filledCount;
    return `${this.option.filled.repeat(filledCount)}${this.option.empty.repeat(emptyCount)}`;
  }
}
