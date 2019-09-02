export class Tuple {
  private showValue: String;
  private selectValue: any;

  constructor(show: String, select: any) {
    this.showValue = show;
    this.selectValue = select;
  }

  get show(): String {
    return this.showValue;
  }

  set show(val: String) {
    this.showValue = val;
  }

  get select(): any {
    return this.selectValue;
  }

  set select(val: any) {
    this.selectValue = val;
  }

  toString() {
    return this.showValue + this.selectValue;
  }
}
