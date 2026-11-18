// Two distinct estimates: completed work in the plan, and model-token spend at API list rates.
export function estimateTasks({ quota, success, fresh, cached, output }, rates) {
  const numbers = [quota, success, fresh, cached, output];
  if (
    numbers.some((v) => v === '' || !Number.isFinite(Number(v)) || Number(v) < 0) ||
    Number(quota) <= 0 ||
    Number(quota) > 100 ||
    Number(success) > 100
  )
    return null;
  const attempts = 100 / Number(quota);
  const cost =
    (Number(fresh) * rates[0] + Number(cached) * rates[1] + Number(output) * rates[2]) / 1e6;
  return {
    attempts,
    complete: (attempts * Number(success)) / 100,
    perAttempt: cost,
    weeklyCost: attempts * cost,
  };
}
