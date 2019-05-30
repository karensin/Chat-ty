import React, { Component } from 'react';
import* as firebase from 'firebase';

class messageList extends Component{
  constructor(props) {
    super(props);
    this.state = {
        userName:' ',
        sentAt:' ',
        roomId:' ',
        content:' ',
        messages: [],
  };
  this.messagesRef = this.props.firebase.database().ref('messages');
  this.createMessage = this.createMessage.bind(this);
  this.messageContent = this.messageContent.bind(this);
  this.convertMillisToTime=this.convertMillisToTime.bind(this);
 };



  createMessage(e){
    e.preventDefault();
    this.messagesRef.push({
      userName:this.state.userName,
      content:this.state.content,
      sentAt:this.state.sentAt,
      roomId:this.state.roomId,
    });

    this.setState({
        userName:'',
        content:'',
        sentAt:'',
        roomId:'',
    });
    e.target.reset()
  };



  messageContent(e){
    e.preventDefault();
     this.setState({
      username:this.props.user,
      content:e.target.value,
      sentAt:firebase.database.ServerValue.TIMESTAMP,
      roomId:this.props.activeRoom
    })
  }


  convertMillisToTime(timespan){
    let time = new Date(timespan);
    var theyear = time.getFullYear();
    var themonth = time.getMonth() + 1;
    var thetoday = time.getDate();
    var realTime = time.toLocaleTimeString();

    return realTime


  }


    componentDidMount() {
      this.setState({userName: this.props.user})
      this.messagesRef.on('child_added', snapshot => {
         const message = snapshot.val();
         message.key = snapshot.key;
         this.setState({ messages: this.state.messages.concat( message ) })
       });
}

render() {
  const activeRoom = this.props.activeRoom

  const currentMessages= (
    this.state.messages.map((message)=>{
      if (message.roomId===activeRoom){
        return <li key={message.key}>:{message.userName}:{message.content}
        {this.convertMillisToTime(message.sentAt)}</li>
          }
        return null;
    })
  );
  const messageBox=(
    <form  onSubmit={this.createMessage}  >
       <input
             disabled={this.props.disabled}
             onChange={this.messageContent}
             value={this.state.content}
             placeholder="Type your message..."
             type="text" />
               </form>


             )
  return (
   <div className="message-list">>
   <div> {currentMessages} </div>
   <div className="send-message-form">{messageBox} </div>

      </div>

    );
  }
}



export default messageList;
