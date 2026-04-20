import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('market-header')
export class MarketHeader extends LitElement {
  @state() isListingOpen = false;
  @state() isSubmitting = false;
  @state() formName = '';
  @state() formPrice = '';
  @state() formDesc = '';

  protected createRenderRoot() {
    return this;
  }

  async handleListSubmit(e: Event) {
    e.preventDefault();
    if (!this.formName || !this.formPrice) return;

    this.isSubmitting = true;
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.formName,
          description: this.formDesc,
          price: parseFloat(this.formPrice.replace(/,/g, '')),
          // We default newly listed items to a beautiful generic artifact placeholder image
          image: '/images/tingatinga.jpg',
          sellerId: 'user2',
          sellerName: 'NairobiAntiques'
        })
      });

      if (response.ok) {
        this.isListingOpen = false;
        this.formName = '';
        this.formPrice = '';
        this.formDesc = '';
        // Refresh the marketplace feed
        window.dispatchEvent(new CustomEvent('market-search', { detail: { query: '' }, bubbles: true, composed: true }));
      }
    } catch (err) {
      console.error('Failed to list item:', err);
    } finally {
      this.isSubmitting = false;
    }
  }

  render() {
    const path = window.location.pathname;
    return html`
      <header class="bg-[#0f111a]/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-50 transition-all shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div class="flex items-center gap-3 cursor-pointer" @click="${() => window.location.href = '/'}">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500 hover:text-amber-400 transition-all drop-shadow-[0_0_15px_rgba(245,158,11,0.6)] hover:scale-105 duration-500">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            <h1 class="text-2xl font-black text-white tracking-tighter">Post<span class="text-amber-500">.</span></h1>
          </div>
          
          <nav class="hidden md:flex items-center gap-8 bg-white/5 rounded-full px-6 py-2 border border-white/10 backdrop-blur-md">
            <a href="/" class="text-sm font-bold tracking-wide ${path === '/' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400 hover:text-white'} transition-all">Marketplace</a>
            <a href="/messages" class="text-sm font-bold tracking-wide ${path === '/messages' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400 hover:text-white'} transition-all">Messages</a>
            <a href="/activity" class="text-sm font-bold tracking-wide ${path === '/activity' ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-slate-400 hover:text-white'} transition-all">Activity</a>
          </nav>
          
          <div class="flex items-center gap-5">
            <button @click="${() => this.isListingOpen = true}" class="hidden sm:block text-xs font-black text-white bg-white/10 hover:bg-amber-500 hover:text-[#0f111a] hover:border-amber-500 px-5 py-2.5 rounded-xl transition-all duration-300 border border-white/10 uppercase tracking-widest hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              List Item
            </button>
            <div class="w-10 h-10 rounded-full ring-2 ring-amber-500 ring-offset-2 ring-offset-[#0f111a] cursor-pointer overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.5)] transition-transform hover:scale-110">
               <img src="https://ui-avatars.com/api/?name=User&background=f59e0b&color=fff&bold=true" alt="Profile" class="w-full h-full object-cover"/>
            </div>
          </div>
        </div>
      </header>

      ${this.isListingOpen ? html`
        <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-[#0f111a]/90 backdrop-blur-lg" @click="${() => this.isListingOpen = false}"></div>
          <div class="relative w-full max-w-lg bg-[#1a1d2e] border border-white/10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in zoom-in-95 duration-300">
            <div class="px-8 py-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 class="text-2xl font-black text-white tracking-tight drop-shadow-md">New Discovery</h3>
              <button @click="${() => this.isListingOpen = false}" class="text-slate-400 hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form @submit="${this.handleListSubmit}" class="p-8 space-y-6">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-amber-500/80 mb-2">Artifact Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="E.g., Vintage Railway Clock"
                  class="w-full bg-[#0f111a] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
                  .value="${this.formName}"
                  @input="${(e: any) => this.formName = e.target.value}"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-amber-500/80 mb-2">Asking Price (KSh)</label>
                <input 
                  type="number" 
                  required
                  placeholder="0"
                  class="w-full bg-[#0f111a] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner"
                  .value="${this.formPrice}"
                  @input="${(e: any) => this.formPrice = e.target.value}"
                />
              </div>

              <div>
                <label class="block text-[10px] font-black uppercase tracking-widest text-amber-500/80 mb-2">History & Details</label>
                <textarea 
                  rows="3"
                  placeholder="Tell the story behind this item..."
                  class="w-full bg-[#0f111a] border border-white/10 rounded-2xl px-5 py-3.5 text-white font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all shadow-inner resize-none"
                  .value="${this.formDesc}"
                  @input="${(e: any) => this.formDesc = e.target.value}"
                ></textarea>
              </div>

              <div class="pt-4">
                <button 
                  type="submit" 
                  ?disabled="${this.isSubmitting}"
                  class="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-[#0f111a] font-black py-4 rounded-2xl uppercase tracking-widest hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
                >
                  ${this.isSubmitting ? 'Publishing...' : 'List on Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ` : ''}
    `;
  }
}
