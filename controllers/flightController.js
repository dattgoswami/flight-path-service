export function calculateFlightPath(flights) {
  const nextFlightMap = new Map();
  const startAirports = new Set();
  const endAirports = new Set();

  flights.forEach(([from, to]) => {
    nextFlightMap.set(from, to);
    startAirports.add(from);
    endAirports.add(to);
  });

  let startAirport;
  for (let airport of startAirports) {
    if (!endAirports.has(airport)) {
      startAirport = airport;
      break;
    }
  }

  if (!startAirport)
    throw new Error('Invalid flight data: no unique starting point found.');

  const visited = new Set();
  let currentAirport = startAirport;

  while (currentAirport && nextFlightMap.has(currentAirport)) {
    if (visited.has(currentAirport)) {
      throw new Error('Cycle detected in the flight path.');
    }
    visited.add(currentAirport);
    currentAirport = nextFlightMap.get(currentAirport);
  }

  const endAirport = currentAirport;

  if (visited.size !== flights.length) {
    throw new Error(
      'Invalid flight data: disjoint or unconnected flights detected.'
    );
  }

  return [startAirport, endAirport];
}
