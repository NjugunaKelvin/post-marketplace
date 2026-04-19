import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('market-header')
export class MarketHeader extends LitElement {
  // Rendering into light DOM to share global Tailwind styles easily
  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <header class="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
              <span class="text-white font-bold text-xl tracking-tighter">P</span>
            </div>
            <h1 class="text-xl font-bold text-slate-900 tracking-tight">Post.</h1>
          </div>
          
          <nav class="hidden md:flex items-center gap-8">
            <a href="/" class="text-sm font-semibold text-indigo-600">Marketplace</a>
            <a href="/messages" class="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Messages</a>
            <button class="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Activity</button>
          </nav>
          
          <div class="flex items-center gap-4">
            <button class="hidden sm:block text-sm font-semibold text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
              List Item
            </button>
            <div class="w-8 h-8 rounded-full bg-slate-200 border border-slate-100 cursor-pointer overflow-hidden">
               <img src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff" alt="Profile" />
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
