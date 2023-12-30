async function createExpense(){
    const money=document.getElementById("moneySpent");
    const desc=document.getElementById("expenseDescription");
    const category=document.getElementById("expenseCategory");
    const userId=localStorage.getItem("userId");
    const data={money:money.value,description:desc.value,category:category.value,userId:userId};
    await axios.post("http://localhost:3000/create-expense",data).then(res=>{
        money.value=""
        desc.value=""
        category.value=""
    })

}

async function getAllData(){
    const userId=localStorage.getItem("userId");
    await axios.get(`http://localhost:3000/get-expenses/${userId}`).then(res=>{
        createRow(res.data)
    })
}

function createRow(data){
    const tBody=document.getElementById("expenseTableBody");
    for (const trow of data) {
        const row=document.createElement("tr");
        row.id=trow.id;
        row.innerHTML=`<td>${trow.expense}</td>
    <td>${trow.description}</td>
    <td>${trow.category}</td>
    <td>
      <button class="btn btn-warning btn-sm">Edit</button>
      <button class="btn btn-danger btn-sm" onclick=deleteData(${trow.id})>Delete</button>
    </td>`
        tBody.appendChild(row)
    }
}

async function deleteData(id){
    await axios.delete(`http://localhost:3000/delete-expense/${id}`).then(res=>{
        console.log(res)
    })
}