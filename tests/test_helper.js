const Blog = require('../models/blog')

const initialBlogs = [
    {
        "title": "ha",
        "author": "ha",
        "url": "url",
        "likes": 10,
        id: "6548bc8c41ae66ff6c61870b"
    },
    {
        "title": "ha2",
        "author": "ha2",
        "url": "url2",
        "likes": 12,

    }
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}