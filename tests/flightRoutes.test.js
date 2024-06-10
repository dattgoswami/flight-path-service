import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import flightRoutes from '../routes/flightRoutes.js';
import { expect } from 'chai';

const app = express();
app.use(bodyParser.json());
app.use('/', flightRoutes);

describe('POST /calculate', () => {
  it('should return the correct flight path', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['IND', 'EWR'],
          ['SFO', 'ATL'],
          ['GSO', 'IND'],
          ['ATL', 'GSO'],
        ],
      });
    expect(response.status).to.equal(200);
    expect(response.body.path).to.deep.equal(['SFO', 'EWR']);
  });

  it('should return the correct flight path with multiple segments', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['LAX', 'SFO'],
          ['SFO', 'ATL'],
          ['ATL', 'EWR'],
        ],
      });
    expect(response.status).to.equal(200);
    expect(response.body.path).to.deep.equal(['LAX', 'EWR']);
  });

  it('should return 500 for flight data with no unique starting point', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['ATL', 'EWR'],
          ['EWR', 'ATL'],
          ['SFO', 'GSO'],
          ['GSO', 'SFO'],
        ],
      });
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal(
      'Invalid flight data: no unique starting point found.'
    );
  });

  it('should return the correct path for a single flight', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [['LAX', 'JFK']],
      });
    expect(response.status).to.equal(200);
    expect(response.body.path).to.deep.equal(['LAX', 'JFK']);
  });

  it('should return 500 for empty input', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ flights: [] });
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal(
      'Invalid flight data: no unique starting point found.'
    );
  });

  it('should return 400 for invalid input (not an array)', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({ flights: 'invalid' });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal(
      'Invalid input: The request body must contain a "flights" array of arrays, where each sub-array represents a flight with a source and destination airport code. Example: { "flights": [["SFO", "EWR"], ["ATL", "EWR"]] }'
    );
  });

  it('should return 400 for invalid input (malformed flight data)', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['LAX'], // malformed flight data
        ],
      });
    expect(response.status).to.equal(400);
    expect(response.body.error).to.equal(
      'Invalid input: The request body must contain a "flights" array of arrays, where each sub-array represents a flight with a source and destination airport code. Example: { "flights": [["SFO", "EWR"], ["ATL", "EWR"]] }'
    );
  });

  it('should return 500 for flight data where there is an unconnected flight', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['IND', 'EWR'],
          ['EWR', 'SFO'],
          ['SFO', 'ATL'],
          ['ATL', 'GSO'],
          ['XYZ', 'LMN'], // unconnected flight
        ],
      });
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal(
      'Invalid flight data: disjoint or unconnected flights detected.'
    );
  });

  it('should return 500 for disjoint flights', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['LAX', 'JFK'],
          ['ATL', 'SFO'], // disjoint flight
        ],
      });
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal(
      'Invalid flight data: disjoint or unconnected flights detected.'
    );
  });

  it('should return 500 for flight data containing a cycle', async () => {
    const response = await request(app)
      .post('/calculate')
      .send({
        flights: [
          ['IND', 'EWR'],
          ['EWR', 'SFO'],
          ['SFO', 'ATL'],
          ['ATL', 'EWR'], // cycle
        ],
      });
    expect(response.status).to.equal(500);
    expect(response.body.error).to.equal('Cycle detected in the flight path.');
  });
});
