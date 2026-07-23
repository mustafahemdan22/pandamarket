const { ConvexHttpClient } = require("convex/browser");
require("dotenv").config({ path: ".env.local" });

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

async function runUpdate() {
  console.log("Running updateToLocalPaths mutation...");
  try {
    const result = await client.mutation("updateImages:updateToLocalPaths");
    console.log("Updated products count:", result);
  } catch (error) {
    console.error("Mutation failed:", error);
  }
}

runUpdate();
