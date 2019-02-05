import React, { Component } from 'react'
import axios from 'axios'

class FiboPage extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }
  componentDidMount = () => {
    this.fetchValues()
    this.fetchIndexs()
  }

  fetchValues = async () => {
    const values = await axios.get('/api/values/current')
    this.setState({
      values: values.data
    })
  }

  fetchIndexs = async () => {
    const seenIndexes = await axios.get('/api/values/all')
    this.setState({
      seenIndexes: seenIndexes.data
    })
  }
  renderSeenIndexes = () => {
    return this.state.seenIndexes.map(({ number }) => number).join(', ')
  }
  renderValues = () => {
    const entries = []
    for (let key in this.state.values) {
      entries.push(
        <div key={key}>
          For index {key}, I've calculated {this.state.values[key]}
        </div>
      )
    }
    return entries
  }
  handleSubmit = async e => {
    e.preventDefault()
    await axios.post('/api/values', {
      index: this.state.index
    })

    this.setState({
      index: ''
    })
  }
  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter your index</label>
          <input
            value={this.state.index}
            onChange={e => this.setState({ index: e.target.value })}
          />
          <button>submit</button>
        </form>
        <h3>Indexes I've seen</h3>
        {this.renderSeenIndexes()}
        <h3>Calculated values: </h3>
        {this.renderValues()}
      </div>
    )
  }
}
export default FiboPage
