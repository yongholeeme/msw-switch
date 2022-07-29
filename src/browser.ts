import { ResponseResolver, rest, RestHandler, setupWorker } from "msw";
import Cookies from "js-cookie";
import { makeKey } from "./utils";
import drawUi from "./ui";

export type MultipleCaseHandler = {
  url: string;
  method:
    | "all"
    | "head"
    | "get"
    | "post"
    | "put"
    | "delete"
    | "patch"
    | "options";
  description?: string;
  responseResolvers: Record<string, ResponseResolver>;
};

const globalMultipleCaseHandlers: MultipleCaseHandler[] = [];

export const getGlobalMultipleCaseHandlers = () => globalMultipleCaseHandlers;

const switchMock = (
  method: MultipleCaseHandler["method"],
  url: MultipleCaseHandler["url"],
  switchedCase: string
) => {
  const targetCase = globalMultipleCaseHandlers.find(
    (handler) => makeKey(handler.method, handler.url) === makeKey(method, url)
  );

  if (!targetCase) {
    throw new Error(`[${method}] ${url}에 모킹된 핸들러가 없습니다.`);
  }

  if (!targetCase.responseResolvers[switchedCase]) {
    throw new Error(
      `[${method}] ${url} 핸들러 '${switchedCase}' 케이스에 모킹된 핸들러가 없습니다.`
    );
  }

  Cookies.set(makeKey(method, url), switchedCase);
};

const getCurrentResponseResolver = (
  method: MultipleCaseHandler["method"],
  url: MultipleCaseHandler["url"]
) => {
  const targetCase = globalMultipleCaseHandlers.find(
    (handler) => makeKey(handler.method, handler.url) === makeKey(method, url)
  );

  if (!targetCase) {
    throw new Error(`[${method}] ${url}에 모킹된 핸들러가 없습니다.`);
  }

  const currentCase = Cookies.get(makeKey(method, url));

  if (currentCase) {
    return targetCase.responseResolvers[currentCase];
  }

  const defaultCase = Object.keys(targetCase.responseResolvers)[0];

  switchMock(method, url, defaultCase);

  return targetCase.responseResolvers[defaultCase];
};

export const setUpMswSwitchWorker = (
  ...handlers: (MultipleCaseHandler | RestHandler)[]
) => {
  const singleCaseHandlers: RestHandler[] = [];
  const multipleCaseHandlers: MultipleCaseHandler[] = [];

  handlers.forEach((handler) => {
    if (
      "method" in handler &&
      "url" in handler &&
      "responseResolvers" in handler
    ) {
      multipleCaseHandlers.push(handler);
      return;
    }

    singleCaseHandlers.push(handler);
  });

  globalMultipleCaseHandlers.push(...multipleCaseHandlers);
  drawUi();

  const customHandlers = multipleCaseHandlers.map(({ method, url }) =>
    rest[method](url, getCurrentResponseResolver(method, url))
  );

  return setupWorker(...singleCaseHandlers, ...customHandlers);
};
