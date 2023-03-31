import { GithubUser } from "./githubUser.js"

/*Classe que vai conter a lógica dos dados e como os dados serão estruturados*/
export class Fav {
    constructor(root) {  //Neste momento o "constructor" é o "#app"
        this.root = document.querySelector(root)
        this.load()

        //GithubUser.search('').then(user => (user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-Fav:')) || []
    }

    save () {
        localStorage.setItem('@github-Fav:', JSON.stringify(this.entries))
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists) {
                throw new Error('Usuário ja cadastrado!')
            }

            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(error) {
            alert(error.message)
        }

    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
        // O filter esta rodando uma função para cada entrada, cada entrada se chama "entry"
        // Se o Filter receber um elemento false, ele vai remover o elemento, seguindo o princípio da imutabilidade
        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

/*Classe que vair criar a visualização e eventos do HTML*/
export class FavView extends Fav {
    constructor(root) { //Agora o root é o "#app" e com o super(root) eu passo ele para a classe "class Fav"
        super(root)

        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onadd()
    }

    onadd() {
        const addButton = this.root.querySelector('.favorit')
        addButton.onclick = () => { 
            const { value } = this.root.querySelector('#input-search')
            this.add(value)
         }
    }

    update() { 
        this.removeAllTr() //Tirando a table com JS

        this.entries.forEach(user => { // Para cada "usuário" ele tem que passar por essas alterações
            const row = this.creatRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOK = confirm('Tem certeza que deseja deletar essa linha?')
                    if(isOK) {
                        this.delete(user)
                }
            }

            this.tbody.append(row)
        })

    }
    
    creatRow() { // Criando a table com JS
        const tr = document.createElement('tr') // Criando o  "tr" com a DOM

        tr.innerHTML = ` 
        <td class="user">
          <img
            src="https://github.com/LpDavi.png"
            alt="imagem do github de Davi Lima"
          />
          <a href="https://github.com/Lpdavi" target="_blank">
            <p>Davi Lima</p>
            <span>/LpDavi</span>
          </a>
        </td>
        <td class="repositories">4</td>
        <td class="followers">7</td>
        <td>
          <button class="remove">Remover</button>
        </td>
        <td></td>
        ` // Inserindo essa template literal dentro do "tr"
        return tr
    }

    removeAllTr() { //Essa função está tirando a tabela do HTML para depois colocar a table com JS
        this.tbody.querySelectorAll('tr').forEach((tr) => {
           tr.remove()
        })
    }
}