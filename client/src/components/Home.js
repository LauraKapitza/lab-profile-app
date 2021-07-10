import React from 'react';
import '../components/components.css';
import {Link} from 'react-router-dom';


class Home extends React.Component {
    render() {
        return(
            <div className='homepage'>
                <div className='text-container'>
                    <h2>IronProfile</h2>
                    <p>Today we will create an app with authoritation, adding some cool styles!</p>
                    <Link to='/signup'>Signup</Link>
                    <Link to='/login'>Login</Link>
                </div>
            </div>
        )
    }
}

export default Home;