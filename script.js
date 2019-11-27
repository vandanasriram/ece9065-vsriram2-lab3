function copyObj(obj) {
    return obj;
}
var items = [
    {
        item_name: "Book1",
        category: "book",
    },
    {
        item_name: "Book2",
        category: "book"
    },
    {
        item_name: "Book3",
        category: "book"
    },
    {
        item_name: "Book4",
        category: "book"
    },
    {
        item_name: "Book5",
        category: "book"
    },
    {
        item_name: "Book6",
        category: "book"
    },
    {
        item_name: "cd1",
        category: "cd"
    },
    {
        item_name: "cd2",
        category: "cd"
    },
    {
        item_name: "cd3",
        category: "cd"
    },
    {
        item_name: "cd4",
        category: "cd"
    }
];
var itemsAvailable /*= [
    {
        item_name: "Harry Potter and the Socerer's Stone",
        category: "book",
        imgUrl: "images/book1.jpg",
        item_name2:"Harry Potter à l'école des sorciers"
    },
    {
        item_name: "Harry Potter and the chamber of Secrets",
        category: "book",
        imgUrl: "images/book2.jpg",
        item_name2:"Harry Potter et la Chambre des Secrets"

    },
    {
        item_name: "Harry Potter and the Prisoner of Azkaban",
        category: "book",
        imgUrl: "images/book3.jpg",
        item_name2:"Harry Potter Et le Prisonnier D'Azkaban"

    },
    {
        item_name: "Harry Potter and the Goblet of Fire",
        category: "book",
        imgUrl: "images/book4.jpg",
        item_name2:"Harry Potter et la coupe de feu"
    },
    {
        item_name: "Harry Potter and the Order of the Phoenix",
        category: "book",
        imgUrl: "images/book5.jpg",
        item_name2:"Harry Potter Et L'Ordre Du Phenix"
    },
    {
        item_name: "Harry Potter and the Half Blood Prince",
        category: "book",
        imgUrl: "images/book6.jpg",
        item_name2:"Harry Potter et le Sang Mele "
    },
    {
        item_name: "Frozen",
        category: "cd",
        imgUrl: "images/cd1.jpg",
        item_name2:"La Reine des neiges"
    },
    {
        item_name: "Toy Story Film series",
        category: "cd",
        imgUrl: "images/cd2.jpg",
        item_name2:"Toy Story (série de films)"
    },
    {
        item_name: "How to Train Your Dragon",
        category: "cd",
        imgUrl: "images/cd3.jpg",
        item_name2:"Dragons  français"
    },
    {
        item_name: "Zootopia",
        category: "cd",
        imgUrl: "images/cd4.jpg",
        item_name2:"Zootopia français"
    }
]*/
var dueDatesObj;
var checkoutItem = [];
var adminLogoutFlag = false;
var node;
var itemName;
var dueDate;
var innerText;
var date = new Date();
var availItems = document.getElementById("available-items");
var basket = document.getElementById("basket");
var totalItemsAvail;
var button;
var imgtag;
var secLangflag;

loadDueDates();
loadAvailableItems();

async function loadDueDates() {
    let promise = new Promise(resolve => {
        getdueDate(resolve);
      });
      dueDatesObj = await promise;
      dueDatesObj= dueDatesObj[0];
      console.log(dueDatesObj);
}

