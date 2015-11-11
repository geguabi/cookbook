module.exports = {
    identity: 'recipe',
    connection: 'disk',
    attributes: {
        
        
        name: {
            type: 'string',
            required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        status: {
            type: 'string',
            enum: ['new', 'assigned', 'success', 'rejected', 'pending'],
            required: true,
        },
        pic: {
            type: 'string',
            required: false
        },
        user: {
            model: 'user',
        },
        comments: {
            collection: 'comment',
             via: 'recipe'
         },
    }
}