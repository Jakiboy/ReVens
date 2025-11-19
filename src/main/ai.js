/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

const { exec } = require('child_process');
const config = require('../config/app.json');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const http = require('http');
const execAsync = promisify(exec);

class ReVensAI {
    constructor() {
        this.modelName = config?.ai?.model || 'tinyrevens';
        this.handler = config?.ai?.handler || 'revensai'
        this.isAvailable = false;
        this.modelDownloaded = false;
        this.messages = {
            assistant: config?.strings?.ai?.assistant || 'Hello!'
        };
        this.errors = {
            system: config?.strings?.ai?.system || 'AI Assistant is not available.',
            notAssistant: config?.strings?.ai?.error['no-assistant'] || 'AI Assistant is not installed',
            noModel: config?.strings?.ai?.error['no-model'] || 'AI Model not downloaded or service not running'
        };
    }

    async checkAvailability() {
        try {
            await execAsync(`${this.handler} --version`);
            this.isAvailable = true;

            // Check if model is downloaded
            try {
                const { stdout } = await execAsync(`${this.handler} list`);
                this.modelDownloaded = stdout.toLowerCase().includes(this.modelName.toLowerCase());

            } catch {
                this.modelDownloaded = false;
            }

            return true;

        } catch {
            this.isAvailable = false;
            this.modelDownloaded = false;
            return false;
        }
    }

    async ensureModel() {
        if (!this.isAvailable) {
            throw new Error(this.errors.notAssistant);
        }

        if (!this.modelDownloaded) {
            throw new Error(this.errors.noModel);
        }
    }

    async analyzeFile(filePath) {
        await this.ensureModel();

        const fileExt = path.extname(filePath).toLowerCase();
        const fileName = path.basename(filePath);
        const fileSize = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;
        const fileSizeKB = (fileSize / 1024).toFixed(2);

        // Set prompt
        const prompt = `You are a reverse engineering assistant integrated into ReVens toolkit.
Analyze this file and provide a brief technical overview:

File: ${fileName}
Extension: ${fileExt}
Size: ${fileSizeKB} KB
Path: ${filePath}

Provide:
1. File type identification
2. Potential use case
3. Recommended ReVens tools for analysis
4. Security considerations (if applicable)

Keep the response concise and technical.`;

        return await this.query(prompt);
    }

    async query(prompt) {
        await this.ensureModel();

        // Set system context prompt
        const systemPrompt = `You are a concise reverse engineering assistant. Answer directly and technically. Keep responses under 100 words.

User: ${prompt}
Assistant:`;

        return new Promise((resolve, reject) => {
            const data = JSON.stringify({
                model: this.modelName,
                prompt: systemPrompt,
                stream: false
            });

            const options = {
                hostname: config?.ai?.config?.hostname || '',
                port: config?.ai?.config?.port || 0,
                path: config?.ai?.config?.path || '',
                method: config?.ai?.config?.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                },
                timeout: config?.ai?.config?.timeout || 60000
            };

            const req = http.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    try {
                        const jsonResponse = JSON.parse(responseData);
                        if (jsonResponse.response) {
                            resolve(jsonResponse.response.trim());
                        } else if (jsonResponse.error) {
                            reject(new Error(jsonResponse.error));
                        } else {
                            reject(new Error('No response from AI'));
                        }
                    } catch (error) {
                        reject(new Error(`Failed to parse AI response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`AI query failed: ${error.message}`));
            });

            req.on('timeout', () => {
                const name = config.ai?.name || 'AI';
                req.destroy();
                reject(new Error(`Timeout: please check if ${name} service is running`));
            });

            req.write(data);
            req.end();
        });
    }
}

module.exports = new ReVensAI();
