class Expenses {
  addButton = document.querySelector("#add");
  total = document.querySelector("#sum");
  expPrice = document.querySelector("#exp-price");
  expName = document.querySelector("#exp-name");

  add() {
    const priceVal = this.expPrice.value;
    const nameVal = this.expName.value;
  
    if(!priceVal.length || !nameVal.length) {
      this.expPrice.classList.add("warn-border");
      this.expName.classList.add("warn-border");
    } else {
        const prevData = this.getData();
        const obj = {name: nameVal, price: priceVal};
        prevData.push(obj);
        this.setData(prevData);
    }
    
    this.expName.value = "";
    this.expPrice.value = "";
  }
  
  getData() {
    const expenses = JSON.parse(localStorage.getItem("expenses"));

    return expenses?expenses:[];
  }
  
  setData(data) {
    const dataToString = JSON.stringify(data);
    localStorage.setItem("expenses", dataToString);
  }
  
  use() {
    this.addButton.onclick = () => this.add();
  }
}

const expenses = new Expenses();
expenses.use();