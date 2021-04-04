import styled  from 'styled-components'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth, db} from '../firebase'
import moment from 'moment'


const Message = ({user ,message}) => {
             
    const [userLoggedIn] = useAuthState(auth)
     

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver ;

    
    return (
        <Container>
            <TypeOfMessage>{message.message}
             <Timestamp> 
             {
                
                message.timestamp ? moment(message.timestamp).format('LT') : "..."
            }
           </Timestamp>
            </TypeOfMessage>
           
            
            {/* <p>{message.message}</p> */}
        </Container>
    )
}

export default Message

const Container = styled.div``;

const MessageElement = styled.p`
width: fit-content;
padding:15px;
border-radius:8px;
min-width:60px;
padding-bottom: 26px;
position: relative;
text-align:right;
`;

const Sender = styled(MessageElement)`
        margin-left: auto;
        background-color: lightcyan;

`;

const Receiver = styled(MessageElement)`
        text-align: left;
        background-color: whitesmoke;

`;

const Timestamp = styled.span`
color:grey;
padding: 10px;
font-size: 9px;
position: absolute;
bottom: 0;
text-align: right;
right: 0;

`;
