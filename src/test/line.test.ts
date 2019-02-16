// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import Line from '../line';

// Defines a Mocha test suite to group tests of similar kind together
suite('Line', function() {
  test('gets all matches of a token', () => {
    const line = new Line('testing', 't');
    const actual = line.matches.map(match => match.index);
    const expected = [0, 3];
    assert.deepEqual(actual, expected);
  });

  test('gets lowest match', () => {
    const line = new Line('testing', 't');
    const actual = line.lowestIndex;
    const expected = 0;
    assert.equal(actual, expected);
  });

  test('gets highest match', () => {
    const line = new Line('testing', 't');
    const actual = line.highestIndex;
    const expected = 3;
    assert.equal(actual, expected);
  });

  test('handles no matches, lowest', () => {
    const line = new Line('testing', 'q');
    const actual = line.lowestIndex;
    const expected = 0;
    assert.equal(actual, expected);
  });

  test('handles no matches, highest', () => {
    const line = new Line('testing', 'q');
    const actual = line.highestIndex;
    const expected = 0;
    assert.equal(actual, expected);
  });

  test('s', () => {
    const text = '    | a | b | c |';
    const line = new Line(text, '|');
    assert.equal(line.matches.length, 4);
  });

  suite('alignMatch', () => {
    test('no effect for no matches', () => {
      const line = new Line('testing', 'q');
      const actual = line.alignMatch(1, 5).text;
      const expected = 'testing';
      assert.equal(actual, expected);
    });

    test('adds space before chosen match', () => {
      const line = new Line('testing', 't');
      const actual = line.alignMatch(1, 5).text;
      const expected = 'tes  ting';
      assert.equal(actual, expected);
    });

    test('adds space before first match', () => {
      const line = new Line('testing', 't');
      const actual = line.alignMatch(0, 5).text;
      const expected = '     testing';
      assert.equal(actual, expected);
    });

    test('skips if index is too high', () => {
      const line = new Line('testing', 't');
      const actual = line.alignMatch(2, 5).text;
      const expected = 'testing';
      assert.equal(actual, expected);
    });

    test('skips if already in position', () => {
      const line = new Line('testing', 't');
      const actual = line.alignMatch(1, 3).text;
      const expected = 'testing';
      assert.equal(actual, expected);
    });
  });
});
