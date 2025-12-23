import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
} from 'n8n-workflow';
import { microsoftTeamsWebhookDescription } from './MicrosoftTeamsWebhook.description';

/**
 * Microsoft Teams Webhook Node
 * 
 * Sends Adaptive Cards to Microsoft Teams channels using Incoming Webhook URLs.
 * Supports multiple predefined templates and custom Adaptive Card JSON.
 */
export class MicrosoftTeamsWebhook implements INodeType {
	description = microsoftTeamsWebhookDescription;

	/**
	 * Builds an Adaptive Card for "Site Down Alert" template
	 */
	private buildDownCard(data: {
		serviceName: string;
		siteUrl: string;
		environment: string;
		errorMessage: string;
		errorCode?: string;
		host?: string;
		region?: string;
		detectedTime?: string;
		logoUrl?: string;
	}) {
		const detectedTime = data.detectedTime || new Date().toISOString();
		const facts: any[] = [
			{
				title: 'Service',
				value: data.serviceName,
			},
			{
				title: 'Environment',
				value: data.environment,
			},
			{
				title: 'Detected',
				value: new Date(detectedTime).toLocaleString(),
			},
		];

		if (data.errorCode) {
			facts.push({
				title: 'Error Code',
				value: data.errorCode,
			});
		}

		if (data.host) {
			facts.push({
				title: 'Host',
				value: data.host,
			});
		}

		if (data.region) {
			facts.push({
				title: 'Region',
				value: data.region,
			});
		}

		const technicalDetails: any[] = [
			{
				type: 'TextBlock',
				text: `**Error Message:** ${data.errorMessage}`,
				wrap: true,
			},
		];

		if (data.errorCode) {
			technicalDetails.push({
				type: 'TextBlock',
				text: `**Error Code:** ${data.errorCode}`,
				wrap: true,
				spacing: 'Small',
			});
		}

		const card: any = {
			type: 'AdaptiveCard',
			version: '1.4',
			body: [
				{
					type: 'Container',
					items: [
						...(data.logoUrl
							? [
									{
										type: 'Image',
										url: data.logoUrl,
										size: 'Small',
										style: 'Person',
									},
							  ]
							: []),
						{
							type: 'TextBlock',
							text: '🚨 Site Down Alert',
							size: 'Large',
							weight: 'Bolder',
							color: 'Attention',
						},
						{
							type: 'TextBlock',
							text: `${data.serviceName} is currently down`,
							size: 'Medium',
							weight: 'Bolder',
							spacing: 'Small',
						},
					],
				},
				{
					type: 'FactSet',
					facts: facts,
					spacing: 'Medium',
				},
				{
					type: 'ActionSet',
					actions: [
						{
							type: 'Action.OpenUrl',
							title: 'View Site',
							url: data.siteUrl,
						},
						{
							type: 'Action.ShowCard',
							title: 'Technical Details',
							card: {
								type: 'AdaptiveCard',
								version: '1.4',
								body: technicalDetails,
							},
						},
					],
				},
			],
		};

		return card;
	}

	/**
	 * Builds an Adaptive Card for "Site Recovered" template
	 */
	private buildUpCard(data: {
		serviceName: string;
		siteUrl: string;
		environment: string;
		downtimeDuration: string;
		recoveryTime?: string;
		averageResponseTime?: string;
		logoUrl?: string;
	}) {
		const recoveryTime = data.recoveryTime || new Date().toISOString();
		const facts: any[] = [
			{
				title: 'Service',
				value: data.serviceName,
			},
			{
				title: 'Environment',
				value: data.environment,
			},
			{
				title: 'Downtime',
				value: data.downtimeDuration,
			},
			{
				title: 'Recovered',
				value: new Date(recoveryTime).toLocaleString(),
			},
		];

		if (data.averageResponseTime) {
			facts.push({
				title: 'Response Time',
				value: data.averageResponseTime,
			});
		}

		const card: any = {
			type: 'AdaptiveCard',
			version: '1.4',
			body: [
				{
					type: 'Container',
					items: [
						...(data.logoUrl
							? [
									{
										type: 'Image',
										url: data.logoUrl,
										size: 'Small',
										style: 'Person',
									},
							  ]
							: []),
						{
							type: 'TextBlock',
							text: '✅ Site Recovered',
							size: 'Large',
							weight: 'Bolder',
							color: 'Good',
						},
						{
							type: 'TextBlock',
							text: `${data.serviceName} is back online`,
							size: 'Medium',
							weight: 'Bolder',
							spacing: 'Small',
						},
					],
				},
				{
					type: 'FactSet',
					facts: facts,
					spacing: 'Medium',
				},
				{
					type: 'ActionSet',
					actions: [
						{
							type: 'Action.OpenUrl',
							title: 'View Site',
							url: data.siteUrl,
						},
					],
				},
			],
		};

		return card;
	}

