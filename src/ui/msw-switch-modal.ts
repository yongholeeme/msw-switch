import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";

import "./msw-switch-handler-list";

@customElement("msw-switch-modal")
export class MswSwitchModal extends LitElement {
  static styles = css`
    :host {
      z-index: 99999;
      display: inherit;
      position: fixed;
      bottom: 0px;
      right: 0px;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.16);
      backdrop-filter: blur(5px);
    }
  `;

  render() {
    return html`<msw-switch-handler-list></msw-switch-handler-list>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "msw-switch-modal": MswSwitchModal;
  }
}
