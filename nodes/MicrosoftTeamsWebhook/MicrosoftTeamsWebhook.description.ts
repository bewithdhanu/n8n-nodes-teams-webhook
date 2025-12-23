import { INodeTypeDescription } from 'n8n-workflow';

/**
 * Node description for Microsoft Teams Webhook
 * 
 * Defines the UI configuration, properties, and field visibility
 * based on template selection.
 */
export const microsoftTeamsWebhookDescription: INodeTypeDescription = {
	displayName: 'Microsoft Teams Webhook',
	name: 'microsoftTeamsWebhook',
	icon: 'file:teams.svg',
	group: ['trigger'],
	version: 1,
	subtitle: '={{$parameter["template"]}}',
	description: 'Send Adaptive Cards to Microsoft Teams via Incoming Webhook',
	defaults: {
		name: 'Microsoft Teams Webhook',
	},
	inputs: ['main'],
	outputs: ['main'],
	properties: [
		{
			displayName: 'Webhook URL',
			name: 'webhookUrl',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Microsoft Teams Incoming Webhook URL',
		},
		{
			displayName: 'Message Template',
			name: 'template',
			type: 'options',
			options: [
				{
					name: 'Site Down Alert',
					value: 'siteDown',
				},
				{
					name: 'Site Recovered',
					value: 'siteRecovered',
				},
				{
					name: 'Custom Message',
					value: 'custom',
				},
			],
			default: 'siteDown',
			required: true,
			description: 'Select the Adaptive Card template to use',
		},
		// Site Down Alert fields
		{
			displayName: 'Service Name',
			name: 'serviceName',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					template: ['siteDown', 'siteRecovered'],
				},
			},
			description: 'Name of the service or application',
		},
		{
			displayName: 'Site URL',
			name: 'siteUrl',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					template: ['siteDown', 'siteRecovered'],
				},
			},
			description: 'URL of the affected site',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'Prod',
				},
				{
					name: 'Staging',
					value: 'Staging',
				},
				{
					name: 'Development',
					value: 'Dev',
				},
			],
			default: 'Prod',
			required: true,
			displayOptions: {
				show: {
					template: ['siteDown', 'siteRecovered'],
				},
			},
			description: 'Environment where the issue occurred',
		},
		{
			displayName: 'Error Message',
			name: 'errorMessage',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					template: ['siteDown'],
				},
			},
			description: 'Error message or description',
		},
		{
			displayName: 'Error Code',
			name: 'errorCode',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					template: ['siteDown'],
				},
			},
			description: 'HTTP error code (e.g., 500, 503)',
		},
		{
			displayName: 'Host',
			name: 'host',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					template: ['siteDown'],
				},
			},
			description: 'Host server name or IP',
		},
		{
			displayName: 'Region',
			name: 'region',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					template: ['siteDown'],
				},
			},
			description: 'Geographic region (e.g., US-East, EU-West)',
		},
		{
			displayName: 'Detected Time',
			name: 'detectedTime',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					template: ['siteDown'],
				},
			},
			description: 'Time when the issue was detected (ISO 8601 format)',
		},
		// Site Recovered fields
		{
			displayName: 'Downtime Duration',
			name: 'downtimeDuration',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					template: ['siteRecovered'],
				},
			},
			description: 'Duration of downtime (e.g., "15 minutes", "2h 30m")',
		},
		{
			displayName: 'Recovery Time',
			name: 'recoveryTime',
			type: 'dateTime',
			default: '',
			displayOptions: {
				show: {
					template: ['siteRecovered'],
				},
			},
			description: 'Time when service was recovered (ISO 8601 format)',
		},
		{
			displayName: 'Average Response Time',
			name: 'averageResponseTime',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					template: ['siteRecovered'],
					},
			},
			description: 'Average response time after recovery (e.g., "120ms")',
		},
		// Common optional fields
		{
			displayName: 'Logo URL',
			name: 'logoUrl',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					template: ['siteDown', 'siteRecovered'],
				},
			},
			description: 'URL to logo image (optional)',
		},
		// Custom template field
		{
			displayName: 'Adaptive Card JSON',
			name: 'customCardJson',
			type: 'json',
			default: '',
			required: true,
			displayOptions: {
				show: {
					template: ['custom'],
				},
			},
			description: 'Raw Adaptive Card JSON (must be valid JSON)',
		},
	],
};

