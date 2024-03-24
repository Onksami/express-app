import path from "path";

const config = {
  outputFile: "./swagger-output.json",
  endpointFile: path.resolve(__dirname, "src/app.ts"), // Adjust this to your main Express app file
};

export default config;
