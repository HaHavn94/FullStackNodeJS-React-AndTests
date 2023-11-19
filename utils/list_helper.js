const dummy = (blogs) => {
    return 1;
}

const sumLikes = (blogs) => {
    const sum = blogs.reduce((sum, item) => sum + item.likes, 0)
    return sum;
}

const mostLike = (blogs) => {
    var maxLike = Math.max(...blogs.map(item => item.likes));
    var maxObj = blogs.find(b => b.likes === maxLike)
    return maxObj;
}

const mostBlogs = (blogs) => {
    var maxBlog = Math.max(...blogs.map(item => item.blogs));
    var maxObj = blogs.find(b => b.blogs === maxBlog)
    var returnedObj = {
        author: maxObj.author,
        blogs: maxObj.blogs
    }
    return returnedObj;
}

module.exports = {
    dummy, sumLikes, mostLike, mostBlogs
}