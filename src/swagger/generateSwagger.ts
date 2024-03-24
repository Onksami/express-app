import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    version: "1.0.0", // by default: '1.0.0'
    title: "namık's apis", // by default: 'REST API'
    description: "this is collection of apis of namık",
  },
  // by default: 'localhost:3000'
  host:
    process.env.NODE_ENV === "development"
      ? "localhost:8081"
      : process.env.RAILWAY_PUBLIC_DOMAIN,
  basePath: "/api/v1", // by default: '/'
  schemes: [], // by default: ['http']
  consumes: [], // by default: ['application/json']
  produces: [], // by default: ['application/json']
  tags: [
    // by default: empty Array
    // {
    //   name: "", // Tag name
    //   description: "", // Tag description
    // },
  ],
  securityDefinitions: {}, // by default: empty object
  definitions: {}, // by default: empty object
};

const outputFile = "./swagger-output.json";
const routes = ["./src/api/index.ts"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen()(outputFile, routes, doc);
