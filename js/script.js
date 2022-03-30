class Expenses {
  addButton = document.querySelector("#add");
  total = document.querySelector("#sum");
  expPrice = document.querySelector("#exp-price");
  expName = document.querySelector("#exp-name");

  add() {
    console.log("test add");
  }

  use() {
    this.addButton.onclick = () => this.add();
  }
}

const expenses = new Expenses();
expenses.use();