	/**
	 * Validates and parses custom Adaptive Card JSON
	 * Handles both string JSON and already-parsed objects
	 */
	private parseCustomCard(jsonInput: string | object): any {
		try {
			const card = typeof jsonInput === 'string' ? JSON.parse(jsonInput) : jsonInput;
			
			// Basic validation - ensure it's an object
			if (typeof card !== 'object' || card === null) {
				throw new Error('Adaptive Card JSON must be an object');
			}

			// Ensure it has the required type field
			if (!card.type || card.type !== 'AdaptiveCard') {
				throw new Error('Adaptive Card must have type "AdaptiveCard"');
			}

			// Ensure version is set
			if (!card.version) {
				card.version = '1.4';
			}

			return card;
		} catch (error: any) {
			throw new Error(`Invalid Adaptive Card JSON: ${error.message}`);
		}
	}

	/**
	 * Wraps Adaptive Card in Teams message format
	 */
	private wrapCardForTeams(card: any) {
		return {
			type: 'message',
			attachments: [
				{
					contentType: 'application/vnd.microsoft.card.adaptive',
					content: card,
				},
			],
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				// Get webhook URL
				const webhookUrl = this.getNodeParameter('webhookUrl', i) as string;
				if (!webhookUrl) {
					throw new Error('Webhook URL is required');
				}

				// Get template type
				const template = this.getNodeParameter('template', i) as string;

				let adaptiveCard: any;

				// Build card based on template
				if (template === 'siteDown') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const siteUrl = this.getNodeParameter('siteUrl', i) as string;
					const environment = this.getNodeParameter('environment', i) as string;
					const errorMessage = this.getNodeParameter('errorMessage', i) as string;
					const errorCode = this.getNodeParameter('errorCode', i, '') as string;
					const host = this.getNodeParameter('host', i, '') as string;
					const region = this.getNodeParameter('region', i, '') as string;
					const detectedTime = this.getNodeParameter('detectedTime', i, '') as string;
					const logoUrl = this.getNodeParameter('logoUrl', i, '') as string;

					adaptiveCard = this.buildDownCard({
						serviceName,
						siteUrl,
						environment,
						errorMessage,
						errorCode,
						host,
						region,
						detectedTime,
						logoUrl,
					});
				} else if (template === 'siteRecovered') {
					const serviceName = this.getNodeParameter('serviceName', i) as string;
					const siteUrl = this.getNodeParameter('siteUrl', i) as string;
					const environment = this.getNodeParameter('environment', i) as string;
					const downtimeDuration = this.getNodeParameter('downtimeDuration', i) as string;
					const recoveryTime = this.getNodeParameter('recoveryTime', i, '') as string;
					const averageResponseTime = this.getNodeParameter('averageResponseTime', i, '') as string;
					const logoUrl = this.getNodeParameter('logoUrl', i, '') as string;

					adaptiveCard = this.buildUpCard({
						serviceName,
						siteUrl,
						environment,
						downtimeDuration,
						recoveryTime,
						averageResponseTime,
						logoUrl,
					});
				} else if (template === 'custom') {
					const customCardJson = this.getNodeParameter('customCardJson', i) as string | object;
					adaptiveCard = this.parseCustomCard(customCardJson);
				} else {
					throw new Error(`Unknown template: ${template}`);
				}

				// Wrap card in Teams message format
				const messagePayload = this.wrapCardForTeams(adaptiveCard);

				// Send HTTP POST request
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: webhookUrl,
					body: messagePayload,
					headers: {
						'Content-Type': 'application/json',
					},
					json: true,
				});

				// Return success response
				returnData.push({
					json: {
						success: true,
						response: response,
						card: adaptiveCard,
					},
					pairedItem: {
						item: i,
					},
				});
			} catch (error: any) {
				// Handle errors gracefully
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							success: false,
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

