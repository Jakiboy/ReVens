/**
 * Author  : Jakiboy
 * Package : ReVens | Reverse Engineering Toolkit AIO
 * Version : 1.5.x
 * Link    : https://github.com/Jakiboy/ReVens
 * license : MIT
 */

import React, { useState, useEffect, useRef } from 'react';
import sectionsConfig from '../../config/sections.json';
import strings from '../../config/strings.json';

const AI = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiAvailable, setAiAvailable] = useState(null);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const aiSection = sectionsConfig.sections.find(s => s.name === 'AI');
    const description = aiSection ? aiSection.desc : 'Local AI assistant';

    useEffect(() => {
        checkAI();
    }, []);

    useEffect(() => {
        const handleFileAnalysis = (event, filePath) => {
            analyzeFile(filePath);
        };

        window.electron.onAIAnalyzeFile(handleFileAnalysis);

        return () => {
            window.electron.off('ai-analyze-file', handleFileAnalysis);
        };
    }, [aiAvailable]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [aiAvailable]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const checkAI = async () => {
        const result = await window.electron.checkAI();
        setAiAvailable(result.available);

        if (!result.available) {
            setMessages([{
                role: 'system',
                content: strings.ai.error.system
            }]);
        } else {
            setMessages([{
                role: 'assistant',
                content: strings.ai.assistant
            }]);
        }
    };

    const analyzeFile = async (filePath) => {
        if (!aiAvailable) return;

        const userMessage = { role: 'user', content: `Analyze file: ${filePath}` };
        setMessages(prev => [...prev, userMessage]);
        setLoading(true);

        try {
            const result = await window.electron.queryAI('', filePath);
            if (result.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
            } else {
                const errorMsg = result.error || 'Unknown error';
                let displayError = `Error: ${errorMsg}`;

                setMessages(prev => [...prev, { role: 'system', content: displayError }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', content: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !aiAvailable || loading) return;

        const userMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const result = await window.electron.queryAI(input);
            if (result.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.response }]);
            } else {
                const errorMsg = result.error || 'Unknown error';
                let displayError = `Error: ${errorMsg}`;

                setMessages(prev => [...prev, { role: 'system', content: displayError }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'system', content: `Error: ${error.message}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="tab-content" id="tab-content-ai">
            <div className="tab-pane fade show active" id="ai" role="tabpanel" aria-labelledby="ai-tab">
                <p>{description}</p>
                <div className="section-container app-scroller">
                    <div className="ai-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`ai-message ai-message-${msg.role}`}>
                                <div className="ai-message-icon">
                                    <i className={`icon-${msg.role === 'user' ? 'user' : msg.role === 'assistant' ? 'bulb' : 'cup'}`}></i>
                                </div>
                                <div className="ai-message-content">
                                    <pre>{msg.content}</pre>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="ai-message ai-message-assistant">
                                <div className="ai-message-icon">
                                    <i className="icon-cup"></i>
                                </div>
                                <div className="ai-message-content">
                                    <span className="ai-typing">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
                <div className="ai-input-container">
                    <div className="form-outline">
                        <textarea
                            ref={textareaRef}
                            className="form-control"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            rows={1}
                            placeholder="Whatcha cooking today?"
                            disabled={!aiAvailable || loading}
                        />
                    </div>
                    <button
                        className="btn btn-primary ai-send-btn"
                        onClick={handleSend}
                        disabled={!aiAvailable || loading || !input.trim()}
                    >
                        <i className="icon-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AI;
