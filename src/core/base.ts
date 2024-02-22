// Component //
interface ComponentPayload {
    tagName?: string
    props?: {
        [key: string]: unknown
    }
    state?: {
        [key: string]: unknown
    }
}

export class Component {
    public el
    public props
    public state
    constructor(payload: ComponentPayload = {}) {
        const {
            tagName = 'div',
            props = {},
            state = {}
        } = payload
        this.el = document.createElement(tagName)
        this.props = props
        this.state = state
        this.render()
    }
    render() {
        //...
    }
}



// Router (페이지 렌더링) //
interface Route {
    path: string
    component: typeof Component
}
type Routes = Route[]

function routeRender(routes: Routes) {
    if (!location.hash) {
        history.replaceState(null, '', '/#/')
    }
    const routerView = document.querySelector('router-view')
    const [hash, queryString = ''] = location.hash.split('?')

    // 쿼리스트리밍을 객체로 변환해 히스토리의 상태에 저장
    interface Query {
        [key:string]: string
    }
    const query = queryString
    .split('&')
    .reduce((acc, cur) => {
        const [key, value] = cur.split('=')
        acc[key] = value
        return acc
    }, {} as Query)
    history.replaceState(query, '')

    // 현재 라우트 정보를 찾아서 렌더링
    const currentRoute = routes
        .find(route => new RegExp(`${route.path}/?$`).test(hash))
    if (routerView) {
        routerView.innerHTML = ''
        currentRoute && routerView.append(new currentRoute.component().el)
    }


    // 화면 출력 후 스크롤 위치 복구
    window.scrollTo(0, 0)
}

export function createRouter(routes: Routes) {
    // 필요한 곳에서 호출할 수 있도록 함수 데이터를 반환
    return function () {
        window.addEventListener('popstate', () => {
            routeRender(routes)
        })
        routeRender(routes)
    }
}

// Store //
interface StoreObservers {
    [key:string]: SubscribeCallback[]
}
interface SubscribeCallback {
    (arg: unknown): void
}
export class Store<S> {
    public state = {} as S
    private observers = {} as StoreObservers
    constructor(state: S) {        
        for(const key in state) {
            Object.defineProperty(this.state, key, {
                get: () => state[key],
                set: val => {
                    state[key] = val
                    if (Array.isArray(this.observers[key])) {
                        this.observers[key].forEach(observer => observer(val))
                    }
                }
            })
        }
    }
    // 상태 변경 구독
    subscribe(key: string, cb: SubscribeCallback) {
        Array.isArray(this.observers[key])
            ? this.observers[key].push(cb)
            : this.observers[key] = [cb] 
    }
}