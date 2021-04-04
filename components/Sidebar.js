import React from 'react'
import styled from 'styled-components'
import {Avatar, IconButton, Button} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import SearchIcon from '@material-ui/icons/Search';
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase';
import {useAuthState} from 'react-firebase-hooks/auth'
import {useCollection} from 'react-firebase-hooks/firestore'
import Chat from './Chat'
import {useRouter} from 'next/router'


const Sidebar = () => {

    const router = useRouter()
        const [user] = useAuthState(auth)
        const userChatref = db.collection('chats').where('users','array-contains',user.email)
        const [chatSnapshot, loading, error] = useCollection(userChatref)

    const createChat = ()=>{
            const input = prompt("please enter email address for the user you wish to chat with")

                if(!input) return null;

                // email valid
                if(EmailValidator.validate(input)&& !chatAlreadyExists(input) && input !==user.email){
                    // add the chat to the DB chats collection
                    db.collection('chats').add({
                        users: [user.email, input]
                    })

                }

                // chat exists

    }

    const chatAlreadyExists = (recipientEmail)=>{
           return !!chatSnapshot?.docs.find((chat)=>
            chat.data().users.find(user=>user===recipientEmail)?.length>0)

    }

    return (
        <Container>
          <Header>
            <UserAvator onClick={()=>auth.signOut()} />
            <IconsContainer>
                <IconButton>
                        <ChatIcon/>               
                </IconButton>

                <IconButton>                   
                        <MoreVertIcon/>
                </IconButton>
            </IconsContainer>
        </Header>

        <Search>
            <SearchIcon/>
            <SearchInput placeholder="search chats"/>
        </Search>

        <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

        {/* list of chats */}
                {
                    chatSnapshot?.docs.map(chat=>{
                        return <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    })
                }
        

        </Container>
    )
}

export default Sidebar

const Container = styled.div`
flex: 0.45;
border-right: 1px solid whitesmoke;
height:100vh;
min-width: 300px;
max-width: 350px;
overflow-y: scroll;

///hides the scroll bar
::-webkit-scrollbar{
    display: none;
}
-ms--ms-overflow-style: none;
scrollbar-width: none;

`;

const Search = styled.div`
display: flex;
align-items: center;
padding: 5px;
border-radius: 2px;

`;

const SidebarButton = styled(Button)`
width:100%;

&&&{
border-top: 1px solid whitesmoke;
border-bottom: 1px solid whitesmoke;
}


`;


const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Header = styled.div`
display: flex;
position: sticky;
top:0;
background-color: white;
z-index:1;
justify-content: space-between;
align-items: center;
padding:15px;
height:80px;
border-bottom: 1px solid whitesmoke;



`;


const UserAvator = styled(Avatar)`
cursor: pointer;
:hover{
    opacity: 0.8;
}

`;

const IconsContainer = styled.div`


`;
