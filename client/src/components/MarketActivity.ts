import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

@customElement('market-activity')
export class MarketActivity extends LitElement {
  @state() activities: any[] = [];
  @state() loading = true;

  protected createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.mockActivity();
  }

  mockActivity() {
    // Shifting focus to 'Live Activity Feed' feel
    setTimeout(() => {
      this.activities = [
        { id: 1, type: 'listing', user: 'ComicCollector', item: 'Vintage Comic Book', time: '2 mins ago' },
        { id: 2, type: 'sale', user: 'ToyTrader', item: 'Batman Funko Pop', time: '15 mins ago' },
        { id: 3, type: 'offer', user: 'CardMaster', item: 'Charizard Holo', time: '1 hour ago' }
      ];
      this.loading = false;
    }, 500);
  }

  render() {
    return html`
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 class="text-3xl font-black text-slate-900 mb-8">Recent Activity</h2>
        
        <div class="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          ${this.loading ? html`
            <div class="p-10 text-center">
              <div class="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent inline-block"></div>
            </div>
          ` : html`
            <div class="divide-y divide-slate-100">
              ${this.activities.map(act => html`
                <div class="p-6 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center ${act.type === 'sale' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}">
                    ${act.type === 'sale' ? html`$`: html`+`}
                  </div>
                  <div class="flex-1">
                    <p class="text-sm text-slate-900 font-medium">
                      <span class="font-bold">${act.user}</span> 
                      ${act.type === 'sale' ? 'sold' : act.type === 'offer' ? 'made an offer on' : 'listed'} 
                      <span class="font-bold">${act.item}</span>
                    </p>
                    <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">${act.time}</p>
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
