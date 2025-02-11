# Use the official Node.js 22 Alpine image as the base
FROM node:22-alpine  

# Set the working directory inside the container
WORKDIR /app  

# Copy package.json and package-lock.json first to leverage Docker layer caching
COPY package*.json ./  

# Install dependencies
RUN npm install 

# Copy the rest of the application files
COPY . .  

# Copy the secret file (GitHub Actions will provide it)
ARG TOKEN_KEY_FILE
COPY ${TOKEN_KEY_FILE} /app/AuthKey_FNA4AUV8ML.p8

# Expose the application port
EXPOSE 8083  

# Define the command to start the application
CMD ["node", "server-apn.js"]