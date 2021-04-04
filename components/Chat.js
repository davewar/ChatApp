import React from 'react'
import styled from 'styled-components'
import {Avatar, IconButton, Button} from '@material-ui/core'
import getRecipientEmail from '../utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth, db} from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import {useRouter} from 'next/router'

const Chat = ({id,users}) => {
            // console.log("UU,", users);
        const [user] = useAuthState(auth)
        const router = useRouter()
        const [recipientSnapshot] = useCollection(db.collection('users').where('email','==',getRecipientEmail(users,user)))

        const recipient = recipientSnapshot?.docs?.[0]?.data()

        const recipientEmail = getRecipientEmail(users, user)
        // console.log("R",recipientEmail);

        const enterChat = ()=>{
            router.push(`/chat/${id}`)
        }

    return (
        <Container onClick={enterChat}>
            {
                recipient ? (
                    <UserAvator src={recipient?.photoURL}/>
                ): <UserAvator>{recipientEmail[0]}</UserAvator>
            }
            
            <p>{recipientEmail}</p>
        </Container>
    )
}

export default Chat

const Container = styled.div`
display: flex;
align-items: center;
cursor: pointer;
padding: 15px;
word-break: break-word;

:hover{

    background-color: #e9eaeb;
}

`;

const UserAvator = styled(Avatar)`
margin: 5px;
margin-right: 15px;


`;
