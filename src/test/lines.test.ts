import * as assert from 'assert';
import Lines from '../lines';
import { EOL } from 'os';

suite('Lines', () => {
  suite('align', () => {
    test('table', () => {
      const text = `
      | a | b | c |
      | alpha | bravo | charlie |
      | ay | bee | see |`;
      const lines = new Lines(text.split(EOL), '|').align();
      const expected = `
      | a     | b     | c       |
      | alpha | bravo | charlie |
      | ay    | bee   | see     |`;
      const actual = lines.join(EOL);
      assert.equal(actual, expected);
    });

    test('mising a match', () => {
      const text = `
      | a | b | c |
      | alpha | bravo | charlie |
      | ay | bee see |`;
      const lines = new Lines(text.split(EOL), '|').align();
      const expected = `
      | a     | b       | c       |
      | alpha | bravo   | charlie |
      | ay    | bee see |`;
      const actual = lines.join(EOL);
      assert.equal(actual, expected);
    });

    test('blank line', () => {
      const text = `
      | a | b | c |
      | alpha | bravo | charlie |

      | ay | bee see |`;
      const lines = new Lines(text.split(EOL), '|').align();
      const expected = `
      | a     | b       | c       |
      | alpha | bravo   | charlie |

      | ay    | bee see |`;
      const actual = lines.join(EOL);
      assert.equal(actual, expected);
    });

    test('match on comma', () => {
      const text = `
      [
        ['test', 'otherific', 'newing'],
        ['testerific', 'othering', 'new'],
        ['testing', 'other', 'newerificer'],
      ]`;
      const lines = new Lines(text.split(EOL), ',').align();
      const expected = `
      [
        ['test'      , 'otherific', 'newing']     ,
        ['testerific', 'othering' , 'new']        ,
        ['testing'   , 'other'    , 'newerificer'],
      ]`;
      const actual = lines.join(EOL);
      assert.equal(actual, expected);
    });

    test('multi-character token', () => {
      const text = `
      [
        ['test', 'otherific', 'newing'],
        ['testerific', 'othering', 'new'],
        ['testing', 'other', 'newerificer'],
      ]`;
      const lines = new Lines(text.split(EOL), ', ').align();
      const expected = `
      [
        ['test'      , 'otherific', 'newing'],
        ['testerific', 'othering' , 'new'],
        ['testing'   , 'other'    , 'newerificer'],
      ]`;
      const actual = lines.join(EOL);
      assert.equal(actual, expected);
    });
  });
});
