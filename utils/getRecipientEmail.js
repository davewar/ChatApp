const getRecipientEmail = (users, userLoggedin) => (
        users?.filter(userToFilter => userToFilter !==userLoggedin.email)[0]
)

export default getRecipientEmail