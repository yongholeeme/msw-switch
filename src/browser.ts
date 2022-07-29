import {ResponseResolver, rest, RestHandler, setupWorker} from 'msw'
import Cookies from 'js-cookie'
import {makeKey} from './utils'
import drawUi from './ui'

export type CaseHandler = {
    url: string
    method: 'all' | 'head' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options'
    description?: string
    responseResolvers: Record<string, ResponseResolver>
}

const globalMultiCaseHandlers: CaseHandler[] = []

export const getGlobalMultiCaseHandlers = () => globalMultiCaseHandlers

const switchMock = (method: CaseHandler['method'], url: CaseHandler['url'], switchedCase: string) => {
    const targetCase = globalMultiCaseHandlers.find(
        (handler) => makeKey(handler.method, handler.url) === makeKey(method, url),
    )

    if (!targetCase) {
        throw new Error(`[${method}] ${url}에 모킹된 핸들러가 없습니다.`)
    }

    if (!targetCase.responseResolvers[switchedCase]) {
        throw new Error(`[${method}] ${url} 핸들러 '${switchedCase}' 케이스에 모킹된 핸들러가 없습니다.`)
    }

    Cookies.set(makeKey(method, url), switchedCase)
}

const getCurrentResponseResolver = (method: CaseHandler['method'], url: CaseHandler['url']) => {
    const targetCase = globalMultiCaseHandlers.find(
        (handler) => makeKey(handler.method, handler.url) === makeKey(method, url),
    )

    if (!targetCase) {
        throw new Error(`[${method}] ${url}에 모킹된 핸들러가 없습니다.`)
    }

    const currentCase = Cookies.get(makeKey(method, url))

    if (currentCase) {
        return targetCase.responseResolvers[currentCase]
    }

    const defaultCase = Object.keys(targetCase.responseResolvers)[0]

    switchMock(method, url, defaultCase)

    return targetCase.responseResolvers[defaultCase]
}

export const setUpMswSwitchWorker = (...handlers: (CaseHandler | RestHandler)[]) => {
    const singleCaseHandlers: RestHandler[]  = []
    const multiCaseHandlers: CaseHandler[]  = []

    handlers.forEach((handler) => {
        if ('method' in handler) {
            multiCaseHandlers.push(handler)
            return
        }

        singleCaseHandlers.push(handler)
    })

    globalMultiCaseHandlers.push(...multiCaseHandlers)
    drawUi()

    const customHandlers = multiCaseHandlers.map(({method, url}) => {
        const currentResolver = getCurrentResponseResolver(method, url)

        return rest[method](url, currentResolver)
    })
    
    
    return setupWorker(...singleCaseHandlers, ...customHandlers)
}
