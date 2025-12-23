# Installation Guide

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- n8n installation (local or self-hosted)

## Local Development Setup

### Step 1: Clone and Install

```bash
git clone https://github.com/bewithdhanu/n8n-nodes-teams-webhook.git
cd n8n-nodes-teams-webhook
npm install
```

### Step 2: Build the Node

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Copy icon files to the dist directory
- Create the final node package

### Step 3: Link to n8n

#### Option A: Using npm link (Recommended for Development)

1. In the node directory:
```bash
npm link
```

2. In your n8n installation directory:
```bash
npm link n8n-nodes-teams-webhook
```

#### Option B: Direct Installation

Copy the entire `n8n-nodes-teams-webhook` directory to your n8n's `custom` directory:

```bash
# For n8n installed via npm
cp -r n8n-nodes-teams-webhook ~/.n8n/custom/

# For Docker installations, mount the directory
```

### Step 4: Restart n8n

Restart your n8n instance to load the new node.

### Step 5: Verify Installation

1. Open n8n
2. Create a new workflow
3. Add a node
4. Search for "Microsoft Teams Webhook"
5. The node should appear in the Communication category

## Publishing to npm

### Step 1: Prepare for Publishing

1. Update `package.json` with your information:
   - Update `author` field
   - Update `repository` URL
   - Update `homepage` URL

2. Build the package:
```bash
npm run build
npm run lint
```

### Step 2: Publish

```bash
npm publish
```

### Step 3: Install in n8n

Users can install your node via:

```bash
npm install n8n-nodes-teams-webhook
```

Or through n8n's community nodes interface.

## Troubleshooting

### Node Not Appearing

- Ensure `npm run build` completed successfully
- Check that files exist in `dist/nodes/MicrosoftTeamsWebhook/`
- Verify the node is linked correctly (`npm list -g --depth=0`)
- Restart n8n completely

### Build Errors

- Ensure all dependencies are installed: `npm install`
- Check TypeScript version compatibility
- Verify `tsconfig.json` is correct

### Runtime Errors

- Check n8n logs for error messages
- Verify webhook URL is correct
- Test with Custom Message template first to validate JSON

## Development Workflow

1. Make changes to `.ts` files in `nodes/MicrosoftTeamsWebhook/`
2. Run `npm run build` to compile
3. Restart n8n or reload the node
4. Test in n8n UI

For faster development, use watch mode:

```bash
npm run dev
```

This will automatically rebuild on file changes.

