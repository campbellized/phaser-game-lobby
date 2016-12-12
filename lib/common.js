// In this demo new users cannot be registered from the client.
Accounts.config({
    forbidClientAccountCreation: true
});


Meteor.methods({
    /**
     * Update the chat history in the Message collection with a user's new alias.
     * @param  {string} userId  The _id of a document in the User collection
     * @param  {string} alias The new alias that the user
     * @return {undefined}
     */
    updateChat: function(id, alias){
        Messages.update({userId: id},
                        {$set: {userAlias: alias}},
                        {multi: true});
    }
});
