const db = firebase.firestore()
let tasks = []

function getUser() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            let userLabel = document.getElementById('navbarDropdown')
            userLabel.innerHTML = user.email
        } else {
            swal.fire({
                icon: "success",
                title: "Redirecionando para a tela de autenticação",
            }).then(() => {
                setTimeout(() => {
                    window.location.replace("login.html")
                }, 1000)
            })
        }
    })
}

function createDelButton(task) {
    const newButton = document.createElement('button')
    newButton.setAttribute('class', 'btn btn-primary')
    newButton.appendChild(document.createTextNode('Excluir'))
    newButton.setAttribute("onclick", `deleteTask("${task.id}")`)
    return newButton
}

function createDate(task) {
    const newDate = document.createElement('span')
    newDate.appendChild(document.createTextNode(task.creation))
    return newDate
}

function renderTasks() {
    let itemList = document.getElementById('itemList')
    itemList.innerHTML = ""
    for(let task of tasks) {
        const newItem = document.createElement('li')
        newItem.setAttribute('class', 'list-group-item d-flex justify-content-between')
        newItem.appendChild(document.createTextNode(task.title))
       // newItem.append(document.createTextNode("\u00A0"))
        
       // newItem.appendChild(document.createElement(task.creation))
       newItem.appendChild(createDate(task))
        newItem.appendChild(createDelButton(task))
        itemList.appendChild(newItem)
    }
}

async function readTasks() {
    tasks = []
    const logTasks = await db.collection("tasks").get()
    for (doc of logTasks.docs) {
        tasks.push({
            id: doc.id,
            title: doc.data().title,
            creation: doc.data().creation
        })
    }
    renderTasks()
}

async function addTask() {
    const itemList = document.getElementById("itemList")
    const newItem = document.createElement('li')
    newItem.setAttribute('class', 'list-group-item')
    newItem.appendChild(document.createTextNode("Adicionando na nuvem"))
    itemList.appendChild(newItem)

    const title = document.getElementById("newItem").value
    const creation = document.getElementById("newTime").value
    await db.collection('tasks').add({
        title: title,
        creation: creation,
    })
    readTasks()
}

async function deleteTask(id) {
    await db.collection("tasks").doc(id).delete()
    readTasks()
}

window.onload = function() {
    getUser()
    readTasks()
}