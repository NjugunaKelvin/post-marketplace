import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('market-item')
export class MarketItem extends LitElement {
  @property({ type: Object }) item: any = {};

  protected createRenderRoot() {
    return this;
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  }

  openChat() {
    window.dispatchEvent(new CustomEvent('open-chat', {
      detail: { item: this.item },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <div class="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
        <!-- Image Container -->
        <div class="aspect-[4/3] overflow-hidden relative cursor-pointer" @click="${this.openChat}">
          <img 
            src="${this.item.image}" 
            alt="${this.item.name}" 
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div class="absolute top-3 right-3">
             <span class="bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-700 shadow-sm border border-slate-100 uppercase">
               ${this.item.sellerName}
             </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 flex flex-col h-[200px]">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 cursor-pointer" @click="${this.openChat}">
              ${this.item.name}
            </h3>
          </div>
          <p class="text-sm text-slate-500 line-clamp-2 mb-4">
            ${this.item.description}
          </p>

          <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Price</span>
              <span class="text-lg font-black text-slate-900 leading-none">${this.formatPrice(this.item.price)}</span>
            </div>
            
            <div class="flex gap-2">
              <button 
                @click="${this.openChat}"
                class="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100" 
                title="Message Seller"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button 
                @click="${this.openChat}"
                class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
              >
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
