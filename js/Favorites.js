import { GithubUser } from "./GithubUser.js";
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries));
  }

  async add(username) {
    try {
      const userExists = this.entries.find((entry) => entry.login === username);
      if (userExists) {
        throw new Error("Usuário já cadastrado");
      }

      const user = await GithubUser.search(username);

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado");
      }

      this.entries = [user, ...this.entries];
      this.update();
      this.save();
    } catch (error) {
      alert(error.message);
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      (entry) => entry.login !== user.login
    );

    this.entries = filteredEntries;
    this.update();
    this.save();
  }
}

export class FavoriteView extends Favorites {
  constructor(root) {
    super(root);
    this.tbody = this.root.querySelector("table tbody");

    this.update();
    this.onadd();
  }

  onadd() {
    const addButton = document.querySelector("#to-favorite button");
    addButton.onclick = () => {
      const { value } = document.querySelector("input");

      this.add(value);
    };
  }

  

  update() {
    if (this.entries.length == 0) {
      const emptyTable = this.emptyTable()
      this.removeAllTr();
      this.tbody.append(emptyTable);
    } else {
      this.removeAllTr();
    }

    this.entries.forEach((user) => {
      const row = this.createRow();

      row.querySelector("td img").src = `https://github.com/${user.login}.png`;
      row.querySelector("td img").alt = `Foto de ${user.name}`;
      row.querySelector(".name").textContent = user.name;
      row.querySelector(".user").textContent = `${user.login}`;
      row.querySelector(".repositories").textContent = user.public_repos;
      row.querySelector(".followers").textContent = user.followers;

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja deletar essa linha?");

        if (isOk) {
          this.delete(user);
        }
      };

      this.tbody.append(row);
    });
  }

  emptyTable() {
    const trEmpty = document.createElement("tr");
    trEmpty.innerHTML = `
      <tr >
          <td class="empty-table">
            <img src="./assets/Estrela.svg" alt="">
            <p>Nenhum favorito ainda</p>
          </td>
        </tr>
    `;

    return trEmpty;
  }

  createRow() {
    const tr = document.createElement("tr");
    tr.innerHTML = `
   <tr>
          <td>
            <img src="./assets/Ellipse 3.svg" alt="">
            <div class="info-user">
              <div class="name">Paulo Teixeira</div>
              <div class="user">/paulinhoteixeira</div>
            </div>
          </td>
          <td class="repositories">123</td>
          <td class="followers">1234</td>
          <td class="remove"><button>Remover</button></td>
        </tr>  
   `;
    return tr;
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    });
  }
}
