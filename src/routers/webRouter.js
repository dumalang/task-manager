const express = require('express')
const router = new express.Router()

router.get('/', (req, res) => {
    res.render('pages/index', {
        title: "Home Bro",
        data: [{
            name: 'jimmy',
            age: 28
        },{
            name: 'justitia',
            age: 27
        },]
    })
})

module.exports = router