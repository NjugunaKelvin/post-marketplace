import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('market-search')
export class MarketSearch extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  handleInput(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    window.dispatchEvent(new CustomEvent('market-search', {
      detail: { query: input.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pb-12 text-center">
        <h2 class="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 vi-yellow-400 to-orange-500 mb-6 tracking-tight drop-shadow-sm">
          Discover African Heritage.
        </h2>
        <p class="text-slate-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
          Collect, trade, and own extraordinary artifacts and vintage treasures.
        </p>

        <div class="relative max-w-2xl mx-auto group">
          <div class="absolute -inset-1 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div class="relative">
            <input 
              type="text" 
              placeholder="Search for rare collectibles..." 
              class="w-full bg-[#1a1d2e]/80 backdrop-blur-xl border border-white/10 text-white placeholder-slate-500 rounded-3xl py-5 pl-14 pr-6 shadow-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg font-medium tracking-wide"
              @input="${this.handleInput}"
            />
            <div class="absolute left-5 top-1/2 -translate-y-1/2 text-amber-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
