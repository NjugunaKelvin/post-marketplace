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

  private currentUser = {
    id: 'user2',
    name: 'NairobiAntiques'
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
      await this.sendMessage(`Offer of KSh ${msg.price.toLocaleString('en-US')} accepted! You can now proceed to checkout.`, 'system');
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
        <div class="absolute inset-0 bg-[#0f111a]/80 backdrop-blur-md" @click="${this.closeChat}"></div>
        <div class="relative w-full max-w-md bg-[#1a1d2e] h-full shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-300">
          
          <div class="p-5 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-xl sticky top-0">
            <div class="flex items-center gap-4">
              <button @click="${this.closeChat}" class="p-2 -ml-2 text-slate-400 hover:text-white transition-colors hover:bg-white/5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div>
                <h3 class="font-bold text-white text-lg leading-tight tracking-tight">${this.item?.name}</h3>
                <p class="text-xs text-amber-500/80 font-medium">${isSeller ? 'Your Listing' : 'Messaging ' + this.item?.sellerName}</p>
              </div>
            </div>
            ${this.item?.paymentStatus === 'paid' && isSeller ? html`
              <button @click="${this.handleConfirmSale}" class="bg-amber-500 text-[#0f111a] text-[10px] font-black px-4 py-2 rounded-xl hover:bg-amber-400 animate-pulse tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                CONFIRM SALE
              </button>
            ` : ''}
          </div>

          <div id="message-container" class="flex-1 overflow-y-auto p-5 space-y-5 bg-transparent">
            ${this.messages.length === 0 ? html`
              <div class="text-center py-10">
                <p class="text-sm text-slate-500 font-medium italic">Start the conversation...</p>
              </div>
            ` : this.messages.map(msg => this.renderMessage(msg, isSeller))}
          </div>

          <div class="p-5 border-t border-white/10 bg-white/5 backdrop-blur-xl">
            ${this.item?.paymentStatus === 'paid' ? html`
              <div class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 p-4 rounded-2xl text-center font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                Payment Received. Waiting for seller confirmation.
              </div>
            ` : this.showOfferForm ? this.renderOfferForm() : html`
              <div class="flex items-center gap-2 mb-4">
                 ${!isSeller ? html`
                   <button @click="${() => this.showOfferForm = true}" class="text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full hover:bg-amber-500/20 transition-all uppercase tracking-widest">
                     Propose Price
                   </button>
                 ` : ''}
              </div>
              <div class="flex gap-3">
                <input 
                  type="text" 
                  placeholder="Type a message..."
                  class="flex-1 bg-[#0f111a] border border-white/10 text-white placeholder-slate-500 rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
                  .value="${this.newMessage}"
                  @input="${(e: any) => this.newMessage = e.target.value}"
                  @keypress="${(e: KeyboardEvent) => e.key === 'Enter' && this.sendMessage(this.newMessage)}"
                />
                <button 
                  @click="${() => this.sendMessage(this.newMessage)}"
                  ?disabled="${this.isSending || !this.newMessage.trim()}"
                  class="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-3 rounded-2xl disabled:opacity-50 active:scale-95 transition-transform shadow-[0_0_15px_rgba(245,158,11,0.3)] disabled:shadow-none hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
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
        <div class="flex justify-center my-3">
          <div class="bg-amber-500/10 text-amber-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            ${msg.content}
          </div>
        </div>
      `;
    }

    return html`
      <div class="flex ${isMe ? 'justify-end' : 'justify-start'} group/msg">
        <div class="max-w-[85%] ${isMe ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl rounded-tr-[4px] shadow-[0_4px_15px_rgba(245,158,11,0.3)]' : 'bg-white/10 backdrop-blur-md text-white rounded-3xl rounded-tl-[4px] border border-white/10 shadow-lg'} p-4 relative transition-transform hover:-translate-y-0.5">
          ${msg.type === 'offer' ? html`
            <div class="mb-3 p-4 rounded-2xl ${isMe ? 'bg-white/20' : 'bg-[#0f111a]/50'} border ${isMe ? 'border-white/30' : 'border-white/5'}">
              <span class="text-[9px] font-black uppercase tracking-widest ${isMe ? 'text-amber-100' : 'text-slate-400'}">Price Proposal</span>
              <div class="text-2xl font-black mt-1 drop-shadow-sm">KSh ${msg.price.toLocaleString('en-US')}</div>
              
              ${!isMe && isSeller ? html`
                <div class="flex gap-2 mt-4">
                   <button @click="${() => this.handleAcceptOffer(msg)}" class="flex-1 bg-amber-500 text-[#0f111a] text-[10px] font-black py-2 rounded-xl hover:bg-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-all">ACCEPT</button>
                   <button class="flex-1 bg-white/5 text-slate-300 text-[10px] font-black py-2 rounded-xl hover:text-red-400 border border-white/10 hover:border-red-400/50 transition-all">DECLINE</button>
                </div>
              ` : ''}

              ${isMe && msg.content.includes('accepted') && !isSeller ? html`
                <button @click="${this.handleCheckout}" class="w-full mt-4 bg-white text-orange-600 text-xs font-black py-3 rounded-xl hover:bg-white/90 shadow-lg uppercase tracking-widest transition-all">
                  Proceed to Checkout
                </button>
              ` : ''}
            </div>
          ` : ''}
          <p class="text-[15px] leading-relaxed font-medium drop-shadow-sm">${msg.content}</p>
          <div class="text-[9px] mt-2 opacity-50 font-black uppercase tracking-widest ${isMe ? 'text-right' : 'text-left'}">
            ${this.formatTime(msg.timestamp)}
          </div>
        </div>
      </div>
    `;
  }

  renderOfferForm() {
    return html`
      <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2 bg-white/5 border border-white/10 p-4 rounded-2xl mb-4">
        <div class="flex justify-between items-center">
          <h4 class="text-sm font-bold text-white uppercase tracking-widest">Make an offer</h4>
          <button @click="${() => this.showOfferForm = false}" class="text-xs font-black text-slate-400 hover:text-white uppercase tracking-wider">Cancel</button>
        </div>
        <div class="flex gap-3">
          <div class="relative flex-1">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 font-black text-xs">KSh</span>
            <input 
              type="number" 
              placeholder="0"
              class="w-full bg-[#0f111a] border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm font-bold text-white focus:ring-2 focus:ring-amber-500 transition-all shadow-inner"
              .value="${this.offerAmount}"
              @input="${(e: any) => this.offerAmount = e.target.value}"
            />
          </div>
          <button 
            @click="${() => this.sendMessage(`I'd like to offer KSh ${parseFloat(this.offerAmount).toLocaleString('en-US')} for this.`, 'offer', parseFloat(this.offerAmount))}"
            ?disabled="${this.isSending || !this.offerAmount}"
            class="bg-amber-500 text-[#0f111a] px-5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:shadow-none"
          >
            Send Offer
          </button>
        </div>
      </div>
    `;
  }
}
