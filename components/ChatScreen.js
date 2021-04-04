import { useRouter } from 'next/router'
import React, {useState,useRef} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import styled from 'styled-components'
import {auth, db} from '../firebase'
import {Avatar, IconButton, Button} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import {useCollection} from 'react-firebase-hooks/firestore'
import Message from './Message'
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import firebase from 'firebase'
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

const ChatScreen = ({chat, messages}) => {
    // console.log("C",chat, "CM",messages);

    const [user] = useAuthState(auth)
    const router = useRouter()
    const [messagesSnapshot] = useCollection(db.collection('chats').doc(router.query.id).collection('messages').orderBy('timestamp','asc'))
    const [recipientSnapshot] = useCollection(db.collection('users').where('email','==',getRecipientEmail(chat.users,user)))
    // console.log("Rs", recipientSnapshot);
    const [input, setInput] = useState("")
    const endofMessageRef = useRef(null)

    const sendMessage = (e) =>{
        e.preventDefault()

        //update last seen 
            db.collection('users').doc(user.id).set({
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),

            }, {merge: true}) ;   // merge wont overwite existing data


        // send message
            db.collection('chats').doc(router.query.id).collection('messages').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL,
            })

            setInput('')
            scrollToBottom()
    }



    const showMessages = () => {

        if(messagesSnapshot){
             return messagesSnapshot.docs.map(message=>(
                 <Message
                key={message.id}
                user={message.data().user}
                message={{
                    ...message.data(),
                    timestamp: message.data().timestamp?.toDate().getTime()
                }}

                />
             ))
        } else{

                   return JSON.parse(messages).map(message=>(
                         <Message 
                            key={message.id}
                                user={message.user}
                                     message={message.message}
                        
                        />
                   ))

        }
    }

    const scrollToBottom = ()=>{

            endofMessageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
    }
    
    const recipient = recipientSnapshot?.docs?.[0]?.data()
    const recipientEmail = getRecipientEmail(chat.users, user)
    // console.log("recipient",recipient);

    return (
        <Container>
           <Header>
               {
                   recipient ? <Avatar src={recipient.photoURL}/> : <Avatar src={recipientEmail[0]}/>
               }
                

                <HeaderInformation>
                        <h3>{recipientEmail}</h3>
                        {
                            recipientSnapshot? (
                                    <p>last Active: {' '} 
                                    {recipient?.lastSeen?.toDate() ? (
                                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                                    ): "Unavailable"}
                                    </p>
                                ): ( 
                                <p>Loading last active....</p>
                                )

                        }
                      
                </HeaderInformation>
                <HeaderIcons>
                        <IconButton>
                            <AttachFileIcon/>
                        </IconButton> 
                         <IconButton>
                            <MoreVertIcon/>
                        </IconButton> 
                </HeaderIcons>
           </Header>

            <MessageContainer>
                {/* show messages */}
                    {showMessages()}
                <EndofMessage ref={endofMessageRef}/>

            </MessageContainer>

            <InputContainer>
                <InsertEmoticonIcon/>
                <Input
                value={input}
                onChange={(e)=>setInput(e.target.value)}
               
                />
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
                <MicIcon/>
            </InputContainer>


        </Container>
    )
}

export default ChatScreen

const Input = styled.input`

flex:1;
outline: 0;
border: none;
border-radius:10px;
padding: 20px;
margin-left:15px;
margin-right:15px;
background-color: whitesmoke;


`;

const Container = styled.div`

`;

const Header = styled.div`
position:sticky;
z-index: 100;
display: flex;
padding:11px;
height:80px;
align-items: center;
border-bottom: 1px solid whitesmoke;

`;


const HeaderInformation = styled.div`
margin-left:15px;
flex:1;

>h3 {
    margin-bottom:3px;
}

>P {
    font-size: 14px;
    color:grey;
}

`;

const HeaderIcons = styled.div`

`;

const MessageContainer = styled.div`
padding:30px;
background-color: #e5dcd8;
min-height: 90vh;


`;

const EndofMessage = styled.div`
    margin-bottom: 70px;


`;

const InputContainer = styled.form`

display: flex;
align-items: center;
padding: 10px;
position: sticky;
bottom: 0;
background-color: white;
z-index: 100;


`;

