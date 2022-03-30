class Expenses {
  addButton = document.querySelector("#add");
  total = document.querySelector("#sum");
  expPrice = document.querySelector("#exp-price");
  expName = document.querySelector("#exp-name");
  expensesWrapper = document.querySelector("#expenses");

  add() {
    console.log("test add");
  }

  use() {
    this.addButton.onclick = () => this.add();
    this.show();
  }

  func() {
    console.log("ok");
  }

  createItemHTML(item) {
    const {name, price, date = Date.now()} = item;

    let dateFinal = new Date(date);

    const day = dateFinal.getDate() < 10 ? "0" + dateFinal.getDate() : dateFinal.getDate()
    const month = dateFinal.getMonth() < 10 ? "0" + dateFinal.getMonth() : dateFinal.getMonth();
    const year = dateFinal.getFullYear(); 

    dateFinal = `${day} / ${month} / ${year}`;

    const expItem = document.createElement("div");
    expItem.classList.add("exp-item");
    const expText = document.createElement("div");
    expText.classList.add("exp-text");
    const expTextSpan = document.createElement("span");
    expText.append(expTextSpan);
    const editInpName = document.createElement("input");
    editInpName.classList.add("edit-inp");
    editInpName.setAttribute("type", "text");
    editInpName.disabled = true;
    editInpName.value = name;
    expTextSpan.append(editInpName);
    expItem.append(expText);
    
    const expPriceAndDate = document.createElement("div");
    expPriceAndDate.classList.add("exp-price-and-date");
    const expDateDiv = document.createElement("exp-date");
    expDateDiv.classList.add("exp-date");
    const editInpDate = document.createElement("input");
    editInpDate.classList.add("edit-inp");
    editInpDate.setAttribute("type", "text");
    editInpDate.disabled = true;
    editInpDate.value = dateFinal;
    expDateDiv.append(editInpDate);
    expPriceAndDate.append(expDateDiv);
    const priceInpSpan = document.createElement("span");
    priceInpSpan.classList.add("price-inp");
    const editInpPrice = document.createElement("input");
    editInpPrice.classList.add("edit-inp");
    editInpPrice.setAttribute("type", "number");
    editInpPrice.disabled = true;
    editInpPrice.value = price;
    priceInpSpan.append(editInpPrice);
    expPriceAndDate.append(priceInpSpan);
    const itemIconsDiv = document.createElement("div");
    itemIconsDiv.classList.add("item-icons");
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa");
    editIcon.classList.add("fa-pencil");
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add("fa-trash-o");
    itemIconsDiv.append(editIcon);
    itemIconsDiv.append(deleteIcon);
    expPriceAndDate.append(itemIconsDiv);
    expItem.append(expPriceAndDate);
    return expItem;
  }

  show(){
    const allExpenses = JSON.parse(localStorage.getItem("expenses"));

    allExpenses.forEach(item => {
      this.expensesWrapper.append(this.createItemHTML(item));
    });
  }
}

const expenses = new Expenses();
expenses.use();