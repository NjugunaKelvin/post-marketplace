import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('market-chat')
export class MarketChat extends LitElement {
  @state() isOpen = false;
  @state() item: any = null;
  @state() messages: any[] = [];
  @state() newMessage = '';
  @state() lastTimestamp = new Date(0).toISOString();
  @state() isSending = false;
  @state() showOfferForm = false;
  @state() offerAmount = '';

  private pollInterval: any = null;

  // Mocking current user for demonstration
  private currentUser = {
    id: 'user2',
    name: 'ToyTrader'
  };

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('open-chat', this.handleOpenChat as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('open-chat', this.handleOpenChat as EventListener);
    this.stopPolling();
  }

  handleOpenChat = (e: CustomEvent) => {
    this.item = e.detail.item;
    this.isOpen = true;
    this.messages = [];
    this.lastTimestamp = new Date(0).toISOString();
    this.startPolling();
  }

  closeChat() {
    this.isOpen = false;
    this.stopPolling();
  }

  startPolling() {
    this.stopPolling();
    this.fetchMessages();
    this.pollInterval = setInterval(() => this.fetchMessages(), 3000);
  }

  stopPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);
  }

  async fetchMessages() {
    if (!this.item) return;

    try {
      const response = await fetch(`/api/messages/item/${this.item.id}/poll/${this.lastTimestamp}`);
      const data = await response.json();
      
      if (data.hasNew) {
        this.messages = [...this.messages, ...data.messages];
        this.lastTimestamp = data.lastTimestamp;
        this.scrollToBottom();
      }
    } catch (err) {
      console.error('Polling failed:', err);
    }
  }

  async sendMessage(content: string, type = 'text', price?: number) {
    if (!content.trim() && !price) return;

    this.isSending = true;
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: this.item.id,
          senderId: this.currentUser.id,
          senderName: this.currentUser.name,
          content,
          type,
          price,
          originalPrice: this.item.price
        })
      });

      if (response.ok) {
        this.newMessage = '';
        this.showOfferForm = false;
        this.offerAmount = '';
        this.fetchMessages();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      this.isSending = false;
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const container = this.querySelector('#message-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 50);
  }

  formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  render() {
    if (!this.isOpen) return html``;

    return html`
      <div class="fixed inset-0 z-[100] flex justify-end">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="${this.closeChat}"></div>

        <!-- Panel -->
        <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <!-- Header -->
          <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
            <div class="flex items-center gap-3">
              <button @click="${this.closeChat}" class="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h3 class="font-bold text-slate-900 leading-tight">${this.item?.name}</h3>
                <p class="text-xs text-slate-500">Messaging ${this.item?.sellerName}</p>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div id="message-container" class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            ${this.messages.length === 0 ? html`
              <div class="text-center py-10">
                <p class="text-sm text-slate-400">No messages yet. Say hello to start negotiation!</p>
              </div>
            ` : this.messages.map(msg => this.renderMessage(msg))}
          </div>

          <!-- Footer/Input -->
          <div class="p-4 border-t border-slate-100 bg-white">
            ${this.showOfferForm ? this.renderOfferForm() : html`
              <div class="flex items-center gap-2 mb-3">
                 <button 
                  @click="${() => this.showOfferForm = true}"
                  class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100"
                >
                  Propose Price
                </button>
              </div>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask a question..."
                  class="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  .value="${this.newMessage}"
                  @input="${(e: any) => this.newMessage = e.target.value}"
                  @keypress="${(e: KeyboardEvent) => e.key === 'Enter' && this.sendMessage(this.newMessage)}"
                />
                <button 
                  @click="${() => this.sendMessage(this.newMessage)}"
                  ?disabled="${this.isSending || !this.newMessage.trim()}"
                  class="bg-indigo-600 text-white p-2.5 rounded-xl disabled:opacity-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            `}
          </div>
        </div>
      </div>
    `;
  }

  renderMessage(msg: any) {
    const isMe = msg.senderId === this.currentUser.id;
    return html`
      <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[80%] ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none' : 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-200'} p-3 shadow-sm">
          ${msg.type === 'offer' ? html`
            <div class="mb-1">
              <span class="text-[10px] font-bold uppercase ${isMe ? 'text-indigo-200' : 'text-slate-400'}">Price Proposal</span>
              <div class="text-lg font-black">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(msg.price)}</div>
            </div>
          ` : ''}
          <p class="text-sm">${msg.content}</p>
          <div class="text-[10px] mt-1 opacity-70 ${isMe ? 'text-right' : 'text-left'}">
            ${this.formatTime(msg.timestamp)}
          </div>
        </div>
      </div>
    `;
  }

  renderOfferForm() {
    return html`
      <div class="space-y-3 animate-in fade-in slide-in-from-bottom-2">
        <div class="flex justify-between items-center">
          <h4 class="text-sm font-bold text-slate-900">Make an offer</h4>
          <button @click="${() => this.showOfferForm = false}" class="text-xs text-slate-500 hover:text-slate-800 underline">Cancel</button>
        </div>
        <div class="flex gap-2">
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
            <input 
              type="number" 
              placeholder="0.00"
              class="w-full bg-slate-100 border-none rounded-xl pl-7 pr-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-indigo-500"
              .value="${this.offerAmount}"
              @input="${(e: any) => this.offerAmount = e.target.value}"
            />
          </div>
          <button 
            @click="${() => this.sendMessage(`I'd like to offer $${this.offerAmount} for this.`, 'offer', parseFloat(this.offerAmount))}"
            ?disabled="${this.isSending || !this.offerAmount}"
            class="bg-indigo-600 text-white px-6 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
          >
            Send Offer
          </button>
        </div>
      </div>
    `;
  }
}
