/**
 * @fileoverview API integration and data fetching
 * @module src.blockchain.onchain-agent.app.types.api.ts
 * @version 1.0.0
 * @author GroqTales Team
 * @since 2025-08-02
 */

export type AgentRequest = { userMessage: string };

export type AgentResponse = { response?: string; error?: string };
