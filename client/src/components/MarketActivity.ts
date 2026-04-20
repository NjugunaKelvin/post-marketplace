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
    this.loadRecentActivity();
  }

  loadRecentActivity() {
    setTimeout(() => {
      this.activities = [
        { id: 1, type: 'listing', user: 'CurioMaster', item: 'Hand-Carved Maasai Shield', time: '2 mins ago' },
        { id: 2, type: 'sale', user: 'NairobiAntiques', item: 'Vintage 1966 Kenya Shilling Coin', time: '15 mins ago' },
        { id: 3, type: 'offer', user: 'HeritageFinds', item: 'Original Tingatinga Painting', time: '1 hour ago' }
      ];
      this.loading = false;
    }, 500);
  }

  render() {
    return html`
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 class="text-3xl font-black text-white drop-shadow-sm mb-8 tracking-tight">Recent Activity</h2>
        
        <div class="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          ${this.loading ? html`
            <div class="p-15 text-center">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent inline-block shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
            </div>
          ` : html`
            <div class="divide-y divide-white/10">
              ${this.activities.map(act => html`
                <div class="p-6 flex items-center gap-5 hover:bg-white/5 transition-colors duration-300">
                  <div class="w-12 h-12 rounded-full flex items-center justify-center border font-black text-lg ${act.type === 'sale' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-amber-500/20 text-amber-500 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'}">
                    ${act.type === 'sale' ? html`KSh`: html`+`}
                  </div>
                  <div class="flex-1">
                    <p class="text-[15px] text-slate-300 font-medium leading-relaxed">
                      <span class="font-black text-white">${act.user}</span> 
                      ${act.type === 'sale' ? 'sold' : act.type === 'offer' ? 'made an offer on' : 'listed'} 
                      <span class="font-black text-amber-400">${act.item}</span>
                    </p>
                    <p class="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">${act.time}</p>
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
