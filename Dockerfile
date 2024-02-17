# Use Node.js LTS version as base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .


# Expose the port that your app runs on
EXPOSE 8081

# Command to run your app
CMD ["npm", "start"]