async function loadAvailableItems(secLang) {
    secLangflag = secLang || false;
        let promise = new Promise(resolve => {
            getAvailableItems(resolve);
          });
          itemsAvailable = await promise;
    
    totalItemsAvail = itemsAvailable.length;
    for (var i = 0; i < totalItemsAvail; i++) {
        node = document.createElement("li");
        itemName = document.createElement("p");
        imgtag = document.createElement('img');
        imgtag.setAttribute("src",itemsAvailable[i].imgUrl);
        secLangflag ? innerText = document.createTextNode(itemsAvailable[i].item_name2) :innerText = document.createTextNode(itemsAvailable[i].item_name);
        itemName.appendChild(innerText);
        dueDate = document.createElement("p");
        console.log(JSON.stringify(dueDatesObj));
        itemsAvailable[i].category === "book" ? date.setDate(date.getDate() + dueDatesObj.book) : date.setDate(date.getDate() + dueDatesObj.cd);
        innerText = document.createTextNode("Due Date: " + date.getDate().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString());
        dueDate.appendChild(innerText);
        button = document.createElement('button');
        button.appendChild(document.createTextNode("Add"));
        node.appendChild(itemName);
        node.appendChild(dueDate);
        node.appendChild(imgtag);
        node.appendChild(button).addEventListener("click", addToCart);
        availItems.appendChild(node);
        date = new Date();
    }
}
function checkOutCall(secLang) {
    deleteAvailNodes("#basket");
    secLangflag = secLang || false;
    var totalItems = checkoutItem.length;

    for (var i = 0; i < totalItems && checkoutItem[i]; i++) {
        node = document.createElement("li");
        itemName = document.createElement("p");
        secLangflag ? innerText = document.createTextNode(checkoutItem[i].item_name2) :innerText = document.createTextNode(checkoutItem[i].item_name);

        // innerText = document.createTextNode(checkoutItem[i].item_name);
        itemName.appendChild(innerText);
        dueDate = document.createElement("p");
        checkoutItem[i].category === "book" ? date.setDate(date.getDate() + dueDatesObj.book) : date.setDate(date.getDate() + dueDatesObj.cd);
        innerText = document.createTextNode("Due Date: " + date.getDate().toString() + "-" + (date.getMonth() + 1).toString() + "-" + date.getFullYear().toString());
        dueDate.appendChild(innerText);
        button = document.createElement('button');
        button.appendChild(document.createTextNode("remove"));
        node.appendChild(itemName);
        node.appendChild(dueDate);
        node.appendChild(button).addEventListener("click", removeFromCart);
        basket.appendChild(node);
        date = new Date();

    }
    deleteAvailNodes("#available-items");
    loadAvailableItems(secLangflag);

}
function deleteAvailNodes(parent) {

    var availList = document.querySelector(parent);
    var child = availList.lastElementChild;
    while (child) {
        availList.removeChild(child);
        child = availList.lastElementChild;
    }
}

function removeFromCart(e, removeallFlag) {
    var removeallFlag = removeallFlag || "nocheckout";
    var totalItems = checkoutItem.length;
    var selectedItem = event.currentTarget.parentElement.firstElementChild.innerText;
    for (var i = 0; i < totalItems; i++) {
        if (removeallFlag === "nocheckout" && (selectedItem === checkoutItem[i].item_name || selectedItem === checkoutItem[i].item_name2)) {
            itemsAvailable.push(checkoutItem[i]);
            checkoutItem.splice(i, 1);
            break;
        }
        else {
            if (removeallFlag === "cancel") {
                itemsAvailable.push(checkoutItem[0]);
                checkoutItem.splice(0, 1);
            }
            else if (removeallFlag === "success") {
                checkoutItem.splice(0, 1);
            }

        }
    }
    checkOutCall(secLangflag);
    removeallFlag = "nocheckout";
}

function addToCart() {
    totalItemsAvail = itemsAvailable.length;
    var selectedItem = event.currentTarget.parentElement.firstElementChild.innerText;
    for (var i = 0; i < totalItemsAvail; i++) {
        if (selectedItem === itemsAvailable[i].item_name || selectedItem === itemsAvailable[i].item_name2) {
            checkoutItem.push(itemsAvailable[i]);
            itemsAvailable.splice(i, 1);
            break;
        }
    }
    checkOutCall(secLangflag);
}

function checkout() {
    var checkoutFlag
    if(checkoutItem.length > 0) {
        checkoutFlag = confirm("Total No of Items:" + checkoutItem.length + "\n" + "Click Ok to proceed checkout");
        if (checkoutFlag == true) {
            removeFromCart(undefined, "success")
        } else {
            removeFromCart(undefined, "cancel")
        }
    }
    else {
        alert("Cart is empty. Please add to check out")
    }
    
}


