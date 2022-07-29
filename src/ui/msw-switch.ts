import { LitElement, html } from "lit";
import { customElement, state } from "lit/decorators.js";

import "./msw-switch-toggle-button";
import "./msw-switch-modal";

@customElement("msw-switch")
export class MswSwitch extends LitElement {
  @state()
  isOpened = false;

  private _openModal(event: Event) {
    this.isOpened = true;
  }

  render() {
    if (this.isOpened) {
      return html` <msw-switch-modal></msw-switch-modal> `;
    }

    return html`
      <msw-switch-toggle-button
        @click="${this._openModal}"
      ></msw-switch-toggle-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "msw-switch": MswSwitch;
  }
}
