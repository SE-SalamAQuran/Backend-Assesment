const router = require("express").Router();
const axios = require("axios");
const memoryCache = require("memory-cache");


// /ping
router.get('/ping', (req, res) => {
    res.status(200).json({ "success": true });
})

// /posts
router.get('/posts', (req, res) => {

    const tags = req.query.tags.split(',');
    const sortBy = req.query.sortBy || 'id'; //default value is id
    const direction = req.query.direction || 'asc'; //default value is asc

    //List of acceptable sortBy values
    const acc_sortBy = ['likes', 'id', 'popularity', 'reads'];
    //List of acceptable directions
    const acc_directions = ['asc', 'desc'];
    var requests = [];

    if (tags.length < 1) {
        res.status(400).json({ "error": "Tags parameter is required" });
    }
    if (!acc_sortBy.includes(sortBy)) {
        res.status(400).json({ "error": "Sortby parameter is invalid" });
    }
    if (!acc_directions.includes(direction)) {
        res.status(400).json({ "error": "Direction parameter is invalid" });
    }

    if (acc_sortBy.includes(sortBy) && acc_directions.includes(direction) && tags.length != 0) {

        tags.map(t => {
            requests.push(
                axios.get('https://api.hatchways.io/assessment/blog/posts', {
                    params: {
                        tag: t,
                        sortBy: sortBy,
                        direction: direction
                    }
                })

            )

        })

    }
    result = []; //The result of all concurrent axios requests but unfiltered yet
    posts = []; //Posts array extracted from the response of the concurrent axios requests
    axios.all(requests).then(axios.spread(function (...requests) {
        requests.forEach(r => {
            memoryCache.put(`${r}`, r.data);
            result.push(memoryCache.get(`${r}`))
        })
        result.map(re => {
            re.posts.forEach(post => {
                // console.log(post.id);
                if (!posts.includes(post)) {
                    posts.push(post);
                }

            })
        })
        let serializedArr = posts.map(p => JSON.stringify(p));
        var serializedSet = new Set(serializedArr);
        const serializedArrUnique = [...serializedSet];
        const uniquePosts = serializedArrUnique.map(e => JSON.parse(e));


        console.log(uniquePosts);
        // console.log(JSON.stringify(filtered_posts, null, 4));
        res.status(200).send(uniquePosts);

    })).catch(err => { console.error(err) });


})

module.exports = router;