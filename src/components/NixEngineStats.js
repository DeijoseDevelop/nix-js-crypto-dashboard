import { html } from "@deijose/nix-js";

export const NixEngineStats = () => {

    return html`
        <div class="card nix-engine-card glow-hover">
            <div class="engine-header">
                <h3 class="section-title" style="margin: 0; display: flex; align-items: center; gap: 8px;">
                    <span class="pulse-dot" style="background: var(--accent-primary)"></span> Powered by Nix.js
                </h3>
            </div>
            <div class="engine-stats">
                <div class="engine-stat"><span class="stat-lbl">Virtual DOM</span><strong class="stat-val highlight">0 KB</strong></div>
                <div class="engine-stat"><span class="stat-lbl">Reactivity</span><strong class="stat-val">100% Signals</strong></div>
                <div class="engine-stat"><span class="stat-lbl">Bundle Size</span><strong class="stat-val">~10 KB <small>gzip</small></strong></div>
            </div>
            <div class="engine-footer">
                <a href="https://nix-js-landing.vercel.app/" target="_blank" class="engine-link">
                    Read Documentation <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </a>
            </div>
        </div>
    `;
}