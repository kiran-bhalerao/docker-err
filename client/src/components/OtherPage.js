import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class OtherPage extends Component {
  render() {
    return (
      <div>
        <div>This is OtherPage component.</div>
        <Link to='/'>GO Back Home..</Link>
      </div>
    )
  }
}
export default OtherPage
