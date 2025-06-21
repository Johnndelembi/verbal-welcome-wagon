
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface MessageRequest {
  message_body: string;
  wa_id: string;
  name: string;
}

export interface MessageResponse {
  status: string;
  response: string;
}

export interface ConversationHistory {
  status: string;
  wa_id: string;
  last_messages: Array<{
    role: string;
    content: string;
    timestamp?: string;
  }>;
  handover_triggered: boolean;
  fallback_count: number;
}

export interface BroadcastRequest {
  wa_ids: string[];
  message: string;
}

export interface Analytics {
  status: string;
  analytics: {
    active_users: number;
    handovers: number;
    total_messages: number;
  };
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}/webhook${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(errorData.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  async sendMessage(data: MessageRequest): Promise<MessageResponse> {
    return this.request<MessageResponse>('/message', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetHandover(wa_id: string): Promise<{ status: string; message: string }> {
    return this.request('/reset_handover', {
      method: 'POST',
      body: JSON.stringify({ wa_id }),
    });
  }

  async getConversationHistory(wa_id: string): Promise<ConversationHistory> {
    return this.request<ConversationHistory>('/conversation_history', {
      method: 'POST',
      body: JSON.stringify({ wa_id }),
    });
  }

  async deleteConversation(wa_id: string): Promise<{ status: string; message: string }> {
    return this.request('/delete_conversation', {
      method: 'POST',
      body: JSON.stringify({ wa_id }),
    });
  }

  async sendBroadcast(data: BroadcastRequest): Promise<{
    status: string;
    message: string;
    successes: string[];
    failures: string[];
  }> {
    return this.request('/broadcast', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnalytics(): Promise<Analytics> {
    return this.request<Analytics>('/analytics');
  }
}

export const apiService = new ApiService();
