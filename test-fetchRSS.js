// test-fetchRSS.js

// Import the fetchRSS function (adjust path as needed)
const { fetchRSS } = require('./path/to/your/fetchRSS');

// Simple test to see if fetchRSS works independently
async function testFetchRSS() {
  try {
    console.log("Step 1: Starting fetch");
    
    // Call the fetchRSS function
    const result = await fetchRSS();
    
    console.log("Step 2: Data received", !!result);  // Check if data is received
    console.log("Step 3: Data:", result);  // Log the fetched data

  } catch (error) {
    console.error("Error in fetchRSS:", error);
  }
}

testFetchRSS();
