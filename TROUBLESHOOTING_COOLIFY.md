# Troubleshooting n8n-nodes-teams-webhook on Coolify

## Issue: "The specified package could not be loaded"

If you're getting this error on a Coolify-hosted n8n instance, try these steps:

### Step 1: Clear n8n's Community Nodes Cache

Access your n8n container in Coolify:

1. **Via Coolify UI:**
   - Go to your n8n service in Coolify
   - Click on "Terminal" or "Shell" to access the container

2. **Or via SSH/Docker:**
   ```bash
   docker exec -it <n8n-container-name> /bin/sh
   ```

3. **Clear the cache:**
   ```bash
   cd /home/node/.n8n/nodes
   rm -rf node_modules package.json package-lock.json
   ```

4. **Restart n8n** through Coolify UI

### Step 2: Check n8n Logs

In Coolify, check the n8n logs for detailed error messages:

1. Go to your n8n service
2. Click on "Logs"
3. Look for errors related to:
   - Module loading
   - `n8n-nodes-teams-webhook`
   - `Cannot find module`
   - Any stack traces

### Step 3: Verify Package Installation

Check if the package is actually installed:

```bash
# Inside n8n container
cd /home/node/.n8n/nodes
ls -la node_modules/n8n-nodes-teams-webhook/dist/nodes/MicrosoftTeamsWebhook/
```

You should see:
- `MicrosoftTeamsWebhook.node.js`
- `teams.svg`

### Step 4: Manual Installation (Alternative)

If the UI installation fails, try manual installation:

1. **Access n8n container terminal**
2. **Install manually:**
   ```bash
   cd /home/node/.n8n/nodes
   npm install n8n-nodes-teams-webhook@1.0.7
   ```
3. **Restart n8n**

### Step 5: Check n8n Version Compatibility

Verify your n8n version is compatible:

```bash
# Inside container
n8n --version
```

The package requires n8n-workflow as a peer dependency, which should be available in n8n.

### Step 6: Check File Permissions

Ensure n8n has read permissions:

```bash
# Inside container
ls -la /home/node/.n8n/nodes/node_modules/n8n-nodes-teams-webhook/
chmod -R 755 /home/node/.n8n/nodes/node_modules/n8n-nodes-teams-webhook/
```

### Step 7: Verify Module Export

Test if the module can be loaded:

```bash
# Inside container
cd /home/node/.n8n/nodes/node_modules/n8n-nodes-teams-webhook
node -e "const mod = require('./dist/nodes/MicrosoftTeamsWebhook/MicrosoftTeamsWebhook.node.js'); console.log('Loaded:', typeof mod.MicrosoftTeamsWebhook);"
```

This should output: `Loaded: function`

### Common Coolify-Specific Issues

1. **Volume Mounts**: Ensure `/home/node/.n8n` is properly mounted and persistent
2. **Node Version**: Coolify might use a different Node.js version - check compatibility
3. **Network**: Ensure the container can access npm registry
4. **Memory**: Large description objects might cause issues - but ours is fine

### Still Not Working?

If none of the above works, try:

1. **Check Coolify logs** for container startup errors
2. **Verify n8n version** - try updating n8n to the latest version
3. **Check environment variables** in Coolify - ensure N8N_USER_FOLDER is set correctly
4. **Contact support** with:
   - n8n version
   - Node.js version (from container)
   - Full error logs
   - Coolify version

