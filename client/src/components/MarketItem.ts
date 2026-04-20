import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('market-item')
export class MarketItem extends LitElement {
  @property({ type: Object }) item: any = {};

  protected createRenderRoot() {
    return this;
  }

  formatPrice(price: number) {
    return `KSh ${price.toLocaleString('en-US')}`;
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
      <div class="group bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden hover:bg-white/10 hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 flex flex-col h-full">
        <!-- Image Container -->
        <div class="aspect-[4/3] overflow-hidden relative cursor-pointer m-2 rounded-2xl" @click="${this.openChat}">
          <div class="absolute inset-0 bg-gradient-to-t from-[#0f111a]/80 to-transparent z-10 opacity-60"></div>
          <img 
            src="${this.item.image}" 
            alt="${this.item.name}" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div class="absolute top-3 right-3 z-20">
             <span class="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-amber-400 shadow-[0_0_10px_rgba(0,0,0,0.5)] border border-white/10">
               ${this.item.sellerName}
             </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-5 flex flex-col flex-grow">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer drop-shadow-sm leading-tight" @click="${this.openChat}">
              ${this.item.name}
            </h3>
          </div>
          <p class="text-sm text-slate-400 line-clamp-2 mb-6 font-medium leading-relaxed">
            ${this.item.description}
          </p>

          <div class="flex items-center justify-between mt-auto pt-5 border-t border-white/10">
            <div class="flex flex-col">
              <span class="text-[10px] font-black text-amber-500/70 uppercase tracking-widest mb-1">Price</span>
              <span class="text-2xl font-black text-white leading-none drop-shadow-md">${this.formatPrice(this.item.price)}</span>
            </div>
            
            <div class="flex gap-3">
              <button 
                @click="${this.openChat}"
                class="p-3 rounded-2xl bg-white/5 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 transition-all border border-white/5 hover:border-amber-500/30" 
                title="Message Seller"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
              <button 
                @click="${this.openChat}"
                class="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-black uppercase tracking-widest hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 border border-white/10"
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
