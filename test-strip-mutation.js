const { ConvexHttpClient } = require('convex/browser');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function testMutation() {
  try {
    const res = await client.mutation('updatePathsToCloudinary:stripLocalPrefix');
    console.log("Mutation stripLocalPrefix Success! Count:", res);
  } catch (err) {
    console.error("Mutation Error:", err.message);
  }
}

testMutation();
