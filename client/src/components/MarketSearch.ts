import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('market-search')
export class MarketSearch extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="relative max-w-2xl mx-auto">
          <input 
            type="text" 
            placeholder="Search for rare collectibles..." 
            class="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    `;
  }
}
