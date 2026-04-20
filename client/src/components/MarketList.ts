import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './MarketItem';

@customElement('market-list')
export class MarketList extends LitElement {
  @state() items: any[] = [];
  @state() loading = true;
  @state() error = '';
  @state() searchQuery = '';

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.fetchItems();
    window.addEventListener('market-search', this.handleSearch as EventListener);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('market-search', this.handleSearch as EventListener);
  }

  handleSearch = (e: CustomEvent) => {
    this.searchQuery = e.detail.query;
    this.fetchItems();
  }

  async fetchItems() {
    this.loading = true;
    try {
      const url = this.searchQuery 
        ? `/api/items?search=${encodeURIComponent(this.searchQuery)}`
        : '/api/items';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch items');
      this.items = await response.json();
    } catch (err) {
      this.error = 'I couldn\'t load the items. Please try again later.';
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  render() {
    if (this.loading && this.items.length === 0) {
      return html`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div class="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
          <p class="mt-6 text-slate-400 font-medium tracking-wide">Uncovering rare artifacts...</p>
        </div>
      `;
    }

    if (this.error) {
       return html`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div class="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl inline-block shadow-lg">
            ${this.error}
          </div>
        </div>
      `;
    }

    if (this.items.length === 0) {
      return html`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h3 class="text-2xl font-black text-white mb-3">No artifacts found</h3>
          <p class="text-slate-400 text-lg">We couldn't unearth anything matching "${this.searchQuery}".</p>
        </div>
      `;
    }

    return html`
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          ${this.items.map(item => html`
            <market-item .item="${item}"></market-item>
          `)}
        </div>
      </div>
    `;
  }
}