function uservalidation() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var year = document.getElementById("birth-year").value;
    var validEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var errFLag = false;
    var adminFlag = false;
    var infomsg = document.getElementById("info");
    var message;
    var currentYear = new Date().getFullYear();
    infomsg.innerText = "";
/* input sanitization*/
        if (name.length > 100) {
            errFLag = true;
            alert("enter name less than 100 characters");
        }
        
        if (name !== "admin") {
            if (Number(year) < 1900) {
                errFLag = true;
                alert("Year should be after 1900");
            }
            if (Number(year) > currentYear) {
                errFLag = true;
                alert("Year should not be after current year");
            }
            if (validEmail.test(email) === false) {
                errFLag = true;
                alert("Enter valid email id")
            }
            if (errFLag === false) {
                if(!document.getElementById("login-page").classList.contains("display-none")){
                    document.getElementById("login-page").classList.add("display-none")
                }
                message = name + " (" + email + ") " + "[" + ((currentYear - year) >= 18 ? "Adult" : "Child") + "]";
                infomsg.innerText = message;
                document.getElementById("library-items-details").classList.remove("display-none");
                document.getElementById("library-checkout-details").classList.remove("display-none");
            }
        }
        else {
            if (name === "admin" && Number(year) === 1867) {
                if(!document.getElementById("login-page").classList.contains("display-none")){
                    document.getElementById("login-page").classList.add("display-none")
                }
                if (document.getElementById("admin-ops").classList.contains("display-none")) {
                    document.getElementById("admin-ops").classList.remove("display-none");
                    document.getElementById("bookdue").innerText = dueDatesObj.book;
                    document.getElementById("cddue").innerText = dueDatesObj.cd;
                    message = "Librarian";
                    infomsg.innerText = message;
                    if(document.getElementById("library-items-details").classList.contains("display-none")) {
                        document.getElementById("library-items-details").classList.remove("display-none")
                    }
                }
    
            }
            else {
                if (!document.getElementById("admin-ops").classList.contains("display-none")) {
                    document.getElementById("admin-ops").classList.add("display-none");
                }
                alert("enter valid details");
                errFLag = true;
            }
        }   
    
        if (errFLag === true) {
            document.getElementById("library-items-details").classList.add("display-none");
            document.getElementById("library-checkout-details").classList.add("display-none");
        }
    
        setInterval(loadAvailableItems, 60000, true);
}

async function addItem() {
    if (!document.getElementById("library-checkout-details").classList.contains("display-none")) {
        document.getElementById("library-checkout-details").classList.add("display-none");
    }
    if (document.getElementById("library-items-details").classList.contains("display-none")) {
        document.getElementById("library-items-details").classList.remove("display-none")
    }
    var addItemName = document.getElementById("item-name").value;
    var addItemCategory = document.getElementById("category").value;
    var addItemName2 = document.getElementById("item-name2").value;
    var itemObj = { item_name: "", category: "" , imgUrl:"",item_name2:""};
    itemObj.item_name = addItemName;
    itemObj.category = addItemCategory;
    itemObj.imgUrl = "images/niagra.jpg";
    itemObj.item_name2 = addItemName2;
    itemsAvailable.push(itemObj);
    alert("item Added successfully" + "\n" + "See the updated list below");
    deleteAvailNodes("#available-items");
    

   
    var headers = {
        "content-type" : "application/json"
    }
    await fetch('http://3.233.165.3:8081/libraryitem', { method: 'POST', headers: headers, body: JSON.stringify(itemObj)})
                .then((res) => {debugger
                    return res.json()
                })
                .catch((json) => {debugger
                    console.log(json);
                });
     loadAvailableItems(secLangflag);


}

