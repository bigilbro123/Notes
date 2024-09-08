const Note = require('../models/Node');
const User = require('../models/User');
// const note1 = [
//     {
//         user: '6697c7e25169dcf65c521b63',
//         title: 'The Art of Effective Communication',
//         body: 'Effective communication is essential in every aspect of life, from personal relationships to professional success. It involves not only conveying your ideas clearly but also actively listening to others. Good communication requires empathy, understanding, and the ability to adapt your message to your audience. By mastering the art of communication, you can build stronger connections, resolve conflicts more easily, and inspire others. Practice active listening, choose your words thoughtfully, and ensure your message is both heard and understood.'
//     },
//     {
//         user: '6697c7e25169dcf65c521b63',
//         title: 'The Power of Positive Thinking',
//         body: 'Positive thinking can have a profound impact on your overall well-being and success. By maintaining a positive outlook, you can improve your mood, reduce stress, and increase your resilience to challenges. Positive thinking involves focusing on constructive thoughts, setting achievable goals, and practicing gratitude. Embracing positivity can lead to greater happiness and a more fulfilling life.'
//     },
//     {
//         user: '6697c7e25169dcf65c521b63',
//         title: 'Time Management Tips',
//         body: 'Effective time management is crucial for productivity and achieving your goals. By organizing your tasks, setting priorities, and avoiding procrastination, you can make the most of your time. Time management strategies include creating to-do lists, using calendars, and breaking tasks into smaller steps. Implementing these techniques can help you stay focused and accomplish more in less time.'
//     }
// ];

exports.dashboard = async (req, res, next) => {

    const locals = {
        title: 'DASHBOARD',
        description: 'Node.js Project',
        name: req.user.firstName
    };


    let perpage = 8;
    let page = req.query.page || 1;

    try {

        const count = await Note.countDocuments({ user: req.user._id });

        // Fetch the notes with aggregation
        const notes = await Note.aggregate([
            { $match: { user: req.user._id } }, // Add this line to filter by user
            {
                $sort: { createdAt: -1 }
            },
            {
                $project: {
                    title: { $substr: ['$title', 0, 30] },
                    body: { $concat: [{ $substr: ['$body', 0, 70] }, '........'] }
                }
            }
        ])
            .skip(perpage * (page - 1))
            .limit(perpage);

        // Render the dashboard with the retrieved notes
        res.status(200).render('Dashboard/index', {
            locals,
            notes,
            current: page,
            pages: Math.ceil(count / perpage),
            layout: '../views/layouts/dashboard.ejs'
        });

    } catch (err) {
        console.error('Error retrieving notes:', err);
        res.status(500).send('Server Error');
    }
};

exports.dashboardSearch = async (req, res, next) => {
    const userId = req.params.id;
    const locals = {
        title: 'DASHBOARD',
        description: 'Node.js Project',
        name: req.user.firstName
    };



    try {


        // Fetch the notes with aggregation
        const notes = await Note.find({ _id: userId })
        console.log(notes);

        // Render the dashboard with the retrieved notes
        res.status(200).render('Dashboard/view-notes', {
            locals,
            notes,
            noteID: userId,
            layout: '../views/layouts/dashboard.ejs'
        });

    } catch (err) {
        console.error('Error retrieving notes:', err);
        res.status(500).send('Server Error');
    }


}




exports.dashboardUpdate = async (req, res) => {
    try {
        const noteId = req.params.id; // ID of the note to update
        const { title, body } = req.body; // Data to update

        console.log("Note ID:", noteId);
        console.log("Request Body:", req.body);

        // Find and update the note
        const updatedNote = await Note.findByIdAndUpdate(
            noteId, // Filter: _id of the note to update
            { title, body }, // Update data
            { new: true, runValidators: true } // Options: return the updated document and run validators
        );

        // Check if the note was found and updated
        if (updatedNote) {
            console.log("Updated Note:", updatedNote);
            res.redirect('/dashboard'); // Redirect on successful update
        } else {
            console.log("Note not found or not authorized.");
            res.status(404).send('Note not found or not authorized to update this note.'); // Corrected syntax
        }
    } catch (err) {
        console.error("Error updating note:", err);
        res.status(500).send('Server error'); // Corrected syntax
    }
};

exports.dashboardDelete = async (req, res) => {
    try {
        await Note.deleteOne({
            _id: req.params.id
        }).where({ user: req.user.id });
        res.redirect('/dashboard');
    } catch (err) {

        res.status(500).send(err);
    }
};
exports.dashboardCreate = async (req, res) => {
    const userId = req.params.id;
    const locals = {
        title: 'DASHBOARD',
        description: 'Node.js Project',
        name: req.user.firstName
    };



    try {


        // Fetch the notes with aggregation


        // Render the dashboard with the retrieved notes
        res.status(200).render('Dashboard/Craate', {
            locals,
            Note,
            User,
            layout: '../views/layouts/dashboard.ejs'
        });

    } catch (err) {
        console.error('Error retrieving notes:', err);
        res.status(500).send('Server Error');
    }


}


exports.dashboardCraeting = async (req, res) => {
    try {

        req.body.user = req.user.id
        await Note.create(req.body)


        res.redirect('/dashboard')


    } catch (err) {
        console.log(err);

    }


}
exports.dashboardSearch1 = async (req, res) => {
    try {
        res.status(200).render('Dashboard/search', {
            searchResult: [],
            layout: '../views/layouts/dashboard.ejs'
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};

exports.dashboardSearchSubmit = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNo = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
        const searchResult = await Note.find({
            $or: [
                { title: { $regex: new RegExp(searchNo, 'i') } },
                { body: { $regex: new RegExp(searchNo, 'i') } }
            ]
        }).where({ user: req.user.id });

        res.status(200).render('Dashboard/search', {
            searchResult: searchResult,
            layout: '../views/layouts/dashboard.ejs'
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Server error');
    }
};