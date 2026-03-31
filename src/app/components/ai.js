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
    const [copiedIdx, setCopiedIdx] = useState(null);
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

    const copyToClipboard = (text, idx) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedIdx(idx);
            setTimeout(() => setCopiedIdx(null), 1500);
        });
    };

    const CopyIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );

    const CheckIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );

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
                                    {msg.role === 'assistant' && (
                                        <button
                                            className="ai-copy-btn"
                                            title="Copy to clipboard"
                                            onClick={() => copyToClipboard(msg.content, idx)}
                                        >
                                            {copiedIdx === idx ? <CheckIcon /> : <CopyIcon />}
                                        </button>
                                    )}
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
