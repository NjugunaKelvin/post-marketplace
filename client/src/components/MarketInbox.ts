import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('market-inbox')
export class MarketInbox extends LitElement {
  @state() conversations: any[] = [];
  @state() loading = true;
  
  private currentUser = {
    id: 'user2',
    name: 'ToyTrader'
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
      // For this demo, we'll just show items that have messages
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
        <h2 class="text-3xl font-black text-slate-900 mb-8">Messages</h2>
        
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          ${this.loading ? html`
            <div class="p-10 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent inline-block"></div>
            </div>
          ` : this.conversations.length === 0 ? html`
            <div class="p-10 text-center">
              <p class="text-slate-500">Your inbox is empty. Start a conversation from the marketplace!</p>
              <a href="/" class="mt-4 inline-block text-indigo-600 font-bold hover:underline">Go to Marketplace</a>
            </div>
          ` : html`
            <div class="divide-y divide-slate-100">
              ${this.conversations.map(item => html`
                <div 
                  @click="${() => this.openChat(item)}"
                  class="p-5 flex items-center gap-4 hover:bg-slate-50 cursor-pointer transition-colors group"
                >
                  <img src="${item.image}" class="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                      <h3 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">${item.name}</h3>
                      ${item.unreadCount > 0 ? html`
                        <span class="bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded-full animate-bounce">
                          ${item.unreadCount} NEW
                        </span>
                      ` : ''}
                    </div>
                    <p class="text-xs text-slate-500 truncate mt-1">Talk to ${item.sellerName}</p>
                  </div>
                  <div class="text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
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
