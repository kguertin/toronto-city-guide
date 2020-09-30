const User = require('../models/user');
const Message = require('../models/message');

exports.getActiveUser = async (req, res) => {
    const user = await User.findById(req.user)
    console.log('user', user);
    res.status(200).json({
        username: user.username,
        id: user._id,
        contacts: user.contact,
        contactId: undefined,
        schedules: user.schedules,
        favourites: user.favourites
    })
}

exports.findUser = async (req, res) => {
    try {
        const { username } = req.body;
    
        const currentUser = await User.findById(req.user);

        if (currentUser.username === username) {
            res.status(400).json({ msg: 'Cant add yourself!' });
        }
    
        const isContact = currentUser.contact.find(i => {
            return i.username === username;
        })
    
        if (isContact) {
            return res.status(400).json({ msg: 'User already a contact' });
        }
    
        const newContact = await User.findOne({ username });

        if (!newContact) {
            return res.status(400).json({msg: 'That user does not exist'});
        }

        res.status(200).json({username: newContact.username, id: newContact._id});

    } catch (err) {
        console.log(err);
    }
}

exports.addContact = async (req, res) => {
    try {
        const { userData } = req.body;
    
        const findUser = await User.findById(req.user);

        const includesUser = findUser.contact.find(i => i.username === userData.username);
        
        if (includesUser) {
            return res.status(400).json({msg: 'That contact has already been added'})
        }

        findUser.contact.push(userData);
        findUser.save();

        res.status(201).json({ userData })
        
    } catch (err) {
        console.log(err);
    }
}

exports.removeContact = async (req, res) => {
    try {
        const { contactId } = req.body;
        const userData = await User.findById(req.user);
        const newContacts = userData.contact.filter(i => i.id !== contactId);
        userData.contact = newContacts;
        userData.save();
        res.status(200).json({msg: 'contact deleted', newContacts});
    } catch (err) {
        console.log(err);
    }
}

exports.addFavourite = (req, res) => {
    const { place } = req.body;
    User.findById(req.user)
        .then(user => {
            user.favourites.push(place);
            user.save();
        })
    res.status(201).json({ place })
}

exports.removeFavourite = async (req, res) => {
    const { place } = req.body;
    const user = await User.findById(req.user)
    user.favourites = user.favourites.filter(fave => fave.name != place[1])
    const favouritesData = await user.save();    
    res.status(200).json({ favouritesData })
}

exports.getUserMessages = async (req, res) => {
    
    try {

    const { userId, contactId } = req.body
    const messageData = await Message.find();
    let messageHistory

    if (!messageData || messageData.length < 1) {
        const newMessages = new Message({ users: [userId, contactId], messages: [] });
        messageHistory = await newMessages.save();
        res.status(200).json({ messageHistory: messageHistory });
        return
    }
    
    const messageFilter = messageData.filter(i => {
        if (i.users.includes(userId) && i.users.includes(contactId)) {
            return i;
        }
    });

    if (!messageFilter.length){
        const newMessages = new Message({ users: [userId, contactId], messages: [] });
        messageHistory = await newMessages.save();
    }

    if (messageFilter.length){
        messageHistory = messageFilter[0]
    }

    res.status(200).json({ messageHistory: messageHistory });
    
    } catch (err) {
        console.log(err);
        // res.status(404).json({ err })
    }
}

exports.updateUserMessages = async (req, res) => {
    try {
        const { newMessage, messagesId } = req.body

        const query = {_id: messagesId}
        const messages = await Message.findById(query)
        const newMessageHistory = [...messages.messageHistory, newMessage]
        messages.messageHistory = newMessageHistory
        const savedMessages = await messages.save();

        res.status(200).json({ savedMessages: savedMessages });

    } catch (err) {
        console.log(err)
    }

}

exports.getFavourites = async (req, res) => {
    try{
        let favouritesData = await User.findById(req.user);
        favouritesData = favouritesData.favourites;
        res.status(200).json({ favourites: favouritesData });
    } catch(err) {
        console.log(err);
    }
}


// // Cast to number failed for value "bar" at path "age"
// await Person.updateOne({}, { age: 'bar' });

// // Path `age` (-1) is less than minimum allowed value (0).
// await Person.updateOne({}, { age: -1 }, { runValidators: true });


// person.friends.push(friend);
// person.save(done);


// exports.addFriend = function (req, res, next) {
//     var friend = { "firstName": req.body.fName, "lastName": req.body.lName };
//     Users.findOneAndUpdate({ name: req.user.name }, { $push: { friends: friend } });
// };


// PersonModel.update(
//     { _id: person._id }, 
//     { $push: { friends: friend } },
//     done
// );