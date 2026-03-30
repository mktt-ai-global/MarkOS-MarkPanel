# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Set work directory
WORKDIR /app

# Copy package files
COPY apps/web/package.json apps/web/package-lock.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy source code
COPY apps/web/ .

# Build the application
# Use build-time environment variables if needed
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

# Stage 2: Serve the application using a lightweight node image
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy built assets and necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
