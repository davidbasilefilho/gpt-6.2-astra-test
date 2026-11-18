import assert from 'node:assert/strict';
import test from 'node:test';

import { rateFor } from '../src/api-rates.js';
test('model rate card uses full-request long-context and speed multipliers', () => {
  assert.deepEqual(rateFor('Astra', 1, false), [8, 0.4, 10, 20, 40]);
  assert.deepEqual(rateFor('Sol', 2, true), [8, 0.4, 10, 20, 30]);
  assert.deepEqual(rateFor('Sol', 0.5, false), [1, 0.05, 1.25, 2.5, 5]);
});
