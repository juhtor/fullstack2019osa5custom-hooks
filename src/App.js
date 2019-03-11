import React, { useState, useEffect } from 'react'
import axios from 'axios'


const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  const create = (resource) => {
    setResources(resources.concat(resource))
  }

  const service = {
    token: null,

    setToken: (newToken) => {
      service.token = `bearer ${newToken}`
    },

    getAll: () => {
      const request = axios.get(baseUrl)
      request.then(response => { setResources(response.data) })
    },

    create: async (newObject) => {
      const config = {
        headers: { Authorization: service.token },
      }

      const response = await axios.post(baseUrl, newObject, config)
      create(response.data)
    },

    update: (id, newObject) => {
      const request = axios.put(`${baseUrl} /${id}`, newObject)
      return request.then(response => response.data)
    },
  }

  return [
    resources, service
  ]
}

const App = () => {
  const content = useField('text')
  const name = useField('text')
  const number = useField('text')

  const [notes, noteService] = useResource('http://localhost:3005/notes')
  const [persons, personService] = useResource('http://localhost:3005/persons')
  useEffect(() => {
    noteService.getAll()
  }, [])
  useEffect(() => {
    personService.getAll()
  }, [])
  const handleNoteSubmit = (event) => {
    event.preventDefault()
    noteService
      .create({ content: content.value })
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    personService
      .create({ name: name.value, number: number.value })
  }
  console.log('notes', notes)
  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input {...content} />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      <form onSubmit={handlePersonSubmit}>
        name <input {...name} /> <br />
        number <input {...number} />
        <button>create</button>
      </form>
      {persons.map(n => <p key={n.id}>{n.name} {n.number}</p>)}
    </div>
  )
}

export default App
