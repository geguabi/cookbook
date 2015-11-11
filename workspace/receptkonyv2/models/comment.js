module.exports = {
    identity: 'comment',
    connection: 'disk',
    attributes: {
        date: {
            type: 'datetime',
            defaultsTo: function () { return new Date(); },
            required: true,
        },
        text: {
            type: 'array',
            required: true,
        },
        making: {
            type: 'string',
            required: true,
        },
        username: {
            type: 'string',
            required: true,
            defaultsTo: 'anonymous (test)',
        },
        
        recipe: {
            model: 'recipe',
        },
    }
}