import Line from './line';

export default class Lines {
  lines: Line[];
  token: string;
  skip: boolean;
  mostMatches: number;

  constructor(text: string[], token: string) {
    this.token = token;
    this.lines = text.map(line => new Line(line, token));
    this.skip = this.lines.length > 0;
    this.mostMatches = this.getMostMatches();
  }

  checkSomeMatches() {
    return this.lines.some(line => !line.skip);
  }

  getMostMatches() {
    return Math.max(...this.lines.map(line => line.matches.length));
  }

  align() {
    // don't align if no lines have matches
    if (!this.skip) return this;

    // align all possible matches
    // if a Line doesn't have a specific match, it will skip
    for (let i = 0; i < this.mostMatches; i++) {
      const highest = this.getHighestIndex(i);
      // only align non-skip lines
      this.lines
        .filter(line => !line.skip)
        .forEach(line => line.alignMatch(i, highest));
      // re-initialize lines so indices match the new modified text
      this.lines = this.lines.map(line => new Line(line.text, this.token));
    }
    return this;
  }

  getHighestIndex(matchIndex: number): number {
    return Math.max(
      ...this.lines.map(line => line.getIndexForMatch(matchIndex))
    );
  }

  join(connector: string) {
    return this.lines.map(line => line.text).join(connector);
  }
}
