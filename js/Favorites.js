export class GithubUser{
  static search(username){
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({login, name, public_repos, followers}) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }
}
export class Favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()

    GithubUser.search('paulinhoteixeira').then(user => console.log(user))
  }

  load(){

    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  delete(user){
    const filteredEntries = this.entries
      .filter((entry) => entry.login !== user.login)
    
    this.entries = filteredEntries
    this.update()
  }
}

export class FavoriteView extends Favorites{
  constructor(root){
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.update()
  }

  update(){
   this.removeAllTr()

   
   
   this.entries.forEach(user => {
    const row = this.createRow()

    row.querySelector('td img').src = `https://github.com/${user.login}.png`
    row.querySelector('td img').alt = `Foto de ${user.name}`
    row.querySelector('.name').textContent = user.name
    row.querySelector('.user').textContent = `${user.login}`
    row.querySelector('.repositories').textContent = user.public_repos
    row.querySelector('.followers').textContent = user.followers

    row.querySelector('.remove').onclick = () => {
      const isOk = confirm("Tem certeza que deseja deletar essa linha?")

      if(isOk){
        this.delete(user)
      }
    }

    this.tbody.append(row)
   })
   
  }

  createRow() {
    const tr = document.createElement('tr')
    tr.innerHTML = `
   <tr>
          <td>
            <img src="./assets/Ellipse 3.svg" alt="">
            <div class="info-user">
              <div class="name">Mayk Brito</div>
              <div class="user">/maykbrito</div>
            </div>
          </td>
          <td class="repositories">123</td>
          <td class="followers">1234</td>
          <td class="remove">Remover</td>
        </tr>  
   `
    return tr
   
  }

  removeAllTr() {

    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }
}