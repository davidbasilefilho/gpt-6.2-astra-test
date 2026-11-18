import assert from 'node:assert/strict';
import test from 'node:test';

import { rateFor } from '../src/api-rates.js';
import { estimateTasks } from '../src/task-value.js';
test('model rate card uses full-request long-context and speed multipliers', () => {
  assert.deepEqual(rateFor('Astra', 1, false), [8, 0.4, 10, 20, 40]);
  assert.deepEqual(rateFor('Sol', 2, true), [8, 0.4, 10, 20, 30]);
  assert.deepEqual(rateFor('Sol', 0.5, false), [1, 0.05, 1.25, 2.5, 5]);
});
test('task worksheet counts failed attempts in API cost but not finished work', () => {
  assert.deepEqual(
    estimateTasks(
      { quota: 5, success: 75, fresh: 100000, cached: 500000, output: 25000 },
      [8, 0.4, 40],
    ),
    { attempts: 20, complete: 15, perAttempt: 2, weeklyCost: 40 },
  );
  for (const quota of [0, -5, 101, ''])
    assert.equal(
      estimateTasks({ quota, success: 80, fresh: 0, cached: 0, output: 0 }, [8, 0.4, 40]),
      null,
    );
});
