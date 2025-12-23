# Architecture Overview

## Node Structure

The Microsoft Teams Webhook node is built following n8n's standard node architecture:

```
nodes/MicrosoftTeamsWebhook/
├── MicrosoftTeamsWebhook.node.ts      # Main node logic
├── MicrosoftTeamsWebhook.description.ts # UI configuration
└── teams.svg                          # Node icon
```

## Key Components

### 1. Node Description (`MicrosoftTeamsWebhook.description.ts`)

Defines the UI configuration:
- **Template Selector**: Dropdown with three options (Site Down, Site Recovered, Custom)
- **Conditional Fields**: Fields show/hide based on selected template using `displayOptions`
- **Field Types**: String, options, dateTime, and JSON types
- **Validation**: Required fields marked with `required: true`

### 2. Node Implementation (`MicrosoftTeamsWebhook.node.ts`)

#### Template Builders

- **`buildDownCard()`**: Creates Adaptive Card for site down alerts
  - Includes error details, technical information
  - Collapsible "Technical Details" section
  - Attention color scheme
  
- **`buildUpCard()`**: Creates Adaptive Card for site recovery
  - Shows downtime duration and recovery metrics
  - Good color scheme
  - Simplified layout

#### Utility Functions

- **`parseCustomCard()`**: Validates and parses custom JSON
  - Handles both string and object inputs
  - Validates Adaptive Card structure
  - Ensures version 1.4 compatibility

- **`wrapCardForTeams()`**: Wraps Adaptive Card in Teams message format
  - Adds required `type: "message"` wrapper
  - Adds `attachments` array with proper content type

#### Execution Flow

1. **Input Processing**: Iterates through input items
2. **Parameter Extraction**: Gets webhook URL and template-specific fields
3. **Card Building**: Calls appropriate template builder or parses custom JSON
4. **Message Wrapping**: Wraps card in Teams message format
5. **HTTP Request**: Sends POST request to webhook URL
6. **Error Handling**: Gracefully handles errors with `continueOnFail()`
7. **Output**: Returns success/failure status with response data

## Adaptive Card Structure

### Site Down Alert Card

```json
{
  "type": "AdaptiveCard",
  "version": "1.4",
  "body": [
    {
      "type": "Container",
      "items": [
        // Logo (optional)
        // Title: "🚨 Site Down Alert"
        // Subtitle: Service name
      ]
    },
    {
      "type": "FactSet",
      "facts": [
        // Service, Environment, Detected Time
        // Error Code, Host, Region (optional)
      ]
    },
    {
      "type": "ActionSet",
      "actions": [
        // "View Site" button
        // "Technical Details" collapsible card
      ]
    }
  ]
}
```

### Site Recovered Card

Similar structure but with:
- ✅ emoji and "Good" color
- Downtime duration and recovery time
- Average response time (optional)
- No collapsible technical details

## Teams Message Format

The Adaptive Card is wrapped in Teams' expected format:

```json
{
  "type": "message",
  "attachments": [
    {
      "contentType": "application/vnd.microsoft.card.adaptive",
      "content": {
        // Adaptive Card JSON here
      }
    }
  ]
}
```

## Error Handling

- **Validation Errors**: Thrown immediately (invalid JSON, missing required fields)
- **HTTP Errors**: Caught and handled based on `continueOnFail()` setting
- **Template Errors**: Unknown template types throw descriptive errors

## Type Safety

- Uses TypeScript for type checking
- Proper typing for n8n interfaces (`IExecuteFunctions`, `INodeExecutionData`, etc.)
- Type assertions for node parameters
- Generic error handling with `any` type for error objects

## Extensibility

The node is designed to be easily extensible:

1. **Add New Templates**: 
   - Add option to template dropdown
   - Create new builder function
   - Add template-specific fields with `displayOptions`

2. **Modify Existing Templates**:
   - Update builder functions
   - Add/remove fields in description
   - Modify Adaptive Card structure

3. **Custom Validation**:
   - Extend `parseCustomCard()` for custom validation
   - Add field-level validation in description

## Best Practices Implemented

✅ **Separation of Concerns**: Description separate from implementation  
✅ **Error Handling**: Graceful error handling with continueOnFail  
✅ **Type Safety**: Full TypeScript typing  
✅ **Documentation**: Inline comments explaining key parts  
✅ **Validation**: Input validation before sending  
✅ **Flexibility**: Supports both predefined and custom templates  
✅ **User Experience**: Conditional fields based on template selection  

