const createForm = document.getElementById('create-form')
const passwordForm = document.getElementById('password-form')
const searchForm = document.getElementById('search')
const model = document.getElementById('model')

searchForm.addEventListener('submit', searchFormHandler)

if(passwordForm) {
    passwordForm.addEventListener('submit', passwordFormHandler)
}

if(createForm) {
    createForm.addEventListener('submit', createFormHandler)
}

if(model) {
    model.querySelector('.model-cross').addEventListener('click', closeModel)
}


async function requestServer(path, body) {
    const response = await fetch(path, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const json = await response.json()
    return {data: json, ok: response.ok, status: response.status}
}

async function createFormHandler(e) {
    e.preventDefault()

    const message = createForm.querySelector('[name="message"]')
    const description = createForm.querySelector('[name="description"]')
    const password = createForm.querySelector('[name="password"]')
    const object = {
        message: message.value,
        description: description.value,
        password: password.value
    }
    const {data, ok} = await requestServer('/message', object)

    if(!ok) {
        return messageErrorModelOpen(data.message)
    }
    renderAccessCreate(data.code)

    message.value = ''
    description.value = ''
    password.value = ''
}

async function passwordFormHandler(e) {
    e.preventDefault()

    const password = passwordForm.querySelector('[name="password"]').value
    const code = passwordForm.querySelector('[name="code"]').value
    const {data, ok, status} = await requestServer('/' + code, {password})
    if(!ok) {
        if(status === 400) {
            return  messageErrorModelOpen('Пароль неверный')
        }
        return messageErrorModelOpen(data.message)
    }

    renderAccessPassword(data)
}


async function searchFormHandler(e) {
    e.preventDefault()
    const code = searchForm.querySelector('[name="code"]').value
    window.location.replace('/' + code)
}

function renderAccessCreate(code) {
    const link = model.querySelector('a')
    link.textContent = code
    link.href = '/' + code
    model.classList.add('open')
}

function renderAccessPassword(data) {
    model.classList.remove('open')
    const messageDiv = document.getElementById('message')
    const p = messageDiv.querySelector('p')
    p.textContent = data.message

    messageDiv.style.display = 'block'
    passwordForm.style.display = 'none'

}

function closeModel() {
    model.classList.remove('open')
}

function messageErrorModelOpen(message) {
    const span = model.querySelector('span')
    span.textContent = message
    model.classList.add('open')
}