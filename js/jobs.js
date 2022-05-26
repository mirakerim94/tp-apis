const URLBase =  "https://62806e007532b4920f6ef719.mockapi.io/"
const endpointJobs = "jobs/"


const queryId = (id) => document.getElementById(id)


const getJobs = () => {
    fetch(`${URLBase}${endpointJobs}`)
        .then(res => res.json())
        .then(data => createCards(data))
        .catch(err => console.log(err))
}
getJobs()

const createCards = (data) => {
    queryId("info-jobs").innerHTML = ""
    const html = data.reduce((acc,curr) => {
        const {name,description,location,category,seniority, id} = curr

        return acc += `
        <div class="box">
        <h2>${name}</h2>
        <p>${description}</p>
        <p><span>Location</span>: ${location}</p>
        <p><span>Category</span>: ${category}</p>
        <p><span>Seniority</span>: ${seniority}</p>
        <button class="btn-info" onclick="moreDetails(${id})">More details</button>
        </div>
        `
    }, "")
    queryId("info-jobs").innerHTML = html
}
//createCards(data)

const moreDetails = (id) => {
    queryId("spinner").style.display = "block"
    queryId("div-spinner").style.display = "flex"
    queryId("info-jobs").style.display = "none"
    setTimeout(() => {
    fetch(`${URLBase}${endpointJobs}${id}`)
    .then(res => res.json())
    .then(data => {
        queryId("spinner").style.display = "none"
        queryId("div-spinner").style.display = "none"
        queryId("info-jobs").style.display = "block"
        createMoreDetails(data)
    })
    .catch(err => console.log(err))
}, 2000)}

const createMoreDetails = (data) => {
    queryId("info-jobs").innerHTML = ""
    const {name, description, location, category, seniority, id} = data

    const html = `
    <div class="box">
    <h2>${name}</h2>
    <p>${description}</p>
    <p><span>Location</span>: ${location}</p>
    <p><span>Category</span>: ${category}</p>
    <p><span>Seniority</span>: ${seniority}</p>
    <button class="btn-edit" onclick = "editUser(${id})">Edit info</button>
    <button class="btn-delete" onclick = "deleteJob(${id})">Delete Job</button>
    </div>
    `
    queryId("info-jobs").innerHTML = html
}

queryId("alert-delete").style.display = "none"
queryId("overlay").style.display = "none"

const deleteJob = (id) => {
    queryId("alert-delete").style.display = "flex"
    queryId("overlay").style.display = "flex"

    queryId("alert-delete-forsure").addEventListener("click", (e) => {
        e.preventDefault()

        fetch(`${URLBase}${endpointJobs}${id}` , {
            method: "DELETE",
        })
    .then(res => res)
    .finally(() => {
        window.location.reload()
    })
    queryId("alert-delete").style.display = "none"
    queryId("overlay").style.display = "none"

    })
}

queryId("alert-cancel").addEventListener("click", () => {
    queryId("alert-delete").style.display = "none"
    queryId("overlay").style.display = "none"
})





