const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../appBlog')

const api = supertest(app)

const Blog = require('../models/blog')
const { error } = require('../utils/logger')

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
})
describe('return and saved blog tests', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    }, 100000)

    test('id is defined', async () => {
        const response = await api.get('/api/blogs')
        const ids = response.body.map(b => b.id)
        expect(ids).toBeDefined()
    })

    test('save correct object to db', async () => {
        const blog = {
            title: 'add test',
            url: 'hhtps',
            author: 'Ha3',
            likes: 15
        }

        await api.post('/api/blogs')
            .send(blog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await helper.blogsInDb()
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const titles = blogAtEnd.map(b => b.title)
        expect(titles).toContain('add test')
    })

    test('require likes or replaced by 0 to pass the test', async () => {
        const addBlog = {
            title: 'can be empty likes',
            url: 'https'
        }
        await api.post('/api/blogs')
            .send(addBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await helper.blogsInDb()
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const likes = blogAtEnd.map(b => b.likes)
        expect(likes).toContain(0)

    })

    test('add blog can not miss url or title', async () => {
        const addBlog = {
            likes: 19
        }
        await api.post('/api/blogs')
            .send(addBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await helper.blogsInDb()
        expect(blogAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})

test('delete function', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogAtEnd = await helper.blogsInDb()

    expect(blogAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const titles = blogAtEnd.map(r => r.title)

    expect(titles).not.toContain(blogToDelete.title)
}, 1000000)

test('add user with wrong format', async () => {

    const addWrongUser = {
        username: "ha",
        password: "cd3223"
    }
    await api.post('/api/users')
        .send(addWrongUser)
        .expect(400)


})

afterAll(async () => {
    await mongoose.connection.close()
})