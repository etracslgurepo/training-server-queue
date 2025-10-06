# ----------------------
# Stage 1: Build the app
# ----------------------
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first (to leverage Docker layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy all project files
COPY . .

# Build the Next.js app
RUN npm run build


# ----------------------
# Stage 2: Production
# ----------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV for production
ENV NODE_ENV=production

# Copy only necessary files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# Install only production dependencies
RUN npm install --omit=dev --frozen-lockfile

RUN touch .env && touch .env.local

# Expose Next.js default port
EXPOSE 3000

# Run as non-root user for security
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs
USER nextjs

# Run the Next.js server
CMD ["npm", "start"]
