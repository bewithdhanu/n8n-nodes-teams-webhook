# n8n-nodes-teams-webhook

A custom n8n node for sending Microsoft Teams channel messages using Incoming Webhook URLs with Adaptive Cards support.

## Features

- ✅ **No OAuth Required** - Uses Microsoft Teams Incoming Webhooks (webhook URL only)
- 🎨 **Adaptive Cards** - Supports Adaptive Card v1.4 format
- 📋 **Predefined Templates** - Three built-in templates:
  - Site Down Alert
  - Site Recovered
  - Custom Message (raw JSON)
- 🔒 **Secure** - Webhook URL stored as password field
- 🎯 **User-Friendly** - Conditional fields based on template selection

## Installation

### Local Development

1. Clone this repository:
```bash
git clone https://github.com/bewithdhanu/n8n-nodes-teams-webhook.git
cd n8n-nodes-teams-webhook
```

2. Install dependencies:
```bash
npm install
```

3. Build the node:
```bash
npm run build
```

4. Link the package to your n8n installation:
```bash
# In your n8n installation directory
npm link /path/to/n8n-nodes-teams-webhook
```

5. Restart n8n to load the new node.

### Publishing as Community Node

1. Update `package.json` with your repository information
2. Build the package:
```bash
npm run build
npm run lint
```

3. Publish to npm:
```bash
npm publish
```

4. Submit to n8n community nodes repository

## Usage

### Getting a Microsoft Teams Webhook URL

1. Open Microsoft Teams
2. Navigate to the channel where you want to post messages
3. Click the **...** (more options) next to the channel name
4. Select **Connectors**
5. Search for "Incoming Webhook" and click **Configure**
6. Give it a name and optionally upload an image
7. Click **Create**
8. Copy the webhook URL

### Using the Node

1. Add the "Microsoft Teams Webhook" node to your workflow
2. Select a template:
   - **Site Down Alert** - For service outage notifications
   - **Site Recovered** - For service recovery notifications
   - **Custom Message** - For custom Adaptive Cards
3. Enter your webhook URL
4. Fill in the template-specific fields
5. Execute the workflow

### Template Examples

#### Site Down Alert

Required fields:
- Service Name
- Site URL
- Environment
- Error Message

Optional fields:
- Error Code
- Host
- Region
- Detected Time
- Logo URL

#### Site Recovered

Required fields:
- Service Name
- Site URL
- Environment
- Downtime Duration

Optional fields:
- Recovery Time
- Average Response Time
- Logo URL

#### Custom Message

- Paste your Adaptive Card JSON in the "Adaptive Card JSON" field
- The JSON will be validated before sending
- Must be valid Adaptive Card v1.4 format

## Adaptive Card Format

The node wraps your Adaptive Card in the Teams message format:

```json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        "type": "AdaptiveCard",
        "version": "1.4",
        "body": [...]
      }
    }
  ]
}
```

See the `examples/` directory for example Adaptive Card JSON for each template.

## Development

### Project Structure

```
n8n-nodes-teams-webhook/
├── nodes/
│   └── MicrosoftTeamsWebhook/
│       ├── MicrosoftTeamsWebhook.node.ts
│       └── MicrosoftTeamsWebhook.description.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Building

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lintfix
```

## Example Workflows

### Monitoring Alert

1. Use a webhook trigger or schedule trigger
2. Add HTTP Request node to check service status
3. Add IF node to check if service is down
4. Add Microsoft Teams Webhook node with "Site Down Alert" template
5. Configure fields with data from previous nodes

### Service Recovery Notification

1. Use a webhook trigger or schedule trigger
2. Add HTTP Request node to check service status
3. Add IF node to check if service is recovered
4. Add Microsoft Teams Webhook node with "Site Recovered" template
5. Calculate downtime duration and configure fields

## Troubleshooting

### Node Not Appearing

- Ensure you've built the project (`npm run build`)
- Check that the node is linked correctly
- Restart n8n

### Webhook Not Working

- Verify the webhook URL is correct
- Check that the webhook hasn't expired
- Ensure the Adaptive Card JSON is valid
- Check n8n execution logs for error details

### Adaptive Card Not Rendering

- Verify the Adaptive Card JSON is valid
- Ensure you're using Adaptive Card v1.4
- Check Teams channel for error messages
- Test with the Custom Message template first

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

