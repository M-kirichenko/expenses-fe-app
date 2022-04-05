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

  createItemHTML(item) {
    const { id, name, price, date, editable = false} = item;
    let dateFinal = new Date(date);
    const day = dateFinal.getDate() < 10 ? `0${dateFinal.getDate()}` : dateFinal.getDate();
    const month = dateFinal.getMonth() < 10 ? `0${dateFinal.getMonth() + 1}` : dateFinal.getMonth() + 1;
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
    const [saveOrEdit, deleteOrUndo] = this.getIcons(item.editable);
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa");
    editIcon.classList.add(saveOrEdit);
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa");
    deleteIcon.classList.add(deleteOrUndo);
    itemIconsDiv.append(editIcon);
    itemIconsDiv.append(deleteIcon);
    expPriceAndDate.append(itemIconsDiv);
    expItem.append(expPriceAndDate);

    if(editable) {
      editInpName.disabled = false;
      editInpDate.disabled = false;
      editInpPrice.disabled = false;

      editIcon.addEventListener("click", () => {
        this.save(item);
      });
      
      deleteIcon.addEventListener("click", () => {
        this.noReqRender(item);
      });
    } else {
      editInpName.disabled = true;
      editInpDate.disabled = true;
      editInpPrice.disabled = true;

      editIcon.addEventListener("click", () => {
        this.noReqRender(item);
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

  save(item){
    const {id} = item;
    const dateIsvalid = (dateStr) => {
      const regex = /^\d{2}\/\d{2}\/\d{4}$/;
      return dateStr.match(regex) || false;
    }

    let hasErr = false;
    const currInputs = document.querySelector(`#expItem${id}`).querySelectorAll("input");
     
    const [nameInp, dateInp, priceInp] = currInputs;
   
    if(!nameInp.value) {
      hasErr = true;
      nameInp.classList.add("warn-border");
    }

    if(!dateIsvalid(dateInp.value)) {
      hasErr = true;
      dateInp.classList.add("warn-border");
    }

    if(!priceInp.value) {
      hasErr = true;
      priceInp.classList.add("warn-border");
    }

    if(!hasErr) {
      let formatedDate = dateInp.value.split("/");
      formatedDate = formatedDate.reverse().join("-");
      item.name = nameInp.value;
      item.date = formatedDate;
      item.price = priceInp.value;
      item.editable = false;
      this.setData(item);
    }   
  }

  delete(id) {
    fetch(`${this._api_base}/${id}`, {
      method: 'DELETE',
    })
    .then(response => response )
    .then( ({status}) => status == 200 && this.show() );
  }

  noReqRender(item) {
    item.editable = !item.editable;
    const reRendered = this.createItemHTML(item);
    document.querySelector(`#expItem${item.id}`).replaceWith(reRendered);
  }
}

const expenses = new Expenses();
expenses.show();
expenses.addButton.onclick = () => expenses.add();