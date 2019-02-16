const MSG_NO_REPEATED_TOKENS = "there were substrings that were present in all lines of the selection. For alignment to work, make sure each line has a repeated string";
// const MSG_NO_STANDARD_TOKENS = "there were no `:` or `=` characters found in every line of the selection.";

export class AlignmentToken {
  string: string;
  positions: number[];
  lowestIndex: number;
  highestIndex: number;
  /**
   * Basic structure to store references to alignment tokens
   * @param {*} string the string that designates the token
   * @param {*} positions an array of integers which represent the indexes at which the token occurs in each line of the selection
   */
  constructor(string: string, positions: number[]) {
    this.string = string;
    this.positions = positions;
    this.lowestIndex = Math.min(...positions);
    this.highestIndex = Math.max(...positions);

    this.setPositions = this.setPositions.bind(this);
  }

  setPositions(positions: number[]) {
    this.positions = positions;
    this.lowestIndex = Math.min(...positions);
    this.highestIndex = Math.max(...positions);
  }
}

/**
 * 
 * @param {*} string 
 * @param {*} originalPosition the position the token is currently in the string
 * @param {*} finalPosition the position the token should be plae
 */
export function alignToken(string: any, originalPosition: any, finalPosition: any) {
  const front = string.slice(0, originalPosition);
  const back = string.slice(originalPosition);
  const spaces = " ".repeat(finalPosition - originalPosition);
  return front + spaces + back;
}

/**
 * 
 * @param {*} text 
 * @param {AlignmentToken} token 
 * @return {Array} positions
 */
export function calculateIndices(text: string[], token: string) {
  return text.map(line => line.indexOf(token))
}

/**
 * 
 * @param {Array<AlignmentToken>} tokenContainer
 * @param {Array<String>} searchTerms terms to search for
 * @param {Array<String>} lines strings to be searched
 */
export function addTokens(tokenContainer: AlignmentToken[], searchTerms: string[], lines: string[]) {
  searchTerms.forEach(term => {
    if (lines.every(line => line.includes(term))) {
      tokenContainer.push(new AlignmentToken(
        term,
        calculateIndices(lines, term)
      ));
    }
  });
}