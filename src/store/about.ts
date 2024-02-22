import { Store } from '../core/base'

interface State {
    photo: string
    name: string
    email: string
    github: string
    repository: string
}

export default new Store<State>({
    photo: 'https://ifh.cc/g/SFxWHF.png',
    name: 'WONMIJIN',
    email: 'mijin950503@gmail.com',
    github: 'https://github.com/wonmijin',
    repository: 'https://github.com/wonmijin/MOVIE'
})