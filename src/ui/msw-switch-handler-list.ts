import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { getGlobalMultiCaseHandlers } from "../browser";
import { makeKey } from "../utils";

import "./msw-switch-handler-item";

@customElement("msw-switch-handler-list")
export class MswSwitchHandlerList extends LitElement {
  static styles = css`
    ul {
      padding: 1rem;
      margin-top: 0;
      height: 100vh;
      overflow: scroll;
      list-style: none;
    }
  `;

  render() {
    const handlers = getGlobalMultiCaseHandlers();

    return html`<ul>
      ${repeat(
        handlers,
        (handler) => makeKey(handler.method, handler.url),
        (handler) => {
          return html`
            <msw-switch-handler-item
              key=${makeKey(handler.method, handler.url)}
            ></msw-switch-handler-item>
          `;
        }
      )}
    </ul> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "msw-switch-handler-list": MswSwitchHandlerList;
  }
}
