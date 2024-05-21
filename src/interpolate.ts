type RangeTuple = [min: number, max: number];

export function interpolateLinear(
  value: number,
  inArray: RangeTuple,
  outArray: RangeTuple,
  clamp: boolean | undefined = true,
): number {
  'worklet';
  const inMin = inArray[0];
  const inMax = inArray[1];
  const outMin = outArray[0];
  const outMax = outArray[1];

  if (clamp) {
    if (value <= inMin) {
      return outMin;
    }

    if (value >= inMax) {
      return outMax;
    }
  }

  const ratio = (outMax - outMin) / (inMax - inMin);
  const outValue = outMin + ratio * (value - inMin);

  return outValue;
}

export function interpolateSin(
  value: number,
  inArray: RangeTuple,
  outArray: RangeTuple,
  clamp: boolean | undefined = true,
) {
  'worklet';
  return interpolateLinear(
    Math.sin(
      interpolateLinear(value, inArray, [-Math.PI / 2, Math.PI / 2], clamp),
    ),
    [-1, 1],
    outArray,
    false,
  );
}
