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
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
          <p class="mt-4 text-slate-500 font-medium">Loading the latest collectibles...</p>
        </div>
      `;
    }

    if (this.error) {
       return html`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div class="bg-red-50 text-red-600 p-4 rounded-xl inline-block">
            ${this.error}
          </div>
        </div>
      `;
    }

    if (this.items.length === 0) {
      return html`
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h3 class="text-xl font-bold text-slate-900 mb-2">No items found</h3>
          <p class="text-slate-500">I couldn't find anything matching "${this.searchQuery}". Try a different keyword.</p>
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
