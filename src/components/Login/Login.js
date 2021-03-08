import { useContext, useState } from 'react';
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword, handleFBSignIn, handleGoogleSignIn, handleSignOut, initializeLoginFramework, signInWithEmailAndPassword } from './loginManager';


function Login() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: ''
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };

  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(res => {
        handleResponse(res, true);
      })
  }

  const fbSignIn = () => {
      handleFBSignIn()
      .then(res => {
        handleResponse(res, true);
  })
}

  const signOut = () => {
      handleSignOut()
      .then(res => {
          handleResponse(res, false);
      })
  }

  const handleResponse = (res, redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect){
        history.replace(from);
    }
  }

  const handleBlur = (event) => {
    let isFormValid = true;
    if (event.target.name === 'email') {
      isFormValid = /\S+@\S+\.\S+/.test(event.target.value);
    }
    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFormValid = isPasswordValid && passwordHasNumber
    }
    if (isFormValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (event) => {
    if (newUser && user.email && user.password) {
        createUserWithEmailAndPassword(user.name, user.email, user.password)
        .then(res =>{
            handleResponse(res, true);
        })
    }   

    if (!newUser && user.email && user.password) {
      signInWithEmailAndPassword(user.email, user.password)
      .then(res =>{
        handleResponse(res, true);
    })
    }
    event.preventDefault();
  }

  return (
    <div className="App">
      {
        user.isSignedIn ? <button onClick={signOut}>Sign out</button> :
          <button onClick={googleSignIn}>Sign in</button>}
      <br />
      <button onClick={fbSignIn}>Sign in using Facebook</button>
      {
        user.isSignedIn && <div>
          <p> Welcome, {user.name} </p>
          <p>Your email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }

      <h1>Our Own Authentication</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id="" />
      <label htmlFor="newUser">New User Sign Up</label>

      <form onSubmit={handleSubmit}>
        {newUser && <input name="name" onBlur={handleBlur} type="text" placeholder="Your Name" />}
        <br />
        <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email Address" required />
        <br />
        <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required />
        <br />
        <input type="submit" value={newUser ? 'Sign up' : 'Sign in'} />
      </form>
      <p style={{ color: 'red' }}>{user.error}</p>
      {user.success && <p style={{ color: 'green' }}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>}
    </div>
  );
}



export default Login;
