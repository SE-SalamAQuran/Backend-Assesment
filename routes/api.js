const router = require("express").Router();
const axios = require("axios");
const memoryCache = require("memory-cache");

// //MERGE function to merge arrays
// function merge(left, right, key) {
//     let arr = [];
//     // Break out of loop if any one of the array gets empty
//     while (left.length && right.length) {
//         // Pick the smaller among the smallest element of left and right sub arrays 
//         if (left[0].key < right[0].key) {
//             arr.push(left.shift());
//         } else {
//             arr.push(right.shift());
//         }
//     }

//     //Perform merge sort to get the results sorted correctly
//     function mergeSort(array) {
//         const half = array.length / 2;

//         // Base case or terminating case
//         if (array.length < 2) {
//             return array;
//         }

//         const left = array.splice(0, half);
//         return merge(mergeSort(left), mergeSort(array));
//     }

//     // Concatenating the leftover elements
//     // (in case we didn't go through the entire left or right array)
//     return [...arr, ...left, ...right]
// }


// /ping
router.get('/ping', (req, res) => {
    res.status(200).json({ "success": true });
})

// /posts
router.get('/posts', (req, res) => {
    if (req.query.tags) {

        const tags = req.query.tags.split(',');
        const sortBy = req.query.sortBy || 'id'; //default value is id
        const direction = req.query.direction || 'asc'; //default value is asc

        //List of acceptable sortBy values
        const acc_sortBy = ['likes', 'id', 'popularity', 'reads'];
        //List of acceptable directions
        const acc_directions = ['asc', 'desc'];
        var requests = [];


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
                    if (!posts.includes(post)) {
                        posts.push(post);
                    }

                })
            })
            let serializedArr = posts.map(p => JSON.stringify(p));
            var serializedSet = new Set(serializedArr);
            const serializedArrUnique = [...serializedSet];
            const uniquePosts = serializedArrUnique.map(e => JSON.parse(e));
            if (direction === 'asc') {
                uniquePosts.sort((a, b) => parseFloat(a[`${sortBy}`]) - parseFloat(b[`${sortBy}`]));
            }
            else {
                uniquePosts.sort((a, b) => parseFloat(b[`${sortBy}`]) - parseFloat(a[`${sortBy}`]));

            }


            res.status(200).json({ "posts": uniquePosts });

        })).catch(err => { console.error(err) });


    }
    else {
        res.status(400).json({ "error": "Tags parameter is required" })
    }

})

module.exports = router;