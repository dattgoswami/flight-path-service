import express from 'express';
import { calculateFlightPath } from '../controllers/flightController.js';
import { logRequest } from '../middleware/logger.js';

const router = express.Router();

router.post('/calculate', logRequest, (req, res, next) => {
  const { flights } = req.body;

  if (
    !flights ||
    !Array.isArray(flights) ||
    flights.some((f) => f.length !== 2)
  ) {
    return res.status(400).json({
      error: 'Invalid input: The request body must contain a "flights" array of arrays, where each sub-array represents a flight with a source and destination airport code. Example: { "flights": [["SFO", "EWR"], ["ATL", "EWR"]] }',
    });
  }

  try {
    const path = calculateFlightPath(flights);
    res.json({ path });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
