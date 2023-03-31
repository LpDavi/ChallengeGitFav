export class GithubUser {
    static search(username) { //Ao ter um método "static" eu não preciso colocar um método NEW ao chama-la
        const endpoint = `https://api.github.com/users/${username}`

        /*O fetch() busca os dados na URL que eu colocar, no caso "endpoint"
        O fetch() também é uma promess, então se usa o THEN e QUANDO ele terminar essa tarefa, ele executa a função*/ 
        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}

/*Todo esse código de API do Github eu posso pegar e usar em qualquer outro código que eu quiser usar*/ 