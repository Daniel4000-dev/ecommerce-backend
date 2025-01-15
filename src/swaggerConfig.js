const swaggerJSDoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-Commerce API",
            version: "1.0.0",
            description: "API documentation for the E-Commerce platform",
        },
        servers: [
            {
                url: "https://ecommerce-backend-ws07.onrender.com/", // Production server
                description: "Production Server",
            },
            {
                url: "http://localhost:3000/", // Local development server
                description: "Local Development Server",
            },
        ],
    },
    apis: ["./src/routes/*.js"], // Points to route files for Swagger annotations
}

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;