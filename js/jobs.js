const URLBase = "https://62806e007532b4920f6ef719.mockapi.io/"
const endpointJobs = "jobs/"

/* VARIABLE DE ESTADO */
let arrjobs = []

const queryId = (id) => document.getElementById(id)


const getJobs = () => {
    fetch(`${URLBase}${endpointJobs}`)
        .then(res => res.json())
        .then(data => {
            arrjobs = data
            createCards(data)
            fillSelectOptionsLocation()
            fillSelectOptionsSeniority()
            fillSelectOptionsCategory()
        })
        .catch(err => console.log(err))
}
getJobs()

const createCards = (data) => {
    queryId("info-jobs").innerHTML = ""
    const html = data.reduce((acc, curr) => {
        const { name, description, location, category, seniority, id } = curr

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
    }, 2000)
}

const createMoreDetails = (data) => {
    queryId("info-jobs").innerHTML = ""
    const { name, description, location, category, seniority, id } = data

    const html = `
    <div class="box">
    <h2>${name}</h2>
    <p>${description}</p>
    <p><span>Location</span>: ${location}</p>
    <p><span>Category</span>: ${category}</p>
    <p><span>Seniority</span>: ${seniority}</p>
    <button class="btn-edit" onclick = "editJob(${id})">Edit info</button>
    <button class="btn-delete" onclick = "deleteJob(${id})">Delete Job</button>
    </div>
    <section class="section-footervh">
    </section>
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

        fetch(`${URLBase}${endpointJobs}${id}`, {
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

/* CREATE JOB */
queryId("form-create").style.display = "none"
queryId("create-jobs-id").addEventListener("click", () => {
    queryId("form-create").style.display = "block"
    queryId("overlay").style.display = "block"
})


queryId("form--createjob").onsubmit = (e) => {
    e.preventDefault()
    queryId("spinner").style.display = "block"
    queryId("div-spinner").style.display = "flex"
    const createNewJob = {
        name: queryId("create-title").value,
        description: queryId("create-description").value,
        location: queryId("create-location").value,
        seniority: queryId("create-seniority").value,
        category: queryId("create-category").value,
    }

    fetch(`${URLBase}${endpointJobs}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(createNewJob)
    })
        .catch((err) => console.log(err))
        .finally(() => {
            queryId("form-create").style.display = "none"
            queryId("overlay").style.display = "none"
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        })
}

/* EDIT JOB */
queryId("form-edit").style.display = "none"

let idEdit = null

const editJob = (id) => {
    queryId("form-edit").style.display = "block"
    queryId("overlay").style.display = "block"

    fetch(`${URLBase}${endpointJobs}${id}`)
        .then((res) => res.json())
        .then((data) => {
            infoEditForm(data)
            idEdit = id
        })
        .catch((err) => console.log(err))
        .finally(() => {
            console.log(idEdit)
        })
}

const infoEditForm = (data) => {
    const { name, description, location, seniority, category } = data

    queryId("edit-title").value = name
    queryId("edit-description").value = description
    queryId("edit-location").value = location
    queryId("edit-seniority").value = seniority
    queryId("edit-category").value = category

}

queryId("form--editjob").onsubmit = (e) => {
    e.preventDefault()
    queryId("spinner").style.display = "block"
    queryId("div-spinner").style.display = "flex"
    const editedJob = {
        name: queryId("edit-title").value,
        description: queryId("edit-description").value,
        location: queryId("edit-location").value,
        seniority: queryId("edit-seniority").value,
        category: queryId("edit-category").value
    }

    fetch(`${URLBase}${endpointJobs}${idEdit}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(editedJob)
    })
        .catch((err) => console.log(err))
        .finally(() => {
            queryId("form-edit").style.display = "none"
            queryId("overlay").style.display = "none"
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        })
}

/* FILL SELECT OPTIONS */


//location
const fillSelectOptionsLocation = () => {

    const location = arrjobs.map(job => {
        return job.location
    })

    const locationFiltered = location.filter(function (value, index, array) {
        return array.indexOf(value) === index;
    })

    const htmlLocation = locationFiltered.reduce((acc, curr) => {
        return acc += `
        <option value='${curr}'>${curr}</option>
        `
    }, `<option value='all' selected hidden>Location</option>`)

    queryId("select--location").innerHTML = htmlLocation
}

//seniority
const fillSelectOptionsSeniority = () => {

    const seniority = arrjobs.map((curr) => {
        const { seniority } = curr
        if (seniority === '') {
            return 'No seniority'
        }
        return seniority
    })

    const seniorityFiltered = seniority.filter(function (value, index, array) {
        return array.indexOf(value) === index;
    });


    const htmlSeniorityFiltered = seniorityFiltered.reduce((acc, curr) => {

        return acc += `
        <option value='${curr}'>${curr}</option>
        `
    }, `<option value='all' selected hidden>Seniority</option>`)

    queryId("select--seniority").innerHTML = htmlSeniorityFiltered
}

//category
const fillSelectOptionsCategory = () => {

    const category = arrjobs.map(job => {
        return job.category
    })

    const categoryFiltered = category.filter(function (value, index, array) {
        return array.indexOf(value) === index;
    })

    const htmlCategory = categoryFiltered.reduce((acc, curr) => {
        return acc += `
        <option value='${curr}'>${curr}</option>
        `
    }, `<option value='all' selected hidden>Category</option>`)

    queryId("select--category").innerHTML = htmlCategory

}















// fillSelectOptions()

/*queryId('btn--search').addEventListener('click', () => {
    const location = queryId('select--location').value
    const seniority = queryId('select--seniority').value
    const category = queryId('select--category').value

})*/