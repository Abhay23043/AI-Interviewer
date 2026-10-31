import React from 'react'

const RegisterForm = () => {
  return (
    <>
        <form >
            <div className="input-group">
                <label htmlFor="name">Name</label>
                <input type="text" name='name' id='name' placeholder='Name' required/>
            </div>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input type="email" name='email' id='email' placeholder='email@example.com' required/>
            </div>
            <div className="input-group">
                <label htmlFor="password">Name</label>
                <input type="password" name='password' id='password' placeholder='Create a Pasword' required/>
            </div>
            <div className="submit-btn">
                <button type='button'> Submit </button>
            </div>

        </form>
    
    </>
  )
}

export default RegisterForm