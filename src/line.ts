export default class Line {
  text: string;
  token: RegExp;
  matches: RegExpExecArray[];
  lowestIndex: number;
  highestIndex: number;
  skip: boolean;
  empty: boolean;

  constructor(text: string, token: string) {
    this.text = text;
    // convert string token into a regex
    // Separate each letter of the token in brackets to avoid regex special character conflict (such as |)
    this.token = new RegExp(`[${token.split('').join('][')}]`, 'g');
    this.skip = false;
    this.empty = /^\s*$/.test(text);
    this.matches = this.getTokenMatches();
    this.lowestIndex = this.getLowestIndex();
    this.highestIndex = this.getHighestIndex();
  }

  getTokenMatches() {
    if (this.empty) return [];
    let match;
    let matches = [];
    while ((match = this.token.exec(this.text)) !== null) {
      matches.push(match);
    }
    if (matches.length === 0) {
      this.skip = true;
    }
    return matches;
  }

  getLowestIndex() {
    const lowest = Math.min(...this.matches.map(m => m.index));
    return lowest === Infinity ? 0 : lowest;
  }

  getHighestIndex() {
    const highest = Math.max(...this.matches.map(m => m.index));
    return highest === -Infinity ? 0 : highest;
  }

  getIndexForMatch(matchIndex: number): number {
    const match = this.matches[matchIndex];
    return match === undefined ? 0 : match.index;
  }

  alignMatch(matchIndex: number, finalPosition: number) {
    // if no matches, skip
    if (this.skip) return this;

    // if match doesn't exist, skip
    const match = this.matches[matchIndex];
    if (!match) return this;

    const startIndex = match.index;
    const front = this.text.slice(0, startIndex);
    const back = this.text.slice(startIndex);
    const spaces = ' '.repeat(finalPosition - startIndex);
    this.text = front + spaces + back;
    return this;
  }
}
