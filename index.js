// Vercel detects this root Express entry point and deploys it as a serverless function.
import express from 'express';
import app from './server/index.js';

// Keep the Express import explicit for Vercel framework detection.
void express;
export default app;
