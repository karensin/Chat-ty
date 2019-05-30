import React, { Component } from 'react';

import * as firebase from 'firebase';



class RoomList extends Component {
  constructor (props){
  super(props);
  this.state = {
    rooms: [],
    name:''
  };
  this.roomsRef = this.props.firebase.database().ref('rooms');
  this.createRoom = this.createRoom.bind(this);
  this.roomChange = this.roomChange.bind(this);
  this.deleteRoom = this.deleteRoom.bind(this);
}

componentDidMount() {
  this.roomsRef.on('value', snapshot => {
    const roomChanges = [];
    snapshot.forEach((room) => {
      roomChanges.push({
        key: room.key,
        name: room.val().name
      });
    });
    this.setState({ rooms: roomChanges})
  });
}

roomChange (e) {
  e.preventDefault();
  this.setState({name: e.target.value})
}

createRoom (e) {
  e.preventDefault()
  this.roomsRef.push(
    {
      name: this.state.name,
    }
  );
  this.setState({ name: "" })
}

selectRoom(room) {
  this.props.setActiveRoom(room);
}

deleteRoom(roomkey) {
  const room = this.props.firebase.database().ref('rooms/' + roomkey);
  room.remove();
}

  render() {
    let roomList = this.state.rooms.map((room, index) =>
      <li key={room.key} onClick={ (e) => {this.selectRoom(room,e)} }>{room.name}
      <button className="deleteRoom" onClick= { (e) => {this.deleteRoom(room.key)} }>Delete</button>
      </li>
    );
    let roomForm = (
      <div className="new-room-form">
             <form onSubmit={this.handleSubmit}>
                 <input
                     value={this.state.name}
                     onChange={this.roomChange}
                     type="text"
                     placeholder="Create a room"
                     required />
                 <button id="create-room-btn" type="submit">+</button>
         </form>
     </div>


      )
    return (
      <div className='rooms-list'>
        <h3> Room List </h3>
        <div >{roomList}</div>
        <div className= "new-room-form" >{roomForm}</div>
      </div>
    );
  }
}


export default RoomList;
