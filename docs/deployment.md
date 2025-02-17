# Deployment Guide

## EC2 Deployment with PM2

### Prerequisites

- Node.js 20+ installed on EC2
- PM2 installed globally (`npm install -g pm2`)
- Git for cloning the repository

### Database Setup

1. Create a directory for the database with proper permissions:

```bash
# Create a directory for the database
sudo mkdir -p /var/lib/memory-lane
# Give ownership to the user running PM2 (usually the same as your SSH user)
sudo chown -R $USER:$USER /var/lib/memory-lane
# Set proper permissions
chmod 755 /var/lib/memory-lane
```

2. Configure environment variables:

```bash
# Create .env file
cp example.env .env

# Edit .env and set DB_PATH
DB_PATH=/var/lib/memory-lane/memories.db
```

### Application Setup

1. Clone and install:

```bash
# Clone repository
git clone [repository-url]
cd memory-lane

# Install dependencies
npm install

# Build frontend
npm run build
```

2. Configure PM2:

```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'memory-lane',
    script: 'server/api.js',
    env: {
      NODE_ENV: 'production',

      // Server Configuration
      PORT: 4001,
      DB_PATH: '/var/lib/memory-lane/memories.db',
      BASE_URL: 'https://your-api-domain.com',
      FRONTEND_URL: 'https://your-frontend-domain.com',

      // JWT Configuration
      JWT_SECRET: 'your-secure-jwt-secret',

      // Storage Configuration
      STORAGE_TYPE: 'local', // or 's3' or 'gcp'
      LOCAL_STORAGE_PATH: '/var/lib/memory-lane/uploads',

      // CDN Configuration (if using)
      MEDIA_CDN_URL: 'https://your-cdn-domain.com',

      // SendGrid Email Configuration
      SENDGRID_API_KEY: 'your-sendgrid-api-key',
      FROM_EMAIL: 'noreply@yourdomain.com'
    },

    // Log files
    error_file: '/var/lib/memory-lane/err.log',
    out_file: '/var/lib/memory-lane/out.log'
  }]
}
EOL

# Set secure permissions for ecosystem config
chmod 600 ecosystem.config.js
```

3. Start the application:

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### Troubleshooting

If you encounter permission issues:

1. Check file ownership:

```bash
ls -l /var/lib/memory-lane/memories.db
```

2. Check PM2 process user:

```bash
pm2 list # Look for the user column
```

3. Fix permissions if needed:

```bash
sudo chown -R $USER:$USER /var/lib/memory-lane
chmod 755 /var/lib/memory-lane
chmod 644 /var/lib/memory-lane/memories.db
```

### Monitoring

1. View application logs:

```bash
pm2 logs memory-lane
```

2. Monitor application:

```bash
pm2 monit
```

3. Check application status:

```bash
pm2 status
```

### Security Considerations

1. File Permissions:

   - Database directory: 755 (drwxr-xr-x)
   - Database file: 644 (rw-r--r--)
   - Log files: 644 (rw-r--r--)

2. Process Ownership:

   - Run PM2 as a non-root user
   - Use the same user for PM2 and file ownership

3. Environment Variables:
   - Keep .env file secure (600 permissions)
   - Don't commit .env to version control
   - Use PM2 environment variables for sensitive data

### Maintenance

1. Updates:

```bash
# Pull latest changes
git pull

# Install dependencies
npm install

# Build frontend
npm run build

# Restart application
pm2 restart memory-lane
```

2. Backup:

```bash
# Stop application
pm2 stop memory-lane

# Backup database
cp /var/lib/memory-lane/memories.db /var/lib/memory-lane/memories.db.backup

# Start application
pm2 start memory-lane
```

3. Logs:

```bash
# Rotate logs
pm2 logrotate -u [user]

# Clear logs
pm2 flush
```
