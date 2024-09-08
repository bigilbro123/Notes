exports.homepage = async (req, res) => {
    const locals = {
        title: 'node js',
        description: 'node js project'
    }
    res.status(200).render('index', locals)
}


exports.aboutpage = async (req, res) => {
    const locals = {
        title: 'About',
        description: 'node js project in about page'
    }
    res.render('about', { locals, layout: '../views/layouts/front-page' })
}
exports.Features = async (req, res) => {
    const locals = {
        title: 'Features',
        description: 'node js project in about page'
    }
    res.render('Features', { locals, layout: '../views/layouts/front-page' })
}
