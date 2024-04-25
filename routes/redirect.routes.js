const {Router, request, response} = require('express')
const Link = require('../models/Link')
const router = Router()

router.get('/:code', async (request, response) => {
    try {
       const link = await Link.findOne({ code: request.params.code})

       if (link) {
         link.clicks++
         await link.save()
         return response.redirect(link.from)
       }
       response.status(404).json('ССылка не найдена')

      } catch (e) {
        response
          .status(500)
          .json({ message: "Что-то пошло не так, попробуйте еще раз" });
      }
})


module.exports = router