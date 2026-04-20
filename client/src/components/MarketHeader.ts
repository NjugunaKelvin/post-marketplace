import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('market-header')
export class MarketHeader extends LitElement {
  protected createRenderRoot() {
    return this;
  }

  render() {
    const path = window.location.pathname;
    return html`
      <header class="bg-white border-b border-slate-200 sticky top-0 z-50 transition-all shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div class="flex items-center gap-2 cursor-pointer" @click="${() => window.location.href = '/'}">
            <div class="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
              <span class="text-white font-bold text-xl tracking-tighter">P</span>
            </div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight">Post.</h1>
          </div>
          
          <nav class="hidden md:flex items-center gap-8">
            <a href="/" class="text-sm font-bold ${path === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors">Marketplace</a>
            <a href="/messages" class="text-sm font-bold ${path === '/messages' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors">Messages</a>
            <a href="/activity" class="text-sm font-bold ${path === '/activity' ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'} transition-colors">Activity</a>
          </nav>
          
          <div class="flex items-center gap-4">
            <button class="hidden sm:block text-xs font-black text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all border border-slate-200 uppercase tracking-widest">
              List Item
            </button>
            <div class="w-8 h-8 rounded-full bg-slate-200 border border-slate-100 cursor-pointer overflow-hidden shadow-sm">
               <img src="https://ui-avatars.com/api/?name=User&background=4f46e5&color=fff" alt="Profile" />
            </div>
          </div>
        </div>
      </header>
    `;
  }
}
