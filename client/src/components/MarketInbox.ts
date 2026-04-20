import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('market-inbox')
export class MarketInbox extends LitElement {
  @state() conversations: any[] = [];
  @state() loading = true;
  
  private currentUser = {
    id: 'user2',
    name: 'NairobiAntiques'
  };

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchConversations();
  }

  async fetchConversations() {
    try {
      // Get unread counts first
      const unreadRes = await fetch(`/api/messages/unread/${this.currentUser.id}`);
      const unreadData = await unreadRes.json();
      
      // Get all items to link them
      const itemsRes = await fetch('/api/items');
      const allItems = await itemsRes.json();
      
      // Filter for items that have unread messages or that the user has interacted with
      this.conversations = allItems.map((item: any) => ({
        ...item,
        unreadCount: unreadData.byItem[item.id] || 0
      })).filter((item: any) => item.unreadCount > 0 || item.sellerId === this.currentUser.id);

    } catch (err) {
      console.error('Failed to fetch inbox:', err);
    } finally {
      this.loading = false;
    }
  }

  openChat(item: any) {
    window.dispatchEvent(new CustomEvent('open-chat', {
        detail: { item },
        bubbles: true,
        composed: true
    }));
  }

  render() {
    return html`
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 class="text-3xl font-black text-white drop-shadow-sm mb-8 tracking-tight">Messages</h2>
        
        <div class="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          ${this.loading ? html`
            <div class="p-15 text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent inline-block shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
            </div>
          ` : this.conversations.length === 0 ? html`
            <div class="p-15 text-center">
              <p class="text-slate-400 text-lg">Your inbox is empty. Start a conversation from the marketplace!</p>
              <a href="/" class="mt-5 inline-block text-amber-500 font-black tracking-widest uppercase hover:text-amber-400 hover:drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all">Go to Marketplace</a>
            </div>
          ` : html`
            <div class="divide-y divide-white/10">
              ${this.conversations.map(item => html`
                <div 
                  @click="${() => this.openChat(item)}"
                  class="p-6 flex items-center gap-5 hover:bg-white/5 cursor-pointer transition-colors duration-300 group"
                >
                  <div class="relative">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0f111a]/50 to-transparent rounded-2xl z-10"></div>
                    <img src="${item.image}" class="w-20 h-20 rounded-2xl object-cover shadow-[0_4px_15px_rgba(0,0,0,0.3)] border border-white/5 relative z-0" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-1">
                      <h3 class="text-lg font-black text-white group-hover:text-amber-400 transition-colors truncate drop-shadow-sm">${item.name}</h3>
                      ${item.unreadCount > 0 ? html`
                        <span class="bg-amber-500 text-[#0f111a] text-[10px] font-black px-3 py-1 rounded-full animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                          ${item.unreadCount} NEW
                        </span>
                      ` : ''}
                    </div>
                    <p class="text-sm font-medium text-slate-400 truncate">Talk to ${item.sellerName}</p>
                  </div>
                  <div class="text-white/20 group-hover:text-amber-500 group-hover:translate-x-1 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
              `)}
            </div>
          `}
        </div>
      </div>
    `;
  }
}
