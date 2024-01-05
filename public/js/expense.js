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
        createRow([res.data]);
    })

}

async function getAllData(){
    const userId=localStorage.getItem("userId");
    await axios.get(`http://localhost:3000/get-expenses/${userId}`).then(res=>{
        createRow(res.data)
    })
    await axios.get("http://localhost:3000/find-user",{headers:{
        "authorization":userId
        }}).then(res=>{
            if(res.data.isPremiumUser){
                showSubscribedBtn()
            }
            else {
                showSubscribeBtn()
            }
    })
}
function showSubscribedBtn(){
    const premiumList=document.getElementById("premium");
    premiumList.classList.remove("visually-hidden")
    const subscribed=document.getElementById("subscribed");
    subscribed.classList.remove("visually-hidden")
}

function showSubscribeBtn(){
    const subscribeBtn=document.getElementById("subscribe");
    subscribeBtn.classList.remove("visually-hidden");
    const notPremiumList=document.getElementById("notPremium");
    notPremiumList.classList.remove("visually-hidden")
}
function hideSubscribeBtn(){
    const subscribeBtn=document.getElementById("subscribe");
    subscribeBtn.classList.add("visually-hidden")
    const premiumList=document.getElementById("notPremium");
    premiumList.classList.add("visually-hidden")
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
        deleteRow(id);
    })
}

async function deleteRow(id){
    const tRow=document.getElementById(id);
    const tBody=document.getElementById("expenseTableBody");
    tBody.removeChild(tRow);
}

function showNotPremium() {
    alert("Become premium member to access this feature");
}

async function subscribe(){
    const userId=localStorage.getItem("userId");
    const res=await axios.get("http://localhost:3000/purchase/purchase-premium",{headers:{"authorization":userId}})
    let isPaymentFailed=false;
    const options={
        "key":res.data.key_id,
        "order_id":res.data.id,
        "handler":async (res)=>{
            isPaymentFailed=true;
            await axios.post("http://localhost:3000/purchase/update-payment-status",{
                orderId:options.order_id,
                paymentId: res.razorpay_payment_id
            },{headers: {"authorization":userId}})
            hideSubscribeBtn()
            showSubscribedBtn()
            alert("You are a premium user now")

        },
        "modal": {
            "ondismiss":async function(){
                await axios.post("http://localhost:3000/purchase/payment-failed",{
                    orderId:options.order_id,
                    status:"FAILED"
                })
            }
        }
    }
    const razorpay=new Razorpay(options);
    razorpay.open()
    razorpay.on("payment.failed",async()=>{
        await axios.post("http://localhost:3000/purchase/payment-failed",{
            orderId:options.order_id,
            status: "FAILED"
        })
        alert("Payment Failed")
    })
}

async function showLeaderBoard(){
    await axios.get("http://localhost:3000/premium/leaderboard").then(res=>{
        console.log(res);
        const mainBody=document.getElementById("mainBody");
        mainBody.innerHTML=`<div id="leaderboardTable">
                <h3 class="mt-5 text-center">Leaderboard</h3>
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Rank</th>
                        <th scope="col">Name</th>
                        <th scope="col">Expense</th>
                    </tr>
                    </thead>
                    <tbody id="leaderboardTableBody">
                        <!-- Leaderboard data will be loaded here dynamically -->
                    </tbody>
                </table>
            </div>`;
        const tbody=document.getElementById("leaderboardTableBody");
        for (let i = 0; i < res.data.length; i++) {
            const tr=document.createElement("tr");
            tr.innerHTML=`<tr>
                        <td>${i+1}</td>
                        <td>${res.data[i].name}</td>
                        <td>${res.data[i].total_expense||0}</td>
                    </tr>`;
            tbody.appendChild(tr)
        }
    })
}