async function removeItem() {
    if (!document.getElementById("library-checkout-details").classList.contains("display-none")) {
        document.getElementById("library-checkout-details").classList.add("display-none");
    }
    if (document.getElementById("library-items-details").classList.contains("display-none")) {
        document.getElementById("library-items-details").classList.remove("display-none")
    }
    var addItemName = document.getElementById("item-name").value;
    var addItemCategory = document.getElementById("category").value;

    var itemLen = itemsAvailable.length;
    var removeFlag = false;
    for (var i = 0; i < itemLen; i++) {
        if ((addItemName === itemsAvailable[i].item_name || addItemName === itemsAvailable[i].item_name2) && addItemCategory === itemsAvailable[i].category) {
            itemsAvailable.splice(i, 1);
            removeFlag = true;
            break;
        }
    }
    if (removeFlag == false) {
        alert("Item not found");
    }
    else {
        
        alert("removed successfully" + "\n" + "See the updated list below");
        deleteAvailNodes("#available-items");
                }
                
                
                await fetch('http://3.233.165.3:8081/nolibraryitem/' + addItemName, { method: 'DELETE'})
                            .then((res) => {debugger
                                return res.json()
                            })
                            .catch((json) => {debugger
                                console.log(json);
                            });
        loadAvailableItems(secLangflag);
    }

function updateDueDate() {
    if (!document.getElementById("library-checkout-details").classList.contains("display-none")) {
        document.getElementById("library-checkout-details").classList.add("display-none");
    }
    if (document.getElementById("library-items-details").classList.contains("display-none")) {
        document.getElementById("library-items-details").classList.remove("display-none")
    }
    var name = document.getElementById("name").value;
    var year = document.getElementById("birth-year").value;
    var dueItemCategory = document.getElementById("due-category").value;
    var newDueday = document.getElementById("due-value").value;

    if (name === "admin" && Number(year) === 1867) {
        dueDatesObj[dueItemCategory] = Number(newDueday);
        //fetch for updating the due date
        var headers = {
            "content-type" : "application/json"
        };
        var req = {
            "dueItemCategory" : dueItemCategory,
            "dueDate" : Number(newDueday)
        }
        fetch('http://3.233.165.3:8081/update_duedate', { method: 'PUT', headers: headers, body: JSON.stringify(req)})
                    .then((res) => {debugger
                        return res.json()
                    })
                    .catch((json) => {debugger
                        console.log(json);
                    });
///////////////////////////////////////////////////////////////////////////////
    }
    
    document.getElementById("bookdue").innerText = dueDatesObj.book;
    document.getElementById("cddue").innerText = dueDatesObj.cd;
    alert("Due date updated successfully" + "\n" + "See the updated list below");
    deleteAvailNodes("#available-items");
    loadAvailableItems(secLangflag);
}

function logoutAdmin() {
    var name = document.getElementById("name").value;
    var year = document.getElementById("birth-year").value;
    if (name === "admin" && Number(year) === 1867) {
        if (!document.getElementById("admin-ops").classList.contains("display-none")) {
            document.getElementById("admin-ops").classList.add("display-none");
            document.getElementById("name").value = "";
            document.getElementById("birth-year").value = "";
            document.getElementById("email").value = "";
            document.getElementById("info").innerText ="";
        }
        if (!document.getElementById("library-checkout-details").classList.contains("display-none")) {
            document.getElementById("library-checkout-details").classList.add("display-none");
        }
        if (!document.getElementById("library-items-details").classList.contains("display-none")) {
            document.getElementById("library-items-details").classList.add("display-none");
        }
        if(document.getElementById("login-page").classList.contains("display-none")){
            document.getElementById("login-page").classList.remove("display-none")
        }
        adminLogoutFlag = true;
    }
}

function displaySecondLang() {
    var checkboxElement = document.getElementById("lang");
    if(checkboxElement.checked) {
        secLangflag = true;
    }
    else {
        secLangflag = false;
    }
    checkOutCall(secLangflag);
}
function onlyLetter(input){
    $(input).keypress(function(ev) {
   var keyCode = window.event ? ev.keyCode : ev.which;
  //  code

    });
}
function getAvailableItems(resolve) {
    fetch('http://3.233.165.3:8081/available-items')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      itemsAvailable = data.result;
      resolve(itemsAvailable);
    })
    .catch(err => {
        resolve("Error in displaying available items. Try Again!");
    })
}
function getdueDate(resolve) {
    fetch('http://3.233.165.3:8081/due-date')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      duedate = data.result;
      resolve(duedate);
    })
    .catch(err => {
        resolve("Error in displaying available items. Try Again!");
    })
}
