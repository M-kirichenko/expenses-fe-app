class Expenses {
  _api_base = "http://localhost:3000/api/expenses";
  addButton = document.querySelector("#add");
  total = document.querySelector("#sum");
  expPrice = document.querySelector("#exp-price");
  expName = document.querySelector("#exp-name");
  expensesWrapper = document.querySelector("#expenses");

  async add() {
    const priceVal = this.expPrice.value;
    const nameVal = this.expName.value;
    
    if(!priceVal.length || !nameVal.length) {
      this.expPrice.classList.add("warn-border");
      this.expName.classList.add("warn-border");
    } else {
        const obj = { name: nameVal, price: priceVal };
        const dataWritten = await this.setData(obj, "POST");
        
        if(dataWritten.status === 200) {
          this.expName.value = "";
          this.expPrice.value = "";
          this.expPrice.classList.remove("warn-border");
          this.expName.classList.remove("warn-border");
          this.show();
        }
    }
  }
  
  getData() {
    return fetch(this._api_base)
    .then(response => response.json());
  }
  
  setData(item, method = "PATCH") {
    const fetchAddress = item.id ? `${this._api_base}/${item.id}` : this._api_base;
    return fetch( fetchAddress, {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    }).
    then( response => response );
  }
  
  use() {
    this.addButton.onclick = () => this.add();
    this.show();
  }

  createItemHTML(item) {
    const { id, name, price, date, editable = false} = item;
    let dateFinal = new Date(date);
    const day = dateFinal.getDate() < 10 ? "0" + dateFinal.getDate() : dateFinal.getDate();
    const month = dateFinal.getMonth() < 10 ? "0" + (dateFinal.getMonth() + 1) : dateFinal.getMonth();
    const year = dateFinal.getFullYear(); 
    dateFinal = `${day}/${month}/${year}`;
    const expItem = document.createElement("div");
    expItem.classList.add("exp-item");
    expItem.setAttribute("id", `expItem${id}`);
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
    const expDateDiv = document.createElement("div");
    expDateDiv.classList.add("exp-date");
    const editInpDate = document.createElement("input");
    editInpDate.classList.add("edit-inp");
    editInpDate.setAttribute("type", "text");
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
    deleteIcon.classList.add("fa-trash-o");
    itemIconsDiv.append(editIcon);
    itemIconsDiv.append(deleteIcon);
    expPriceAndDate.append(itemIconsDiv);
    expItem.append(expPriceAndDate);

    if(editable) {
      editInpName.disabled = false;
      editInpDate.disabled = false;
      editInpPrice.disabled = false;

      editIcon.addEventListener("click", () => {
        this.save(id);
      });
      deleteIcon.addEventListener("click", () => {
        this.undo(id);
      });
    } else {
      editInpName.disabled = true;
      editInpDate.disabled = true;
      editInpPrice.disabled = true;

      editIcon.addEventListener("click", () => {
        this.edit(id);
      });
      deleteIcon.addEventListener("click", () => {
        this.delete(id);
      });
    }

    return expItem;
  }

  show() {
    this.expensesWrapper.innerHTML = "";
    const allExpenses = this.getData();
    allExpenses.then(data => {
      if(data.length) {
        data.forEach(item => {
          this.expensesWrapper.append(this.createItemHTML(item)) 
        });
      }
      
      const sum = data.reduce( (sum, curr) => sum + curr.price, 0);
      this.total.innerText = sum;
    });
  }

  getIcons(editable) {
    return editable ? ["fa-save", "fa-undo"] : ["fa-pencil", "fa-trash-o"];
  }

  async edit(id) {
    const allExpenses = await this.getData();
    const index = allExpenses.findIndex(item => item.id == id);
    allExpenses[index].editable = !allExpenses[index].editable;
    this.noReqRender(allExpenses);
  }

  async save(id){

    let hasEmptyInp = false;
    const currInputs = document.querySelector(`#expItem${id}`).querySelectorAll("input");
    const allExpenses = await this.getData();
    
    currInputs.forEach(input => {
      if(!input.value) {
        hasEmptyInp = true;
        input.classList.add("warn-border");
      }
    })


    if(!hasEmptyInp) {

      const dateIsvalid = (dateStr) => {
        const regex = /^\d{2}\/\d{2}\/\d{4}$/;
        return dateStr.match(regex) || false;
      }

      const validDate = dateIsvalid(currInputs[1].value);

      if(!validDate) {
        currInputs[1].classList.add("warn-border");
      } else {
        let formatedDate = currInputs[1].value.split("/");
        formatedDate = formatedDate.reverse().join("-");

        const index = allExpenses.findIndex(item => item.id == id);

        const [name, d, price] = currInputs;
        allExpenses[index].name = name.value;
        allExpenses[index].date = formatedDate;
        allExpenses[index].price = price.value;
        allExpenses[index].editable = false;
        const {status} = await this.setData(allExpenses[index]);

        if(status === 200) this.show();
      }
    }   
  }

  async undo(id){
    const allExpenses = await this.getData();
    const index = allExpenses.findIndex(item => item.id == id);
    allExpenses[index].editable = false;
    this.noReqRender(allExpenses);
  }

  delete(id) {
    fetch(`${this._api_base}/${id}`, {
      method: 'DELETE',
    })
    .then(response => response )
    .then( ({status}) => status == 200 && this.show() );
  }
  
  noReqRender(data) {
    this.expensesWrapper.innerHTML = "";
    data.forEach(item => {
      this.expensesWrapper.append(this.createItemHTML(item));
    })
  }
}

const expenses = new Expenses();
expenses.use();