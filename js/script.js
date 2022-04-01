class Expenses {
  addButton = document.querySelector("#add");
  total = document.querySelector("#sum");
  expPrice = document.querySelector("#exp-price");
  expName = document.querySelector("#exp-name");
  expensesWrapper = document.querySelector("#expenses");

  add() {
    const priceVal = this.expPrice.value;
    const nameVal = this.expName.value;
  
    if(!priceVal.length || !nameVal.length) {
      this.expPrice.classList.add("warn-border");
      this.expName.classList.add("warn-border");
    } else {
        const prevData = this.getData();
        const obj = { name: nameVal, price: priceVal, editable: false };
        prevData.push(obj);
        this.setData(prevData);
    }
    
    this.expName.value = "";
    this.expPrice.value = "";
  }
  
  getData() {
    const expenses = JSON.parse(localStorage.getItem("expenses"));

    return expenses || [];
  }
  
  setData(data) {
    const dataToString = JSON.stringify(data);
    localStorage.setItem("expenses", dataToString);
  }
  
  use() {
    this.addButton.onclick = () => this.add();
    this.show();
  }

  createItemHTML(item, index) {
    const {name, price, date = Date.now()} = item;

    let dateFinal = new Date(date);
    const day = dateFinal.getDate() < 10 ? "0" + dateFinal.getDate() : dateFinal.getDate();
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
    editInpDate.setAttribute("pattern", "d{1,2}/\d{1,2}/\d{4}")
    editInpDate.value = dateFinal;
    expDateDiv.append(editInpDate);
    expPriceAndDate.append(expDateDiv);
    const priceInpSpan = document.createElement("span");
    priceInpSpan.classList.add("price-inp");
    const editInpPrice = document.createElement("input");
    editInpPrice.classList.add("edit-inp");
    editInpPrice.setAttribute("type", "number");
    editInpPrice.value = price;
    priceInpSpan.append(editInpPrice);
    expPriceAndDate.append(priceInpSpan);
    const itemIconsDiv = document.createElement("div");
    itemIconsDiv.classList.add("item-icons");
    const icons = this.getIcons(item.editable);
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa");
    editIcon.classList.add(icons[0]);
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add(icons[1]);
    itemIconsDiv.append(editIcon);
    itemIconsDiv.append(deleteIcon);
    expPriceAndDate.append(itemIconsDiv);
    expItem.append(expPriceAndDate);

    if(item.editable) {
      editInpName.disabled = false;
      editInpDate.disabled = false;
      editInpPrice.disabled = false;

      editIcon.addEventListener("click", ({target}) => {
        this.save(target.parentElement.parentElement.parentElement, index)
      });
      deleteIcon.addEventListener("click", ({target}) => {
        this.undo(index)
      });
    } else {
      editInpName.disabled = true;
      editInpDate.disabled = true;
      editInpPrice.disabled = true;

      editIcon.addEventListener("click", ({target}) => {
        this.edit(index)
      });
      deleteIcon.addEventListener("click", ({target}) => {
        this.delete(target, index)
      });
    }

    return expItem;
  }

  show() {
    this.expensesWrapper.innerHTML = "";
    const allExpenses = this.getData();
    allExpenses.forEach( (item, index) => this.expensesWrapper.append(this.createItemHTML(item, index)) );
  }

  getIcons(editable) {
    return editable ? ["fa-save", "fa-undo"] : ["fa-pencil", "fa-trash-o"];
  }

  edit(index) {
    const allExpenses = this.getData();
    allExpenses[index].editable = !allExpenses[index].editable;
    this.setData(allExpenses);
    this.show();
  }

  delete(index){
    console.log(`delete ${index}`);
  }

  save(clickedParent, index){
    let hasEmptyInp = false;
    const currInputs = clickedParent.querySelectorAll("input");
    const allExpenses = this.getData();
    
    currInputs.forEach(input => {
      if(!input.value.length) {
        hasEmptyInp = true;
        input.classList.add("warn-border");
      }
    })

    if(!hasEmptyInp) {
      allExpenses[index].name = currInputs[0].value;
      allExpenses[index].date = currInputs[1].value;
      allExpenses[index].price = currInputs[2].value;
      allExpenses[index].editable = false;
      this.setData(allExpenses);
      this.show();
    }   
  }

  undo(index){
    const allExpenses = this.getData();
    allExpenses[index].editable = false;
    this.setData(allExpenses);
    this.show();
  }
}

const expenses = new Expenses();
expenses.use();