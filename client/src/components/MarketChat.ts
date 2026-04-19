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

  async handleAcceptOffer(msg: any) {
    try {
      // In a real app, this would update the message status in the DB
      // For now, we'll send a system message and trigger the payment state
      await this.sendMessage(`Offer of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(msg.price)} accepted! You can now proceed to checkout.`, 'system');
    } catch (err) {
      console.error('Failed to accept offer:', err);
    }
  }

  async handleCheckout() {
    this.isSending = true;
    try {
      const response = await fetch(`/api/items/${this.item.id}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerId: this.currentUser.id })
      });

      if (response.ok) {
        await this.sendMessage('I have just paid for the item! Please confirm the sale.', 'system');
        // Refresh item state
        const itemRes = await fetch(`/api/items/${this.item.id}`);
        this.item = await itemRes.json();
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      this.isSending = false;
    }
  }

  async handleConfirmSale() {
    this.isSending = true;
    try {
      const response = await fetch(`/api/items/${this.item.id}/confirm-sale`, {
        method: 'POST'
      });

      if (response.ok) {
        await this.sendMessage('Sale confirmed! The item has been removed from the marketplace.', 'system');
        this.closeChat();
        window.dispatchEvent(new CustomEvent('market-search', { detail: { query: '' } })); // Trigger list refresh
      }
    } catch (err) {
      console.error('Confirmation failed:', err);
    } finally {
      this.isSending = false;
    }
  }

  render() {
    if (!this.isOpen) return html``;
    const isSeller = this.item?.sellerId === this.currentUser.id;

    return html`
      <div class="fixed inset-0 z-[100] flex justify-end">
        <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" @click="${this.closeChat}"></div>
        <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          
          <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0">
            <div class="flex items-center gap-3">
              <button @click="${this.closeChat}" class="p-2 -ml-2 text-slate-400 hover:text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h3 class="font-bold text-slate-900 leading-tight">${this.item?.name}</h3>
                <p class="text-xs text-slate-500">${isSeller ? 'Your Listing' : 'Messaging ' + this.item?.sellerName}</p>
              </div>
            </div>
            ${this.item?.paymentStatus === 'paid' && isSeller ? html`
              <button @click="${this.handleConfirmSale}" class="bg-emerald-600 text-white text-[10px] font-bold px-3 py-2 rounded-lg hover:bg-emerald-700 animate-pulse">
                CONFIRM SALE
              </button>
            ` : ''}
          </div>

          <div id="message-container" class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            ${this.messages.length === 0 ? html`
              <div class="text-center py-10">
                <p class="text-sm text-slate-400 font-medium italic">Start the conversation...</p>
              </div>
            ` : this.messages.map(msg => this.renderMessage(msg, isSeller))}
          </div>

          <div class="p-4 border-t border-slate-100 bg-white">
            ${this.item?.paymentStatus === 'paid' ? html`
              <div class="bg-emerald-50 text-emerald-700 p-3 rounded-xl text-center font-bold text-sm">
                Payment Received. Waiting for seller confirmation.
              </div>
            ` : this.showOfferForm ? this.renderOfferForm() : html`
              <div class="flex items-center gap-2 mb-3">
                 ${!isSeller ? html`
                   <button @click="${() => this.showOfferForm = true}" class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100">
                     Propose Price
                   </button>
                 ` : ''}
              </div>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  class="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
                  .value="${this.newMessage}"
                  @input="${(e: any) => this.newMessage = e.target.value}"
                  @keypress="${(e: KeyboardEvent) => e.key === 'Enter' && this.sendMessage(this.newMessage)}"
                />
                <button 
                  @click="${() => this.sendMessage(this.newMessage)}"
                  ?disabled="${this.isSending || !this.newMessage.trim()}"
                  class="bg-indigo-600 text-white p-2.5 rounded-xl disabled:opacity-50 active:scale-95 transition-transform"
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

  renderMessage(msg: any, isSeller: boolean) {
    const isMe = msg.senderId === this.currentUser.id;
    const isSystem = msg.type === 'system';

    if (isSystem) {
      return html`
        <div class="flex justify-center my-2">
          <div class="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100 italic">
            ${msg.content}
          </div>
        </div>
      `;
    }

    return html`
      <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
        <div class="max-w-[85%] ${isMe ? 'bg-indigo-600 text-white rounded-2xl rounded-tr-none shadow-indigo-100' : 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm'} p-3.5 relative">
          ${msg.type === 'offer' ? html`
            <div class="mb-2 p-3 rounded-xl ${isMe ? 'bg-white/10' : 'bg-slate-50'} border ${isMe ? 'border-white/20' : 'border-slate-100'}">
              <span class="text-[9px] font-black uppercase ${isMe ? 'text-indigo-200' : 'text-slate-400'}">Price Proposal</span>
              <div class="text-xl font-black">${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(msg.price)}</div>
              
              ${!isMe && isSeller ? html`
                <div class="flex gap-2 mt-3">
                   <button @click="${() => this.handleAcceptOffer(msg)}" class="flex-1 bg-indigo-600 text-white text-[10px] font-black py-1.5 rounded-lg hover:bg-indigo-700 shadow-sm">ACCEPT</button>
                   <button class="flex-1 bg-white text-slate-400 text-[10px] font-black py-1.5 rounded-lg hover:text-red-500 border border-slate-200">DECLINE</button>
                </div>
              ` : ''}

              ${isMe && msg.content.includes('accepted') && !isSeller ? html`
                <button @click="${this.handleCheckout}" class="w-full mt-3 bg-white text-indigo-600 text-[10px] font-black py-2 rounded-lg hover:bg-indigo-50 shadow-sm uppercase tracking-tighter">
                  Proceed to Checkout
                </button>
              ` : ''}
            </div>
          ` : ''}
          <p class="text-sm leading-relaxed">${msg.content}</p>
          <div class="text-[9px] mt-2 opacity-60 font-medium ${isMe ? 'text-right' : 'text-left'}">
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
